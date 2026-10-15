"use strict";

/* Maison Olive (démo fictive) — « Une journée à Maison Olive »
   - la course du soleil : l'astre traverse l'arc de l'en-tête au fil du défilement,
     l'en-tête prend la couleur de l'heure (matin, midi, après-midi, soir, nuit) ;
   - la carte par moment (onglets accessibles au clavier), ouverte sur le moment de l'heure réelle ;
   - aperçu en arche des plats photographiés, qui suit la souris ;
   - réservation de démonstration confirmée par un ticket, barre « Réserver » sur téléphone ;
   - mouvement (GSAP, ScrollTrigger, SplitText, seulement si les animations sont acceptées) :
     l'affiche s'imprime à l'arrivée, le soleil se couche derrière la mer, les sections s'ouvrent
     sur l'horizon, les titres se révèlent. Sans JavaScript ou en mouvements réduits, tout est visible. */

(() => {
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)");
  const gsap = window.gsap;
  const anime = () => typeof gsap !== "undefined" && !reduit.matches;
  const leverAttente = () => document.documentElement.classList.remove("intro-attente");
  if (!anime()) leverAttente();

  const year = document.getElementById("annee");
  if (year) year.textContent = String(new Date().getFullYear());

  // ---------- La course du soleil ----------
  const entete = document.querySelector(".entete");
  const liens = Array.from(document.querySelectorAll(".nav a[href^='#']:not(.bouton)"));
  const astre = document.querySelector(".course-astre");
  const heureLabel = document.querySelector(".course-heure");
  const NOMS = { matin: "Matin", midi: "Midi", gouter: "Goûter", diner: "Dîner", "apres-midi": "Après-midi", soir: "Soir", nuit: "Nuit" };
  let courante = null;
  const navAstre = document.querySelector(".nav-astre");
  const placerAstre = () => {
    if (!navAstre) return;
    const actif = liens.find((lien) => lien.classList.contains("actif"));
    if (!actif || actif.offsetParent === null) {
      navAstre.classList.remove("visible");
      return;
    }
    navAstre.style.setProperty("--x", `${actif.offsetLeft + actif.offsetWidth / 2 - 4}px`);
    navAstre.classList.add("visible");
  };
  const afficherHeure = (section, ancre = section) => {
    courante = section;
    const heure = section.dataset.heure;
    entete.dataset.heure = heure;
    if (heureLabel) heureLabel.textContent = NOMS[heure] || "";
    liens.forEach((lien) => lien.classList.toggle("actif", lien.getAttribute("href") === `#${ancre.id}`));
    placerAstre();
  };
  window.addEventListener("resize", placerAstre);

  if (astre) {
    let enAttente = false;
    const placer = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const a = Math.PI * p;
      astre.setAttribute("cx", (60 - 52 * Math.cos(a)).toFixed(1));
      astre.setAttribute("cy", (33 - 28 * Math.sin(a)).toFixed(1));
      enAttente = false;
    };
    window.addEventListener("scroll", () => {
      if (!enAttente) {
        enAttente = true;
        window.requestAnimationFrame(placer);
      }
    }, { passive: true });
    window.addEventListener("resize", placer);
    placer();
  }

  // L'heure de la section qui passe sous l'en-tête, et le lien de navigation correspondant
  const moments = Array.from(document.querySelectorAll("[data-heure]"));
  if (entete && moments.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // Pendant la scène épinglée, c'est le défilement horizontal qui donne l'heure.
        if (entry.target.closest(".journee.epinglee")) return;
        const journee = entry.target.closest(".journee");
        afficherHeure(entry.target, journee || entry.target);
      });
    }, { rootMargin: "-84px 0px -80% 0px" });
    moments.forEach((section) => observer.observe(section));
  }

  // ---------- La carte par moment ----------
  const carte = document.querySelector(".carte");
  const tabs = Array.from(document.querySelectorAll(".onglets [role='tab']"));
  if (carte && tabs.length) {
    const select = (tab, focus, recompose) => {
      let panneau = null;
      tabs.forEach((other) => {
        const on = other === tab;
        other.setAttribute("aria-selected", String(on));
        other.tabIndex = on ? 0 : -1;
        const p = document.getElementById(other.getAttribute("aria-controls"));
        p.hidden = !on;
        if (on) panneau = p;
      });
      carte.dataset.moment = tab.dataset.moment;
      carte.dataset.heure = { dejeuner: "midi", douceurs: "gouter", diner: "diner" }[tab.dataset.moment];
      if (courante === carte) afficherHeure(carte);
      if (focus) tab.focus();
      if (recompose && panneau) {
        panneau.classList.remove("recompose");
        void panneau.offsetWidth;
        panneau.classList.add("recompose");
        if (anime()) {
          const photo = panneau.querySelector(".carte-visuel img");
          if (photo) {
            gsap.fromTo(photo, { clipPath: "inset(100% 0% 0% 0%)", scale: 1.12 },
              { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.9, ease: "expo.out", overwrite: true });
          }
          gsap.fromTo(panneau.querySelectorAll(".plats li, .formule"),
            { y: 18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.55, ease: "expo.out", stagger: 0.045, overwrite: true });
        }
      }
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(tab, false, true));
      tab.addEventListener("keydown", (event) => {
        const keys = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 };
        if (!(event.key in keys)) return;
        event.preventDefault();
        select(tabs[(keys[event.key] + tabs.length) % tabs.length], true, true);
      });
    });
    // La carte s'ouvre sur le moment de l'heure réelle : déjeuner, goûter ou dîner.
    const h = new Date().getHours();
    const moment = h >= 18 || h < 5 ? "diner" : h >= 15 ? "douceurs" : "dejeuner";
    const initial = tabs.find((tab) => tab.dataset.moment === moment);
    if (initial) select(initial, false, false);
  }

  // ---------- Aperçu des plats photographiés ----------
  const apercu = document.querySelector(".apercu");
  const fin = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (apercu && fin.matches) {
    const img = apercu.querySelector("img");
    let cible = { x: 0, y: 0 };
    let pos = { x: 0, y: 0 };
    let visible = false;
    let boucle = null;

    const suivre = () => {
      const k = reduit.matches ? 1 : 0.18;
      const dx = cible.x - pos.x;
      pos.x += dx * k;
      pos.y += (cible.y - pos.y) * k;
      const rotation = reduit.matches ? 0 : Math.max(-8, Math.min(8, dx * 0.06));
      apercu.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0) rotate(${rotation.toFixed(2)}deg)`;
      boucle = visible || Math.abs(dx) > 0.5 ? window.requestAnimationFrame(suivre) : null;
    };

    document.querySelectorAll(".plats li[data-photo]").forEach((li) => {
      li.addEventListener("pointerenter", (event) => {
        if (img.getAttribute("src") !== li.dataset.photo) img.src = li.dataset.photo;
        cible = { x: event.clientX + 28, y: event.clientY - 150 };
        if (!visible) pos = { ...cible };
        visible = true;
        apercu.style.transition = "opacity 220ms ease";
        apercu.style.opacity = "1";
        if (!boucle) boucle = window.requestAnimationFrame(suivre);
      });
      li.addEventListener("pointermove", (event) => {
        cible = { x: event.clientX + 28, y: event.clientY - 150 };
      });
      li.addEventListener("pointerleave", () => {
        visible = false;
        apercu.style.opacity = "0";
      });
    });
    window.addEventListener("scroll", () => {
      if (visible) {
        visible = false;
        apercu.style.opacity = "0";
      }
    }, { passive: true });
  }

  // ---------- Finale : le ciel ne scintille qu'à l'écran ----------
  const finale = document.querySelector(".finale");
  if (finale && "IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => finale.classList.toggle("visible", entry.isIntersecting));
    }).observe(finale);
  }

  // ---------- Réservation de démonstration ----------
  const form = document.querySelector("[data-reservation]");
  if (form) {
    const jour = form.querySelector("#jour");
    const heure = form.querySelector("#heure");
    const status = document.querySelector(".reserver-statut");
    const ouvert = [2, 3, 4, 5, 6]; // du mardi au samedi, comme dans les horaires d'exemple
    const midi = ["12:00", "12:30", "13:00", "13:30"];
    const soir = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
    const format = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });

    jour.innerHTML = "";
    const today = new Date();
    for (let i = 0, added = 0; added < 8 && i < 14; i += 1) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      if (!ouvert.includes(d.getDay())) continue;
      const label = i === 0 ? "Aujourd’hui" : i === 1 ? "Demain" : format.format(d);
      jour.add(new Option(label.charAt(0).toUpperCase() + label.slice(1), [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-")));
      added += 1;
    }

    heure.innerHTML = "";
    [["Déjeuner", midi], ["Dîner", soir]].forEach(([name, slots]) => {
      const group = document.createElement("optgroup");
      group.label = name;
      slots.forEach((slot) => group.appendChild(new Option(slot.replace(":00", " h").replace(":", " h "), slot)));
      heure.appendChild(group);
    });
    heure.value = "20:00";

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const couverts = form.querySelector("#couverts").value;
      const dayText = jour.options[jour.selectedIndex].text.toLowerCase();
      const timeText = heure.options[heure.selectedIndex].text;
      const titre = document.createElement("strong");
      titre.textContent = `Table pour ${couverts} ${couverts === "1" ? "personne" : "personnes"}, ${dayText} à ${timeText}`;
      const note = document.createElement("span");
      note.textContent = "C’est une démonstration : aucune réservation n’a été envoyée.";
      status.replaceChildren(titre, note);
      status.hidden = false;
      status.focus();
      if (anime()) {
        gsap.fromTo(status, { yPercent: 40, rotation: -1.5, autoAlpha: 0 },
          { yPercent: 0, rotation: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out" });
      }
    });

    // Barre collante sur téléphone : inutile quand le module est déjà visible.
    const bar = document.querySelector(".barre-reserver");
    if (bar && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => bar.classList.toggle("cachee", entry.isIntersecting));
      }, { threshold: 0.2 });
      observer.observe(form);
    }
  }

  // ---------- Mouvement ----------
  if (typeof gsap === "undefined") {
    leverAttente();
    return;
  }
  const ST = window.ScrollTrigger;
  const Split = window.SplitText;
  if (ST) gsap.registerPlugin(ST);
  if (Split) gsap.registerPlugin(Split);

  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", (contexte) => {
    const decoupes = [];

    // 1. L'affiche s'imprime : la mer se pose, le soleil se lève, le lettrage arrive plaque par plaque
    //    (jaune décalé à droite, bleu à gauche) puis se cale, comme une chromolithographie.
    const titre = document.querySelector(".affiche h1");
    let lettres = [];
    if (Split && titre) {
      const split = Split.create(titre, { type: "lines,chars", mask: "lines", linesClass: "ligne-titre" });
      decoupes.push(split);
      lettres = split.chars;
    }
    const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
    // Les états de départ sont posés par GSAP au même instant : on peut lever le drapeau sans flash.
    window.requestAnimationFrame(leverAttente);
    intro
      .from(".mer", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.9 }, 0)
      .from(".soleil", { yPercent: 75, duration: 1.8 }, 0.1)
      .from(lettres.length ? lettres : titre, { yPercent: 110, duration: 0.95, stagger: 0.035 }, 0.15)
      .fromTo(titre, { textShadow: "9px 0 0 rgba(244, 180, 26, 0.85), -7px 0 0 rgba(42, 82, 176, 0.9)" },
        { textShadow: "0px 0 0 rgba(244, 180, 26, 0), 0px 0 0 rgba(42, 82, 176, 0)", duration: 1.1, ease: "power3.out" }, 0.55)
      .from(".vignette", { y: 70, rotation: -2.5, duration: 1.3 }, 0.45)
      .from(".affiche-texte > *", { y: 22, autoAlpha: 0, duration: 0.8, stagger: 0.09 }, 0.75)
      .from(".bande-reserver form > *", { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.05 }, 0.9);

    // Garde-fou : si le navigateur suspend l'animation, l'affiche s'affiche d'office.
    const safety = window.setTimeout(() => {
      if (intro.progress() < 1) intro.progress(1);
    }, 3200);

    // Les animations au défilement sont préparées quand le navigateur est disponible :
    // l'introduction démarre tout de suite, sans attendre leur mise en place.
    // Les animations au défilement sont préparées par petites étapes, pendant les temps morts du
    // navigateur : l'introduction démarre tout de suite et la page reste réactive.
    const etapes = ST ? [
      () => {
        // 2. En descendant, le soleil se couche derrière la mer et la vignette prend de la profondeur.
        const coucher = { trigger: ".affiche", start: "top top", end: "bottom top", scrub: true };
        gsap.to(".soleil", { y: () => window.innerHeight * 0.32, ease: "none", scrollTrigger: coucher });
        gsap.to(".vignette", { yPercent: -14, ease: "none", scrollTrigger: { ...coucher } });
      },
      () => {
        // 3. Chaque aplat s'ouvre sur l'horizon : une fenêtre qui s'élargit en entrant.
        gsap.utils.toArray(".carte, .lieu, .pitch").forEach((section) => {
          gsap.fromTo(section, { clipPath: "inset(9% 5% 0% 5%)" }, {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "top 35%", scrub: true },
          });
        });
      },
      () => {
        // 4. Les grands titres se révèlent ligne par ligne, une seule fois.
        if (Split) {
          gsap.utils.toArray(".carte h2, .lieu h2, .infos h2, .pitch h2").forEach((h2) => {
            const split = Split.create(h2, { type: "lines", mask: "lines" });
            decoupes.push(split);
            gsap.from(split.lines, {
              yPercent: 105, duration: 1, ease: "expo.out", stagger: 0.1,
              scrollTrigger: { trigger: h2, start: "top 86%", once: true },
            });
          });
        }
      },
      () => {
        // 5. Le lieu : la photo se découvre comme un soleil levant, puis recule doucement.
        const photo = document.querySelector(".lieu .tirage img");
        if (photo) {
          gsap.fromTo(photo, { clipPath: "circle(0% at 50% 100%)", scale: 1.18 }, {
            clipPath: "circle(145% at 50% 100%)", scale: 1, ease: "none",
            scrollTrigger: { trigger: ".lieu .tirage", start: "top 92%", end: "top 30%", scrub: 0.6 },
          });
        }
      },
      () => {
        // 6. Le store de la terrasse se déroule.
        gsap.from(".store", {
          scaleY: 0, transformOrigin: "50% 0%", duration: 0.9, ease: "expo.out",
          scrollTrigger: { trigger: ".store", start: "top 92%", once: true },
        });
      },
      () => {
        // 7. La finale : la lune se lève, le titre s'écrit lettre à lettre, les étoiles dérivent à peine.
        gsap.fromTo(".lune", { yPercent: 140 }, {
          yPercent: 0, ease: "none",
          scrollTrigger: { trigger: ".finale", start: "top bottom", end: "center center", scrub: true },
        });
        gsap.to(".etoiles-a", {
          yPercent: -8, ease: "none",
          scrollTrigger: { trigger: ".finale", start: "top bottom", end: "bottom top", scrub: true },
        });
        if (Split) {
          const titreFinale = document.querySelector(".finale h2");
          if (titreFinale) {
            const split = Split.create(titreFinale, { type: "lines,chars", mask: "lines" });
            decoupes.push(split);
            gsap.from(split.chars, {
              yPercent: 110, rotation: 6, duration: 1, ease: "expo.out", stagger: 0.04,
              scrollTrigger: { trigger: ".finale", start: "top 65%", once: true },
            });
          }
        }
      },
      () => window.addEventListener("load", () => ST.refresh(), { once: true }),
    ] : [];
    let tache = 0;
    const suivante = () => {
      const etape = etapes.shift();
      if (!etape) return;
      contexte.add(etape);
      tache = "requestIdleCallback" in window
        ? window.requestIdleCallback(suivante, { timeout: 800 })
        : window.setTimeout(suivante, 60);
    };
    tache = "requestIdleCallback" in window
      ? window.requestIdleCallback(suivante, { timeout: 1200 })
      : window.setTimeout(suivante, 200);

    return () => {
      window.clearTimeout(safety);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(tache);
      window.clearTimeout(tache);
      decoupes.forEach((split) => split.revert());
    };
  });

  // ---------- Une journée en cuisine : la scène épinglée ----------
  // Sur grand écran : les quatre affiches défilent à l'horizontale sous un soleil unique
  // qui se lève, culmine au service de midi et se couche sur la terrasse.
  gsap.matchMedia().add("(min-width: 1025px) and (prefers-reduced-motion: no-preference)", () => {
    const section = document.querySelector(".journee");
    const piste = section && section.querySelector(".journee-piste");
    const soleil = section && section.querySelector(".journee-soleil");
    if (!section || !piste || !ST) return undefined;
    section.classList.add("epinglee");
    const affiches = Array.from(piste.querySelectorAll(".affichette"));
    const distance = () => Math.max(0, piste.scrollWidth - window.innerWidth);
    let indexCourant = -1;

    const defile = gsap.to(piste, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 76px",
        end: () => "+=" + Math.max(1, distance() * 1.3),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        refreshPriority: 1,
        onUpdate: (self) => {
          const i = Math.min(affiches.length - 1, Math.floor(self.progress * affiches.length * 0.999));
          if (i !== indexCourant) {
            indexCourant = i;
            afficherHeure(affiches[i], section);
          }
        },
      },
    });

    // Le soleil : bas à l'aube, au zénith à midi, bas au couchant ; sa couleur suit l'heure.
    if (soleil) {
      const h = () => section.querySelector(".journee-scene").offsetHeight;
      const course = gsap.timeline({
        defaults: { ease: "sine.inOut" },
        scrollTrigger: {
          trigger: section,
          start: "top 76px",
          end: () => "+=" + Math.max(1, distance() * 1.3),
          scrub: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
        },
      });
      course
        .fromTo(soleil, { y: () => h() * 0.8, backgroundColor: "#f7c86a" }, { y: () => h() * 0.52, backgroundColor: "#f4b41a", duration: 1 })
        .to(soleil, { y: () => h() * 0.34, backgroundColor: "#fffdf7", duration: 1 })
        .to(soleil, { y: () => h() * 0.82, backgroundColor: "#f29a4a", duration: 1.2 });
    }

    // Profondeur : les heures et les photos glissent à leur propre vitesse dans chaque affiche.
    affiches.forEach((affiche) => {
      const declencheur = { trigger: affiche, containerAnimation: defile, start: "left right", end: "right left", scrub: true };
      gsap.fromTo(affiche.querySelector(".affichette-heure"), { x: 90 }, { x: -90, ease: "none", scrollTrigger: declencheur });
      const img = affiche.querySelector(".affichette-visuel img");
      if (img) gsap.fromTo(img, { x: -40, scale: 1.06 }, { x: 40, scale: 1, ease: "none", scrollTrigger: { ...declencheur } });
    });

    ST.refresh();
    return () => {
      section.classList.remove("epinglee");
      gsap.set(piste, { clearProps: "transform" });
    };
  });

  // ---------- Boutons aimantés (souris uniquement) ----------
  gsap.matchMedia().add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    const boutons = Array.from(document.querySelectorAll(".bande-reserver .bouton, .bouton-lune"));
    const nettoyages = boutons.map((bouton) => {
      const x = gsap.quickTo(bouton, "x", { duration: 0.5, ease: "power3.out" });
      const y = gsap.quickTo(bouton, "y", { duration: 0.5, ease: "power3.out" });
      const bouge = (event) => {
        const r = bouton.getBoundingClientRect();
        x((event.clientX - (r.left + r.width / 2)) * 0.28);
        y((event.clientY - (r.top + r.height / 2)) * 0.36);
      };
      const quitte = () => { x(0); y(0); };
      bouton.addEventListener("pointermove", bouge);
      bouton.addEventListener("pointerleave", quitte);
      return () => {
        bouton.removeEventListener("pointermove", bouge);
        bouton.removeEventListener("pointerleave", quitte);
        gsap.set(bouton, { clearProps: "transform" });
      };
    });
    return () => nettoyages.forEach((n) => n());
  });
})();
