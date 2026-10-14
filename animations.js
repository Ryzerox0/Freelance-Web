"use strict";

/* =========================================================
   STUDIO WEB — « DU PLAN AU RÉEL »
   1. Comparateurs plan / réel (fonctionnent sans GSAP).
   2. Mouvements orchestrés avec GSAP et ScrollTrigger :
      tracer le plan, coter, puis révéler la page réelle.
   Sans JavaScript, sans GSAP ou en mouvements réduits,
   la page réelle et tout le contenu restent visibles.
   ========================================================= */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  const setReveal = (element, percent) => {
    element.style.setProperty("--reveal", `${percent}%`);
  };

  /* -------------------------------------------------------
     1. COMPARATEURS : le curseur montre le plan ou le site
     ------------------------------------------------------- */

  function initializeCompares() {
    return [...document.querySelectorAll("[data-case]")].map((study) => {
      const figure = study.querySelector("[data-compare]");
      const control = study.querySelector(".compare-control");
      const input = control?.querySelector("input");
      if (!figure || !control || !input) return null;

      control.hidden = false;
      const apply = () => setReveal(figure, Number(input.value));
      input.addEventListener("input", () => {
        figure.classList.add("is-comparing");
        apply();
      });
      input.addEventListener("change", () => figure.classList.remove("is-comparing"));
      input.addEventListener("blur", () => figure.classList.remove("is-comparing"));
      apply();

      return { study, figure, input };
    }).filter(Boolean);
  }

  /* -------------------------------------------------------
     2. MOUVEMENT
     ------------------------------------------------------- */

  // Trace le plan d'une feuille puis révèle la page réelle.
  function planToReal(gsap, sheet, { input, delay = 0 } = {}) {
    const strokes = sheet.querySelectorAll(".plan-stroke");
    const cotes = sheet.querySelectorAll(".plan-cote text");
    const state = { reveal: 0 };

    gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(cotes, { autoAlpha: 0 });
    setReveal(sheet, 0);
    if (input) input.value = 0;

    return gsap.timeline({ delay })
      .to(strokes, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: { amount: 0.9 } })
      .to(cotes, { autoAlpha: 1, duration: 0.5, stagger: 0.12 }, "-=0.5")
      .add(() => sheet.classList.add("is-comparing"))
      .to(state, {
        reveal: 100,
        duration: 1.3,
        ease: "expo.inOut",
        onUpdate: () => {
          setReveal(sheet, state.reveal);
          if (input) input.value = Math.round(state.reveal);
        },
      }, "+=0.2")
      .add(() => sheet.classList.remove("is-comparing"))
      .set(strokes, { clearProps: "strokeDasharray,strokeDashoffset" });
  }

  function initialize() {
    const compares = initializeCompares();
    if (!hasGsap || reduceMotion.matches) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Le moment d'ouverture : le titre s'écrit, le plan se trace, la page apparaît.
      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      // L'en-tête, la phrase et le bouton sont visibles dès le premier affichage : seul le titre s'écrit.
      intro.fromTo(".hero-title .line-ink",
        { clipPath: "inset(0 100% 0 0)", y: 14 },
        { clipPath: "inset(0 0% 0 0)", y: 0, duration: 1.1, stagger: 0.18, clearProps: "clipPath,transform" }, 0.1);

      const heroSheet = document.querySelector(".hero-sheet");
      if (heroSheet) intro.add(planToReal(gsap, heroSheet), 0.45);

      // Garde-fou : si le navigateur suspend l'animation, l'introduction se termine d'office.
      const safety = window.setTimeout(() => {
        if (intro.progress() < 1) intro.progress(1);
      }, 5000);

      // Chaque réalisation passe du plan au site quand elle arrive à l'écran.
      compares.forEach(({ study, figure, input }) => {
        let played = false;
        const timelineFor = () => planToReal(gsap, figure, { input });
        gsap.set(figure.querySelectorAll(".plan-stroke"), { strokeDasharray: 1, strokeDashoffset: 1 });
        setReveal(figure, 0);
        input.value = 0;
        ScrollTrigger.create({
          trigger: study,
          start: "top 72%",
          once: true,
          onEnter: () => {
            if (played) return;
            played = true;
            timelineFor();
          },
        });
        // Si le visiteur prend la main (souris, toucher ou clavier) avant l'animation,
        // le plan s'affiche aussitôt en entier et l'animation n'est plus jouée.
        input.addEventListener("input", () => {
          if (played) return;
          played = true;
          gsap.set(figure.querySelectorAll(".plan-stroke"), { clearProps: "strokeDasharray,strokeDashoffset" });
          gsap.set(figure.querySelectorAll(".plan-cote text"), { clearProps: "opacity,visibility" });
        });
      });

      // La méthode : la ligne de cote se trace au fil du défilement.
      const steps = document.querySelector(".steps");
      if (steps) {
        gsap.fromTo(steps, { "--progress": 0 }, {
          "--progress": 1,
          ease: "none",
          scrollTrigger: { trigger: steps, start: "top 85%", end: "bottom 55%", scrub: 0.6 },
        });
      }

      return () => {
        window.clearTimeout(safety);
        compares.forEach(({ figure, input }) => {
          setReveal(figure, 100);
          input.value = 100;
        });
      };
    });

    // Les polices et les images changent la hauteur des sections : on recalcule ensuite.
    const refresh = () => ScrollTrigger.refresh();
    document.querySelectorAll("img").forEach((image) => {
      if (!image.complete) image.addEventListener("load", refresh, { once: true });
    });
    window.addEventListener("load", refresh, { once: true });
    document.fonts?.ready.then(refresh);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
