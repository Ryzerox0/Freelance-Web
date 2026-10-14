"use strict";

/* =========================================================
   STUDIO WEB — ANIMATIONS (GSAP et ScrollTrigger)
   1. Le titre de l'accueil s'écrit ligne à ligne.
   2. La ligne de cote de la méthode se trace au défilement.
   Sans JavaScript, sans GSAP ou en mouvements réduits,
   tout le contenu reste visible et immobile.
   ========================================================= */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  function initialize() {
    if (!hasGsap || reduceMotion.matches) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // L'en-tête, la phrase, les boutons et l'encadré sont visibles dès le premier affichage :
      // seul le titre s'écrit.
      const intro = gsap.timeline();
      intro.fromTo(".hero-title .line-ink",
        { clipPath: "inset(0 100% 0 0)", y: 14 },
        { clipPath: "inset(0 0% 0 0)", y: 0, duration: 1.1, ease: "expo.out", stagger: 0.18, clearProps: "clipPath,transform" }, 0.1);

      // Garde-fou : si le navigateur suspend l'animation, le titre s'affiche d'office.
      const safety = window.setTimeout(() => {
        if (intro.progress() < 1) intro.progress(1);
      }, 4000);

      // La méthode : la ligne de cote se trace au fil du défilement.
      const steps = document.querySelector(".steps");
      if (steps) {
        gsap.fromTo(steps, { "--progress": 0 }, {
          "--progress": 1,
          ease: "none",
          scrollTrigger: { trigger: steps, start: "top 85%", end: "bottom 55%", scrub: 0.6 },
        });
      }

      return () => window.clearTimeout(safety);
    });

    // Les polices et les images changent la hauteur des sections : on recalcule ensuite.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });
    document.fonts?.ready.then(refresh);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
