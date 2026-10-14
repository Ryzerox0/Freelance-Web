"use strict";

/* Dupont Plomberie (démo fictive) : menu mobile, année du pied de page, formulaire de démonstration. */

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

  // Formulaire de démonstration : rien n'est envoyé, un message le confirme.
  const form = document.querySelector("[data-demo-form]");
  if (form) {
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      status.textContent = "Merci ! Ceci est une démonstration : votre message n’a été envoyé à personne.";
      status.hidden = false;
      status.focus();
      form.reset();
    });
  }
})();
