"use strict";

/* Chargé avant l'affichage : prépare l'introduction animée sans flash de la page finale.
   Seulement si les animations sont acceptées ; restaurant.js lève ce drapeau, sinon le CSS
   affiche tout de lui-même après quelques secondes. */
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("intro-attente");
}
