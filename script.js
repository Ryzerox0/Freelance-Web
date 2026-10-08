"use strict";

/* =========================================================
   STUDIO WEB — SCRIPT PRINCIPAL
   Compatible avec l'accueil et les pages secondaires
   ========================================================= */

/* -------------------- ANNÉE DU FOOTER -------------------- */

function updateFooterYear() {
  const yearElement = document.querySelector("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/* -------------------- MENU MOBILE -------------------- */

function initializeMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");

  // Accepte les deux identifiants de navigation utilisés dans le projet.
  const navigation =
    document.querySelector("#navigation") ||
    document.querySelector(".navigation");

  if (!menuToggle || !navigation) {
    return;
  }

  const mobileBreakpoint = 760;

  function closeMenu() {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  }

  function openMenu() {
    navigation.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fermer le menu");
  }

  function toggleMenu() {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Synchroniser l'état initial avec le HTML.
  closeMenu();

  menuToggle.addEventListener("click", toggleMenu);

  // Fermer le menu après avoir choisi une destination.
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Fermer le menu avec Échap et rendre le focus au bouton.
  document.addEventListener("keydown", (event) => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    if (event.key === "Escape" && isOpen) {
      closeMenu();
      menuToggle.focus();
    }
  });

  // Fermer le menu quand l'écran repasse en grand format.
  window.addEventListener("resize", () => {
    if (window.innerWidth > mobileBreakpoint) {
      closeMenu();
    }
  });
}

/* -------------------- COPIE DE L'E-MAIL -------------------- */

function initializeEmailCopy() {
  const copyButton = document.querySelector("[data-copy-email]");
  const copyStatus = document.querySelector("#copy-status");

  if (!copyButton || !copyStatus) {
    return;
  }

  let statusTimeout;

  function showCopyStatus(message) {
    copyStatus.textContent = message;

    if (statusTimeout) {
      window.clearTimeout(statusTimeout);
    }

    statusTimeout = window.setTimeout(() => {
      copyStatus.textContent = "";
    }, 6000);
  }

  async function copyEmail() {
    const email = copyButton.dataset.copyEmail;

    if (!email) {
      showCopyStatus("L'adresse e-mail n'est pas configurée.");
      return;
    }

    try {
      if (
        !navigator.clipboard ||
        typeof navigator.clipboard.writeText !== "function"
      ) {
        throw new Error("Presse-papiers indisponible");
      }

      await navigator.clipboard.writeText(email);

      showCopyStatus("Adresse e-mail copiée.");
    } catch (error) {
      showCopyStatus(
        "Copie automatique indisponible. Tu peux copier l'adresse manuellement."
      );

      const emailLink = document.querySelector(".contact-email");

      if (emailLink) {
        emailLink.focus();
      }
    }
  }

  copyButton.addEventListener("click", copyEmail);
}

/* -------------------- FAQ -------------------- */

function initializeFaq() {
  const faqItems = document.querySelectorAll(".faq-list details");

  faqItems.forEach((item) => {
    const summary = item.querySelector("summary");
    const indicator = summary?.querySelector("span");

    if (!summary || !indicator) {
      return;
    }

    function updateIndicator() {
      indicator.textContent = item.open ? "−" : "+";
    }

    updateIndicator();

    item.addEventListener("toggle", updateIndicator);
  });
}

/* -------------------- RETOUR EN HAUT -------------------- */

function initializeBackToTop() {
  const backTopLinks = document.querySelectorAll(".back-top");

  backTopLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.getAttribute("href") !== "#top") {
        return;
      }

      event.preventDefault();

      const prefersReducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });

      // Mettre à jour l'URL sans ajouter une entrée d'historique.
      if (window.location.hash === "#top") {
        history.replaceState(
          null,
          "",
          window.location.pathname +
            window.location.search
        );
      }
    });
  });
}

/* -------------------- LIENS INTERNES -------------------- */

function initializeAnchorLinks() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      // Ignorer les liens vides et le retour en haut.
      if (!href || href === "#" || href === "#top") {
        return;
      }

      // Ne pas interférer avec les ouvertures dans un nouvel onglet.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      // Le navigateur gère naturellement le défilement vers l'ancre.
      // On ne bloque pas le comportement natif.
    });
  });
}

/* -------------------- INITIALISATION -------------------- */

function initializeStudioWeb() {
  updateFooterYear();
  initializeMobileMenu();
  initializeEmailCopy();
  initializeFaq();
  initializeBackToTop();
  initializeAnchorLinks();
}

// Fonctionner que le script soit chargé avant ou après le HTML.
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeStudioWeb,
    { once: true }
  );
} else {
  initializeStudioWeb();
}
