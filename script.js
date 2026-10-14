"use strict";

/* =========================================================
   STUDIO WEB — SCRIPT PRINCIPAL
   Navigation et accessibilité : une seule initialisation.
   ========================================================= */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function updateFooterYear() {
    const year = document.querySelector("#year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function initializeMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#navigation, .navigation");
    if (!toggle || !navigation) return;

    const closeMenu = ({ returnFocus = false } = {}) => {
      navigation.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ouvrir le menu");
      if (returnFocus) toggle.focus();
    };

    const openMenu = () => {
      navigation.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fermer le menu");
    };

    closeMenu();
    toggle.addEventListener("click", () => {
      toggle.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu({ returnFocus: true });
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) closeMenu();
    }, { passive: true });
  }

  function initializeEmailCopy() {
    const button = document.querySelector("[data-copy-email]");
    const status = document.querySelector("#copy-status");
    if (!button || !status) return;

    let timeoutId;

    const announce = (message) => {
      status.textContent = message;
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => { status.textContent = ""; }, 5000);
    };

    button.addEventListener("click", async () => {
      const email = button.dataset.copyEmail?.trim();
      if (!email) {
        announce("L'adresse e-mail n'est pas configurée.");
        return;
      }

      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard indisponible");
        await navigator.clipboard.writeText(email);
        announce("Adresse e-mail copiée.");
      } catch {
        announce("Copie automatique indisponible. Sélectionnez l'adresse affichée pour la copier.");
        document.querySelector(".contact-email")?.focus();
      }
    });
  }

  function initializeFaq() {
    document.querySelectorAll(".faq-list details").forEach((item) => {
      const summary = item.querySelector("summary");
      const indicator = summary?.querySelector("span");
      if (!summary || !indicator) return;

      const update = () => {
        indicator.textContent = item.open ? "−" : "+";
        summary.setAttribute("aria-expanded", String(item.open));
      };
      update();
      item.addEventListener("toggle", update);
    });
  }

  function initializeBackToTop() {
    document.querySelectorAll('.back-top[href="#top"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
        if (window.location.hash === "#top") {
          history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      });
    });
  }

  function initializeScrollEffects() {
    const header = document.querySelector(".site-header");
    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY || 0;
      header?.classList.toggle("is-scrolled", scrollY > 18);
      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
  }

  // Sur mobile, les inclusions de chaque tarif sont repliées pour raccourcir la page.
  // Sans JavaScript, elles restent toutes ouvertes.
  function initializeQuoteDetails() {
    const details = document.querySelectorAll(".quote-details");
    if (!details.length) return;

    const mobile = window.matchMedia("(max-width: 760px)");
    const sync = () => details.forEach((item) => { item.open = !mobile.matches; });
    sync();
    mobile.addEventListener("change", sync);
  }

  function initializeStudioWeb() {
    updateFooterYear();
    initializeMobileMenu();
    initializeEmailCopy();
    initializeFaq();
    initializeBackToTop();
    initializeScrollEffects();
    initializeQuoteDetails();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeStudioWeb, { once: true });
  } else {
    initializeStudioWeb();
  }
})();
