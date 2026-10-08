
"use strict";

/* =========================================================
   STUDIO WEB — SCRIPT PRINCIPAL
   Compatible avec l'accueil et les pages secondaires
   ========================================================= */

/* -------------------- ANNÉE DU FOOTER -------------------- */

function updateFooterYear() {
  const yearElement = document.querySelector("#year");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
}

/* -------------------- MENU MOBILE -------------------- */

function initializeMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#navigation");

  if (!menuToggle || !navigation) {
    return;
  }

  const mobileBreakpoint = 760;

  function openMenu() {
    navigation.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fermer le menu");
  }

  function closeMenu() {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
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

  // État initial cohérent avec le HTML.
  closeMenu();

  menuToggle.addEventListener("click", toggleMenu);

  // Fermer le menu après avoir sélectionné une destination.
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Fermer avec Échap et rendre le focus au bouton.
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuToggle.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menuToggle.focus();
    }
  });

  // Fermer si l'utilisateur revient sur un écran large.
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

    // Réinitialiser l'ancien effacement automatique.
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
      // Fonctionne généralement sur HTTPS ou localhost.
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        throw new Error("Presse-papiers indisponible");
      }

      await navigator.clipboard.writeText(email);

      showCopyStatus("Adresse e-mail copiée.");
    } catch {
      // Repli : afficher l'adresse pour permettre la copie manuelle.
      showCopyStatus(
        "Copie automatique indisponible. Sélectionne l'adresse affichée ci-dessous."
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

  if (faqItems.length === 0) {
    return;
  }

  faqItems.forEach((item) => {
    const summary = item.querySelector("summary");
    const indicator = summary
      ? summary.querySelector("span")
      : null;

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
      // Laisse fonctionner normalement si le lien cible est différent.
      if (link.getAttribute("href") !== "#top") {
        return;
      }

      event.preventDefault();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  });
}

/* -------------------- LIENS INTERNES -------------------- */

function initializeAnchorLinks() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      // Un lien vide ne doit pas déclencher de défilement.
      if (!href || href === "#") {
        return;
      }

      // Le lien #top est géré par le retour en haut.
      if (href === "#top") {
        return;
      }

      const target = document.getElementById(href.slice(1));

      // Laisser le navigateur gérer les ancres qui n'existent pas.
      if (!target) {
        return;
      }

      // Ne rien faire si l'utilisateur a demandé un nouveau contexte.
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

      // Le défilement natif conserve le comportement accessible.
      // Cette fonction sert uniquement à vérifier la cible.
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

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeStudioWeb,
    { once: true }
  );
} else {
  initializeStudioWeb();
}