"use strict";

/* =========================================================
   STUDIO WEB — SCRIPT PRINCIPAL
   Navigation, accessibilité et animations : une seule initialisation.
   ========================================================= */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

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
      if (window.innerWidth > 760) closeMenu();
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
    const progress = document.querySelector(".animation-progress");
    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY || 0;
      header?.classList.toggle("is-scrolled", scrollY > 18);
      if (progress && !reduceMotion.matches) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${maxScroll > 0 ? Math.min(1, scrollY / maxScroll) : 0})`;
      }
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
    window.addEventListener("resize", requestUpdate, { passive: true });
  }

  function initializeScrollReveal() {
    if (reduceMotion.matches) return;

    // Sur mobile, laisse tout le contenu visible sans attendre l'animation.
    if (window.matchMedia("(max-width: 640px)").matches) return;

    const targets = document.querySelectorAll(
      "main section, .service-card, .project-card, .offer-card, .offer-product-card, .process-card, .process-step, .faq-item, .contact-actions, .about-photo"
    );
    if (!targets.length) return;

    document.documentElement.classList.add("js-animations");

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

    targets.forEach((element, index) => {
      if (element.matches(".service-card, .project-card, .offer-card, .offer-product-card, .process-card, .process-step")) {
        element.style.setProperty("--reveal-delay", `${(index % 3) * 70}ms`);
      }
      element.classList.add("reveal-on-scroll");
      observer.observe(element);
    });
  }

  function initializeHeroTilt() {
    const visual = document.querySelector(".hero-visual");
    if (!visual || reduceMotion.matches || !finePointer.matches) return;

    let frame = 0;
    visual.addEventListener("pointermove", (event) => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        visual.style.transform = `perspective(1000px) rotateY(${x * 2.5}deg) rotateX(${-y * 2.5}deg)`;
      });
    }, { passive: true });

    visual.addEventListener("pointerleave", () => {
      window.cancelAnimationFrame(frame);
      visual.style.transform = "";
    });
  }

  function initializeStudioWeb() {
    updateFooterYear();
    initializeMobileMenu();
    initializeEmailCopy();
    initializeFaq();
    initializeBackToTop();
    initializeScrollEffects();
    initializeScrollReveal();
    initializeHeroTilt();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeStudioWeb, { once: true });
  } else {
    initializeStudioWeb();
  }
})();