"use strict";

/* =========================================================
   STUDIO WEB — « LA LUMIÈRE QUI POUSSE »
   1. Les plantes lumineuses (introduction et contact), en canvas.
   2. La racine qui longe la page, allume chaque section et y
      fait pousser des vrilles ; un champ de spores la prolonge.
   3. Les mouvements orchestrés avec GSAP et ScrollTrigger.
   Tout le contenu reste visible sans JavaScript, sans GSAP
   et pour les visiteurs qui réduisent les animations.
   ========================================================= */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia("(max-width: 760px)");
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  const COLORS = {
    veine: [159, 255, 233],
    cyan: [63, 224, 208],
    lilas: [181, 123, 255],
    eclosion: [244, 255, 253],
  };

  const rgba = ([r, g, b], a) => `rgba(${r}, ${g}, ${b}, ${a})`;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const quad = (a, c, b, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;

  // Générateur pseudo-aléatoire stable : chaque plante garde la même forme à chaque visite.
  function seeded(seed) {
    let t = seed >>> 0;
    return () => {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* -------------------------------------------------------
     1. UNE PLANTE LUMINEUSE
     options.layout(state, rect) renvoie la disposition.
     ------------------------------------------------------- */

  function createPlant(canvas, options) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      base: { x: 0, y: 0 },
      size: 0,
      stems: [],
      caps: [],
      roots: [],
      spores: [],
      growth: 0,
      cache: null,
      pointer: { x: -9999, y: -9999, strength: 0, target: 0 },
      visible: false,
      frame: 0,
      time: 0,
      ready: false,
    };

    function build() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.width = rect.width;
      state.height = rect.height;
      canvas.width = Math.round(rect.width * state.dpr);
      canvas.height = Math.round(rect.height * state.dpr);
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

      const layout = options.layout(state, rect);
      state.base = layout.base;
      state.size = layout.size;
      state.ceiling = layout.ceiling || 0;
      state.lift = layout.lift || 1.1;
      const [minAngle, maxAngle] = layout.angles || [0.03, Math.PI - 0.03];
      const size = layout.size;
      const random = seeded(options.seed || 1984);

      // Tiges : courbes effilées, pieds légèrement écartés, qui ondulent doucement.
      state.stems = [];
      state.caps = [];
      const count = layout.stems;
      for (let i = 0; i < count; i += 1) {
        const spread = count > 1 ? (i - (count - 1) / 2) / ((count - 1) / 2) : 0;
        const height = size * (0.66 + random() * 0.34) * (1 - Math.abs(spread) * 0.2);
        const foot = { x: state.base.x + spread * size * 0.05, y: state.base.y };
        const top = {
          x: state.base.x + spread * size * 0.36 + (random() - 0.5) * size * 0.08,
          y: state.base.y - height,
        };
        const bend = {
          x: foot.x + (top.x - foot.x) * 0.15 + (random() - 0.5) * size * 0.22,
          y: foot.y - height * 0.6,
        };
        const stem = {
          foot, bend, top,
          born: 0.14 + random() * 0.08,
          span: 0.42,
          width: 2.4 + random() * 0.8,
          sway: size * (0.012 + random() * 0.012),
          phase: random() * Math.PI * 2,
          color: i % 2 ? COLORS.cyan : COLORS.lilas,
        };
        state.stems.push(stem);
        state.caps.push({
          stem,
          radius: size * (0.13 + random() * 0.07) * (1 - Math.abs(spread) * 0.22),
          color: i % 2 ? COLORS.cyan : COLORS.lilas,
          phase: random() * Math.PI * 2,
        });
      }

      // Racines : un réseau qui s'étale à l'horizontale sous la plante.
      state.roots = [];
      function root(x, y, angle, length, depth, born, maxDepth) {
        if (depth > maxDepth || length < 5) return;
        const pieces = 6;
        let px = x;
        let py = y;
        let a = angle;
        for (let p = 1; p <= pieces; p += 1) {
          // Les racines s'étalent sur les côtés ou s'enfoncent, jamais vers le haut.
          a += (random() - 0.5) * 0.42;
          a = angle > Math.PI / 2 && maxAngle < Math.PI / 2
            ? clamp(a, Math.PI - maxAngle, Math.PI - minAngle)
            : clamp(a, minAngle, maxAngle);
          const nx = px + Math.cos(a) * (length / pieces);
          const ny = py + Math.sin(a) * (length / pieces);
          const distance = Math.hypot(nx - state.base.x, ny - state.base.y);
          state.roots.push({
            from: { x: px, y: py }, to: { x: nx, y: ny },
            born: born + (p / pieces) * 0.08, life: 0.05,
            width: Math.max(0.45, 1.5 - depth * 0.22),
            alpha: clamp(0.85 - depth * 0.11, 0.2, 0.85) * clamp(1 - distance / (size * layout.reach), 0.08, 1),
          });
          px = nx;
          py = ny;
        }
        const children = depth < 2 ? 3 : 2;
        for (let c = 0; c < children; c += 1) {
          const turn = (c - (children - 1) / 2) * (0.5 + random() * 0.35);
          root(px, py, a + turn, length * (0.6 + random() * 0.18), depth + 1, born + 0.08, maxDepth);
        }
      }

      layout.roots.forEach(([angle, length]) => {
        root(state.base.x, state.base.y, angle + (random() - 0.5) * 0.08, size * length * (0.85 + random() * 0.3), 0, 0.02 + random() * 0.08, layout.depth);
      });
      if (layout.mirror) {
        // Côté gauche : même réseau, orienté vers la gauche.
        layout.roots.forEach(([angle, length]) => {
          root(state.base.x, state.base.y, Math.PI - angle, size * length * (0.85 + random() * 0.3), 0, 0.02 + random() * 0.08, layout.depth);
        });
      }

      // Spores : en panaches au-dessus des ombrelles.
      state.spores = Array.from({ length: layout.spores }, () => spawnSpore(random, true));
      state.cache = null;
      state.ready = true;
    }

    function stemPoint(stem, t, time) {
      const sway = Math.sin(time * 0.0006 + stem.phase) * stem.sway * t * t;
      return {
        x: quad(stem.foot.x, stem.bend.x, stem.top.x, t) + sway,
        y: quad(stem.foot.y, stem.bend.y, stem.top.y, t),
      };
    }

    function spawnSpore(random = Math.random, anywhere = false) {
      const cap = state.caps[Math.floor(random() * state.caps.length)];
      const origin = cap ? cap.stem.top : state.base;
      const radius = cap ? cap.radius : 40;
      const lift = anywhere ? random() * state.size * state.lift : random() * 10;
      return {
        x: origin.x + (random() - 0.5) * radius * (1.1 + lift / (state.size || 1)),
        y: origin.y - radius * 0.5 - lift,
        vx: (random() - 0.5) * 0.1,
        vy: -(0.18 + random() * 0.4),
        size: 0.6 + random() * 1.5,
        phase: random() * Math.PI * 2,
        life: anywhere ? random() : 0,
      };
    }

    function drawRoots(target, growth) {
      target.globalCompositeOperation = "lighter";
      target.lineCap = "round";
      for (const seg of state.roots) {
        if (growth <= seg.born) continue;
        const t = clamp((growth - seg.born) / seg.life, 0, 1);
        const x = seg.from.x + (seg.to.x - seg.from.x) * t;
        const y = seg.from.y + (seg.to.y - seg.from.y) * t;
        target.beginPath();
        target.moveTo(seg.from.x, seg.from.y);
        target.lineTo(x, y);
        target.strokeStyle = rgba(COLORS.cyan, seg.alpha * 0.1);
        target.lineWidth = seg.width * 5;
        target.stroke();
        target.strokeStyle = rgba(COLORS.veine, seg.alpha);
        target.lineWidth = seg.width;
        target.stroke();
      }
      target.globalCompositeOperation = "source-over";
    }

    // Tiges effilées : larges au pied, fines sous l'ombrelle.
    function drawStems(growth, time) {
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      const steps = 28;
      for (const stem of state.stems) {
        const reach = clamp((growth - stem.born) / stem.span, 0, 1);
        if (reach <= 0) continue;
        let previous = stemPoint(stem, 0, time);
        for (let s = 1; s <= steps; s += 1) {
          const t = (s / steps) * reach;
          const point = stemPoint(stem, t, time);
          const taper = stem.width * (1 - t * 0.72);
          const color = t < 0.45 ? COLORS.cyan : stem.color;
          ctx.beginPath();
          ctx.moveTo(previous.x, previous.y);
          ctx.lineTo(point.x, point.y);
          ctx.strokeStyle = rgba(color, 0.1);
          ctx.lineWidth = taper * 4;
          ctx.stroke();
          ctx.strokeStyle = rgba(color, 0.85);
          ctx.lineWidth = taper * 0.6;
          ctx.stroke();
          previous = point;
        }
      }
      ctx.globalCompositeOperation = "source-over";
    }

    // Ombrelles : cloches translucides, nervures, lamelles et bord perlé de lumière.
    function drawCaps(growth, time) {
      ctx.globalCompositeOperation = "lighter";
      for (const cap of state.caps) {
        const open = clamp((growth - cap.stem.born - cap.stem.span) / 0.2, 0, 1);
        if (open <= 0) continue;
        const top = stemPoint(cap.stem, 1, time);
        const breathe = 0.86 + Math.sin(time * 0.0011 + cap.phase) * 0.14;
        const near = Math.hypot(state.pointer.x - top.x, state.pointer.y - top.y);
        const wake = clamp(1 - near / 260, 0, 1) * state.pointer.strength;
        const r = cap.radius * (0.35 + open * 0.65);
        const tilt = Math.sin(time * 0.0006 + cap.stem.phase) * 0.06;

        ctx.save();
        ctx.translate(top.x, top.y);
        ctx.rotate(tilt);

        const halo = ctx.createRadialGradient(0, -r * 0.3, 0, 0, -r * 0.3, r * 2.6);
        halo.addColorStop(0, rgba(cap.color, (0.2 + wake * 0.22) * open * breathe));
        halo.addColorStop(1, rgba(cap.color, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, -r * 0.3, r * 2.6, 0, Math.PI * 2);
        ctx.fill();

        // La cloche.
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.bezierCurveTo(-r * 1.02, -r * 0.98, r * 1.02, -r * 0.98, r, 0);
        ctx.quadraticCurveTo(0, r * 0.2, -r, 0);
        const body = ctx.createRadialGradient(0, -r * 0.62, r * 0.05, 0, -r * 0.3, r * 1.1);
        body.addColorStop(0, rgba(COLORS.eclosion, (0.42 + wake * 0.3) * open));
        body.addColorStop(0.45, rgba(cap.color, 0.26 * open * breathe));
        body.addColorStop(1, rgba(cap.color, 0.05 * open));
        ctx.fillStyle = body;
        ctx.fill();

        // Nervures, du sommet vers le bord.
        ctx.strokeStyle = rgba(COLORS.eclosion, 0.22 * open);
        ctx.lineWidth = 0.7;
        for (let g = -3; g <= 3; g += 1) {
          const edge = (g / 3.4) * r;
          ctx.beginPath();
          ctx.moveTo(0, -r * 0.74);
          ctx.quadraticCurveTo(edge * 0.6, -r * 0.6, edge, 0);
          ctx.stroke();
        }

        // Lamelles sous la cloche.
        ctx.strokeStyle = rgba(cap.color, 0.4 * open);
        for (let g = -6; g <= 6; g += 1) {
          ctx.beginPath();
          ctx.moveTo(0, r * 0.06);
          ctx.lineTo((g / 6.4) * r, r * 0.02 + Math.abs(g) * 0.4);
          ctx.stroke();
        }

        // Bord perlé.
        const beads = 15;
        for (let b = 0; b <= beads; b += 1) {
          const t = b / beads;
          const x = -r + t * 2 * r;
          const y = Math.sin(t * Math.PI) * r * 0.1;
          const pulse = 0.55 + Math.sin(time * 0.003 + b * 0.7 + cap.phase) * 0.35;
          ctx.fillStyle = rgba(COLORS.eclosion, clamp(pulse + wake * 0.4, 0, 1) * open);
          ctx.beginPath();
          ctx.arc(x, y, 1.25, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    function drawSpores(time, animate) {
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < state.spores.length; i += 1) {
        const spore = state.spores[i];
        if (spore.y < state.ceiling) continue;
        if (animate) {
          spore.x += spore.vx + Math.sin(time * 0.001 + spore.phase) * 0.14;
          spore.y += spore.vy;
          spore.life += 0.0022;
          const dx = spore.x - state.pointer.x;
          const dy = spore.y - state.pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 120 && state.pointer.strength > 0.05) {
            spore.x += (dx / (distance || 1)) * 0.7;
            spore.y += (dy / (distance || 1)) * 0.7;
          }
          if (spore.y < state.ceiling || spore.life > 1) state.spores[i] = spawnSpore();
        }
        const near = Math.hypot(spore.x - state.pointer.x, spore.y - state.pointer.y);
        const glow = clamp(1 - near / 180, 0, 1) * state.pointer.strength;
        const fade = Math.sin(clamp(spore.life, 0, 1) * Math.PI);
        const twinkle = 0.55 + Math.sin(time * 0.003 + spore.phase) * 0.45;
        const alpha = clamp(fade * twinkle * 0.85 + glow * 0.6, 0, 1);
        ctx.fillStyle = rgba(COLORS.eclosion, alpha);
        ctx.beginPath();
        ctx.arc(spore.x, spore.y, spore.size * (1 + glow), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgba(COLORS.cyan, alpha * 0.16);
        ctx.beginPath();
        ctx.arc(spore.x, spore.y, spore.size * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    function drawPointerLight() {
      if (state.pointer.strength <= 0.01) return;
      ctx.globalCompositeOperation = "lighter";
      const light = ctx.createRadialGradient(state.pointer.x, state.pointer.y, 0, state.pointer.x, state.pointer.y, 220);
      light.addColorStop(0, rgba(COLORS.cyan, 0.09 * state.pointer.strength));
      light.addColorStop(1, rgba(COLORS.cyan, 0));
      ctx.fillStyle = light;
      ctx.fillRect(state.pointer.x - 220, state.pointer.y - 220, 440, 440);
      ctx.globalCompositeOperation = "source-over";
    }

    // Une fois adultes, les racines sont figées dans une image en cache.
    function cacheRoots() {
      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const offCtx = off.getContext("2d");
      offCtx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      drawRoots(offCtx, 2);
      state.cache = off;
    }

    function render(time, animate) {
      if (!state.ready) return;
      ctx.clearRect(0, 0, state.width, state.height);
      if (state.growth >= 1) {
        if (!state.cache) cacheRoots();
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(state.cache, 0, 0);
        ctx.restore();
      } else {
        drawRoots(ctx, state.growth);
      }
      drawPointerLight();
      drawStems(state.growth, time);
      drawCaps(state.growth, time);
      if (state.growth > 0.6) drawSpores(time, animate);
    }

    function loop(time) {
      state.frame = 0;
      if (!state.visible || document.hidden) return;
      state.time = time;
      state.pointer.strength += (state.pointer.target - state.pointer.strength) * 0.08;
      render(time, true);
      state.frame = window.requestAnimationFrame(loop);
    }

    function start() {
      if (reduceMotion.matches) {
        render(0, false);
        return;
      }
      if (!state.frame && state.visible) state.frame = window.requestAnimationFrame(loop);
    }

    function stop() {
      if (state.frame) window.cancelAnimationFrame(state.frame);
      state.frame = 0;
    }

    const host = canvas.parentElement;
    host.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      state.pointer.x = event.clientX - rect.left;
      state.pointer.y = event.clientY - rect.top;
      state.pointer.target = 1;
    }, { passive: true });
    host.addEventListener("pointerleave", () => { state.pointer.target = 0; });

    // La boucle ne tourne que lorsque la plante est à l'écran.
    new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible) start();
      else stop();
    }).observe(canvas);

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) start();
    });

    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        render(state.time, false);
      }, 150);
    }, { passive: true });

    build();

    return {
      rebuild() {
        build();
        render(state.time, false);
      },
      start,
      // Point d'ancrage dans le repère de la page, pour y relier la racine.
      anchor() {
        const rect = canvas.getBoundingClientRect();
        return { x: rect.left + state.base.x, y: rect.top + window.scrollY + state.base.y };
      },
      setGrowth(value) {
        state.growth = value;
        if (!state.frame) render(state.time, false);
      },
    };
  }

  /* Disposition des deux plantes */

  function heroLayout(state, rect) {
    if (mobileQuery.matches) {
      // Sur mobile, la plante a sa place réservée juste après les boutons.
      const slot = document.querySelector(".hero-plant-slot");
      const slotRect = slot ? slot.getBoundingClientRect() : null;
      const hasSlot = slotRect && slotRect.height > 0;
      const room = hasSlot ? slotRect.height : 320;
      return {
        base: { x: state.width * 0.56, y: hasSlot ? slotRect.bottom - rect.top - 18 : state.height - 40 },
        size: Math.min(state.width * 0.78, room * 0.98, 330),
        stems: 3,
        spores: 34,
        depth: 4,
        reach: 0.9,
        lift: 0.4,
        ceiling: hasSlot ? slotRect.top - rect.top + 12 : 0,
        angles: [0.02, 0.22],
        roots: [[0.04, 0.8], [0.12, 0.5]],
        mirror: true,
      };
    }
    return {
      base: { x: state.width * 0.76, y: state.height * 0.9 },
      size: Math.min(state.width * 0.36, state.height * 0.62, 540),
      stems: 4,
      spores: 110,
      depth: 6,
      reach: 2.3,
      ceiling: 96,
      // Réseau horizontal : surtout vers la droite, quelques racines filent sous la colonne de texte.
      roots: [
        [0.02, 0.85], [0.12, 0.6], [0.3, 0.42], [Math.PI * 0.5, 0.25],
        [Math.PI - 0.03, 1.5], [Math.PI - 0.1, 1.05], [Math.PI - 0.22, 0.6],
      ],
    };
  }

  function contactLayout(state, rect) {
    if (mobileQuery.matches) {
      return {
        base: { x: state.width * 0.5, y: state.height - 36 },
        size: Math.min(state.width * 0.55, 220),
        stems: 3,
        spores: 30,
        depth: 4,
        reach: 1.4,
        roots: [[0.04, 0.8], [Math.PI - 0.04, 0.8], [Math.PI * 0.5, 0.2]],
      };
    }
    // Le pied de la plante est sous la dernière ligne de texte : la racine l'atteint sans rien traverser.
    const email = document.querySelector(".contact-email");
    const note = document.querySelector(".contact-note");
    const emailRect = email ? email.getBoundingClientRect() : null;
    const noteRect = note ? note.getBoundingClientRect() : null;
    const x = emailRect ? Math.min(emailRect.right - rect.left + 190, state.width - 150) : state.width * 0.78;
    const y = noteRect ? Math.min(noteRect.bottom - rect.top + 56, state.height - 30) : state.height * 0.8;
    return {
      base: { x, y },
      size: Math.min(state.width * 0.22, 300),
      stems: 3,
      spores: 44,
      depth: 5,
      reach: 1.6,
      roots: [[0.06, 0.7], [Math.PI - 0.06, 0.9], [Math.PI * 0.5, 0.3], [0.4, 0.4]],
    };
  }

  /* -------------------------------------------------------
     2. LA RACINE QUI LONGE LA PAGE
     ------------------------------------------------------- */

  function createRoot(main, heroPlant, contactPlant) {
    const svg = main.querySelector(".root-layer");
    if (!svg) return null;
    const path = svg.querySelector(".root-path");
    const glow = svg.querySelector(".root-glow");
    const nodesGroup = svg.querySelector(".root-nodes");
    const ns = "http://www.w3.org/2000/svg";

    const state = { length: 0, samples: [], nodes: [], steps: [] };

    const make = (tag, attributes) => {
      const element = document.createElementNS(ns, tag);
      Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
      return element;
    };

    function build() {
      const mainRect = main.getBoundingClientRect();
      const mainTop = mainRect.top + window.scrollY;
      const mobile = mobileQuery.matches;
      const width = main.clientWidth;
      const height = main.scrollHeight;
      svg.setAttribute("width", width);
      svg.setAttribute("height", height);
      svg.style.height = `${height}px`;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

      const local = (rect) => ({ x: rect.left - mainRect.left, y: rect.top - mainRect.top });
      const fromPage = (point) => ({ x: point.x - mainRect.left, y: point.y - mainTop });

      // La racine reste dans la marge gauche de la colonne de contenu.
      const column = main.querySelector(".projects") || main;
      const columnRect = column.getBoundingClientRect();
      const style = getComputedStyle(column);
      const columnLeft = columnRect.left - mainRect.left + parseFloat(style.paddingLeft || "0");
      const columnRight = columnRect.right - mainRect.left - parseFloat(style.paddingRight || "0");
      const gutterX = Math.max(10, columnLeft - (mobile ? 22 : 34));

      const start = heroPlant ? fromPage(heroPlant.anchor()) : { x: width * 0.7, y: 600 };
      const points = [start];

      state.nodes = [...main.querySelectorAll("[data-node]")].map((heading) => {
        const rect = heading.getBoundingClientRect();
        const position = local(rect);
        const firstLine = Math.min(rect.height, parseFloat(getComputedStyle(heading).fontSize) * 0.95);
        return { x: gutterX, y: position.y + firstLine * 0.55, headingX: position.x };
      });
      points.push(...state.nodes);

      // La racine finit au pied de la seconde plante, à côté de l'adresse e-mail.
      if (contactPlant) points.push(fromPage(contactPlant.anchor()));

      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i += 1) {
        const a = points[i - 1];
        const b = points[i];
        const dy = b.y - a.y;
        if (i === 1) {
          if (mobile) {
            d += ` L ${b.x + 28} ${a.y} Q ${b.x} ${a.y} ${b.x} ${a.y + 28} L ${b.x} ${b.y}`;
          } else {
            d += ` C ${a.x} ${a.y + dy * 0.75}, ${b.x} ${b.y - dy * 0.5}, ${b.x} ${b.y}`;
          }
          continue;
        }
        if (i === points.length - 1 && contactPlant) {
          // Descendre dans la marge, tourner, puis filer à l'horizontale sous le texte.
          const corner = Math.max(a.y + 20, b.y - 48);
          d += ` L ${a.x} ${corner} Q ${a.x} ${b.y} ${a.x + 48} ${b.y} L ${b.x} ${b.y}`;
          continue;
        }
        const sway = (i % 2 ? 1 : -1) * (mobile ? 3 : 22);
        d += ` C ${a.x + sway} ${a.y + dy * 0.45}, ${b.x - sway} ${b.y - dy * 0.45}, ${b.x} ${b.y}`;
      }
      path.setAttribute("d", d);
      glow.setAttribute("d", d);

      // Nœuds, brindille vers le titre, et vrilles qui poussent quand le nœud s'allume.
      nodesGroup.replaceChildren();
      const random = seeded(77);
      state.nodes.forEach((node) => {
        const group = make("g", { class: "root-node" });
        const reach = clamp(node.headingX - node.x - 12, 6, mobile ? 8 : 24);
        group.append(make("path", { class: "root-twig", d: `M ${node.x} ${node.y} q ${reach * 0.5} -10 ${reach} -4` }));
        if (!mobile) {
          [
            `M ${node.x} ${node.y} q -12 -10 -16 -28 q -2 -8 -10 -12`,
            `M ${node.x - 9} ${node.y - 14} q -10 0 -18 -6`,
            `M ${node.x} ${node.y} q -14 8 -22 24 q -3 6 -10 8`,
          ].forEach((shape) => group.append(make("path", { class: "root-tendril", d: shape })));
          group.append(make("circle", { class: "root-bud", cx: node.x - 26, cy: node.y - 40, r: 1.8 }));
          group.append(make("circle", { class: "root-bud", cx: node.x - 32, cy: node.y + 32, r: 1.5 }));
        }
        group.append(make("circle", { class: "root-dot", cx: node.x, cy: node.y, r: mobile ? 3.5 : 4.5 }));
        nodesGroup.append(group);
        node.group = group;
      });

      // Champ de spores immobile qui prolonge le monde après l'introduction.
      main.querySelectorAll(".projects, .process, .contact").forEach((section) => {
        const rect = section.getBoundingClientRect();
        const top = rect.top - mainRect.top;
        const amount = mobile ? 8 : 22;
        for (let s = 0; s < amount; s += 1) {
          let x;
          if (mobile) x = 4 + random() * Math.max(6, columnLeft - 14);
          else if (random() < 0.45) x = 8 + random() * Math.max(10, gutterX - 20);
          else x = columnRight + 16 + random() * Math.max(10, width - columnRight - 24);
          const spore = make("circle", {
            class: "field-spore",
            cx: x.toFixed(1),
            cy: (top + random() * rect.height).toFixed(1),
            r: (0.7 + random() * 1.3).toFixed(2),
          });
          spore.style.setProperty("--delay", `${(random() * 6).toFixed(2)}s`);
          spore.style.setProperty("--level", (0.18 + random() * 0.4).toFixed(2));
          nodesGroup.append(spore);
        }
      });

      nodesGroup.querySelectorAll(".root-tendril").forEach((tendril) => {
        const length = tendril.getTotalLength();
        tendril.style.strokeDasharray = `${length}`;
        tendril.style.setProperty("--length", `${length}`);
      });

      state.steps = [...main.querySelectorAll(".steps li")].map((step) => ({
        element: step,
        y: local(step.getBoundingClientRect()).y + 30,
      }));

      // Échantillons longueur → hauteur pour savoir où se trouve la pointe.
      state.length = path.getTotalLength();
      state.samples = [];
      const count = 700;
      for (let i = 0; i <= count; i += 1) {
        const at = (state.length * i) / count;
        state.samples.push({ at, y: path.getPointAtLength(at).y });
      }
      [path, glow].forEach((line) => {
        line.style.strokeDasharray = `${state.length}`;
      });
    }

    function lengthAt(y) {
      let reached = 0;
      for (const sample of state.samples) {
        if (sample.y <= y) reached = Math.max(reached, sample.at);
      }
      return reached;
    }

    function update(tipY, draw) {
      const all = reduceMotion.matches;
      const reached = all ? state.length : lengthAt(tipY);
      draw(state.length - reached);
      state.nodes.forEach((node) => node.group?.classList.toggle("is-lit", all || tipY >= node.y));
      state.steps.forEach((step) => step.element.classList.toggle("is-lit", all || tipY >= step.y));
    }

    return { build, update, state };
  }

  /* -------------------------------------------------------
     3. ÉCLOSION DES PROJETS : la lueur suit le pointeur
     ------------------------------------------------------- */

  function initializeBlooms() {
    const projects = document.querySelectorAll("[data-bloom]");
    projects.forEach((project) => {
      const frame = project.querySelector(".project-image");
      if (!frame) return;
      project.addEventListener("pointermove", (event) => {
        const rect = frame.getBoundingClientRect();
        frame.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        frame.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }, { passive: true });
    });

    // Sur écran tactile, il n'y a pas de survol : le projet éclot quand il est au centre.
    if (window.matchMedia("(hover: none)").matches && !reduceMotion.matches) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.target.classList.toggle("is-blooming", entry.isIntersecting));
      }, { rootMargin: "-35% 0px -35% 0px" });
      projects.forEach((project) => observer.observe(project));
    }
  }

  /* -------------------------------------------------------
     4. ORCHESTRATION
     ------------------------------------------------------- */

  function initialize() {
    const main = document.querySelector("main");
    if (!main) return;

    const heroCanvas = document.querySelector(".hero-canvas");
    const contactCanvas = document.querySelector(".contact-canvas");
    const heroPlant = heroCanvas ? createPlant(heroCanvas, { layout: heroLayout, seed: 1984 }) : null;
    const contactPlant = contactCanvas ? createPlant(contactCanvas, { layout: contactLayout, seed: 2024 }) : null;
    const root = createRoot(main, heroPlant, contactPlant);
    initializeBlooms();

    const tip = () => window.scrollY + window.innerHeight * 0.72 - (main.getBoundingClientRect().top + window.scrollY);
    const lines = () => main.querySelectorAll(".root-path, .root-glow");

    // Sans GSAP (CDN indisponible) ou avec mouvements réduits : tout est affiché d'emblée.
    if (!hasGsap || reduceMotion.matches) {
      [heroPlant, contactPlant].forEach((plant) => {
        if (!plant) return;
        plant.setGrowth(1);
        plant.start();
      });
      if (root) {
        const draw = (offset) => lines().forEach((line) => {
          line.style.strokeDashoffset = `${reduceMotion.matches ? 0 : offset}`;
        });
        const sync = () => { root.build(); root.update(tip(), draw); };
        sync();
        // Les polices et les images changent la mise en page : on redessine une fois chargées.
        const settle = () => {
          heroPlant?.rebuild();
          contactPlant?.rebuild();
          sync();
        };
        document.fonts?.ready.then(settle);
        window.addEventListener("load", settle, { once: true });
        let ticking = false;
        if (!reduceMotion.matches) {
          window.addEventListener("scroll", () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => { root.update(tip(), draw); ticking = false; });
          }, { passive: true });
        }
        let timer = 0;
        new ResizeObserver(() => {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            heroPlant?.rebuild();
            contactPlant?.rebuild();
            sync();
          }, 150);
        }).observe(main);
      }
      return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ease = "expo.out";

      // Le moment orchestré : la plante pousse pendant que le titre s'écrit ligne à ligne,
      // puis « rayonner » s'allume et lance sa vrille vers la plante.
      const intro = gsap.timeline({ defaults: { ease } });
      if (heroPlant) {
        heroPlant.start();
        const growth = { value: 0 };
        intro.to(growth, {
          value: 1,
          duration: 2.6,
          ease: "power2.inOut",
          onUpdate: () => heroPlant.setGrowth(growth.value),
        }, 0);
      }
      intro
        .from(".site-header", { autoAlpha: 0, y: -12, duration: 0.9 }, 0.1)
        .fromTo(".hero-title .line-ink",
          { clipPath: "inset(0 100% 0 0)", y: 18 },
          { clipPath: "inset(0 0% 0 0)", y: 0, duration: 1.2, stagger: 0.22, clearProps: "clipPath,transform" }, 0.25)
        .fromTo(".hero-title .bloom",
          { color: "#d5d9ee", textShadow: "0 0 0px rgba(63, 224, 208, 0)" },
          { color: "#ffffff", textShadow: "0 0 14px rgba(63, 224, 208, 0.3)", duration: 1.4, clearProps: "color,textShadow" }, 1.15)
        .fromTo(".bloom-tendril path",
          { strokeDashoffset: 140 },
          { strokeDashoffset: 0, duration: 1.4, stagger: 0.18, ease: "power2.out" }, 1.35)
        .from(".bloom-tendril circle", { scale: 0, transformOrigin: "50% 50%", duration: 0.6, stagger: 0.12, ease: "back.out(2.4)" }, 2)
        .from([".hero-lead", ".hero-actions", ".hero-promises li"], {
          autoAlpha: 0, y: 22, duration: 1, stagger: 0.09, ease: "back.out(1.4)",
        }, 1.05);

      // Garde-fou : si le navigateur suspend les images (onglet en arrière-plan, appareil lent),
      // l'introduction est terminée d'office pour que le texte ne reste jamais caché.
      const safety = window.setTimeout(() => {
        if (intro.progress() < 1) intro.progress(1);
      }, 4500);

      // La seconde plante éclot quand le contact arrive.
      if (contactPlant) {
        contactPlant.setGrowth(0);
        const growth = { value: 0 };
        ScrollTrigger.create({
          trigger: ".contact",
          start: "top 75%",
          once: true,
          onEnter: () => {
            contactPlant.start();
            gsap.to(growth, { value: 1, duration: 2.4, ease: "power2.inOut", onUpdate: () => contactPlant.setGrowth(growth.value) });
          },
        });
      }

      // La racine suit le défilement ; sa pointe reste aux trois quarts de l'écran.
      if (root) {
        root.build();
        const setOffset = gsap.quickTo(lines(), "strokeDashoffset", { duration: 0.6, ease: "power3.out" });
        gsap.set(lines(), { strokeDashoffset: root.state.length });
        const draw = (offset) => setOffset(offset);

        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: () => root.update(tip(), draw),
          onRefresh: () => {
            heroPlant?.rebuild();
            contactPlant?.rebuild();
            root.build();
            root.update(tip(), draw);
          },
        });
      }

      // Les projets éclosent : l'image s'ouvre depuis le centre et s'éclaircit.
      gsap.utils.toArray(".project").forEach((project) => {
        const image = project.querySelector(".project-image");
        const text = project.querySelector(".project-text");
        gsap.timeline({ scrollTrigger: { trigger: project, start: "top 78%", once: true } })
          .fromTo(image,
            { clipPath: "inset(14% 14% 14% 14% round 10px)", filter: "brightness(0.35) blur(6px)" },
            { clipPath: "inset(0% 0% 0% 0% round 10px)", filter: "brightness(1) blur(0px)", duration: 1.5, ease, clearProps: "clipPath,filter" })
          .from(text.children, { autoAlpha: 0, y: 26, duration: 1, stagger: 0.08, ease: "back.out(1.3)" }, 0.25);
      });

      // Le portrait flotte doucement contre le défilement.
      gsap.fromTo(".about-portrait img", { y: 36 }, {
        y: -36,
        ease: "none",
        scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true },
      });

      // L'éclosion finale : le titre puis l'adresse e-mail.
      gsap.timeline({ scrollTrigger: { trigger: ".contact", start: "top 70%", once: true } })
        .from(".contact h2", { autoAlpha: 0, y: 40, duration: 1.2, ease })
        .fromTo(".contact-email", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1, ease }, 0.25);

      return () => {
        window.clearTimeout(safety);
        lines().forEach((line) => { line.style.strokeDashoffset = ""; });
      };
    });

    // Les images et les polices changent la hauteur des sections : on recalcule ensuite.
    const refresh = () => ScrollTrigger.refresh();
    main.querySelectorAll("img").forEach((image) => {
      if (!image.complete) image.addEventListener("load", refresh, { once: true });
    });
    window.addEventListener("load", refresh, { once: true });
    document.fonts?.ready.then(refresh);

    // Une question de la FAQ ou un tarif déplié change la hauteur de la page.
    let resizeTimer = 0;
    new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(refresh, 120);
    }).observe(main);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
