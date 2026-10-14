"use strict";

/* Maison Olive (démo fictive) : menu mobile et année du pied de page. */

(() => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("menu");

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".sr-only").textContent = open ? "Fermer le menu" : "Ouvrir le menu";
      nav.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  const year = document.getElementById("annee");
  if (year) year.textContent = String(new Date().getFullYear());
})();
