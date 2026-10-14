"use strict";

/* Dupont Plomberie (démo fictive)
   - menu mobile, année du cartouche ;
   - accueil : le besoin choisi allume son réseau sur le schéma ;
   - contact : besoin repris de l'adresse, vérification des champs, confirmation sans envoi ;
   - mouvement (GSAP, si disponible et si les animations sont acceptées) : tracé des tuyaux
     à l'ouverture, remplissage de la conduite du déroulé au défilement. */

(() => {
  // ---------- Menu mobile ----------
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("menu");
  if (toggle && nav) {
    const label = toggle.querySelector(".menu-label");
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Fermer" : "Menu";
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

  // ---------- Accueil : sélecteur de besoin relié au schéma ----------
  const schema = document.querySelector(".schema");
  const besoinForm = document.querySelector(".besoin");
  if (schema && besoinForm) {
    const groups = schema.querySelectorAll(".groupe");
    const caption = document.querySelector("[data-schema-legende]");
    const captions = {
      fuite: "Repère A : arrivées et siphon du lavabo, là où la plupart des fuites se cachent.",
      panne: "Repère B : chauffe-eau, groupe de sécurité et départ d’eau chaude.",
      installation: "Repère C : alimentation et raccordement d’un nouvel appareil, ici un WC suspendu.",
      renovation: "Repère D : la douche et tout son réseau, refaits ensemble.",
    };
    const show = (value) => {
      schema.classList.toggle("a-choix", Boolean(value));
      groups.forEach((group) => group.classList.toggle("actif", group.dataset.besoin === value));
      if (caption && captions[value]) caption.textContent = captions[value];
    };
    besoinForm.addEventListener("change", (event) => {
      if (event.target.name === "besoin") show(event.target.value);
    });
    const checked = besoinForm.querySelector("input[name='besoin']:checked");
    if (checked) show(checked.value);
  }

  // ---------- Contact : bon de demande ----------
  const bon = document.querySelector("[data-demo-form]");
  if (bon) {
    const params = new URLSearchParams(window.location.search);
    const wanted = params.get("besoin");
    if (wanted) {
      const radio = bon.querySelector(`input[name='besoin'][value='${CSS.escape(wanted)}']`);
      if (radio) radio.checked = true;
    }

    const status = bon.querySelector(".statut");
    const messages = {
      nom: "Indiquez votre nom pour que l’artisan sache qui rappeler.",
      email: "Indiquez une adresse e-mail valide, par exemple nom@domaine.fr.",
      message: "Décrivez votre besoin en quelques mots.",
    };

    const setError = (field, text) => {
      const box = document.getElementById(`${field.id}-erreur`);
      field.setAttribute("aria-invalid", text ? "true" : "false");
      if (box) {
        box.textContent = text || "";
        box.hidden = !text;
      }
    };

    bon.querySelectorAll("input[required], textarea[required]").forEach((field) => {
      field.addEventListener("blur", () => {
        if (field.value.trim() !== "") setError(field, field.validity.valid ? "" : messages[field.id]);
      });
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true" && field.validity.valid) setError(field, "");
      });
    });

    bon.addEventListener("submit", (event) => {
      event.preventDefault();
      let firstInvalid = null;
      bon.querySelectorAll("input[required], textarea[required]").forEach((field) => {
        const valid = field.value.trim() !== "" && field.validity.valid;
        setError(field, valid ? "" : messages[field.id]);
        if (!valid && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }
      const chosen = bon.querySelector("input[name='besoin']:checked");
      const what = chosen ? chosen.closest("label").querySelector("span:last-child").textContent.trim().toLowerCase() : "votre demande";
      status.textContent = `Demande enregistrée pour « ${what} ». C’est une démonstration : rien n’a été envoyé.`;
      status.hidden = false;
      status.focus();
    });
  }

  // ---------- Mouvement ----------
  if (typeof window.gsap === "undefined") return;
  const { gsap } = window;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Le réseau se remplit depuis l'arrivée d'eau, une seule fois à l'ouverture.
    const pipes = gsap.utils.toArray(".schema .tuyau");
    let safety;
    if (pipes.length) {
      const draw = gsap.fromTo(pipes,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.07,
          delay: 0.15,
          clearProps: "strokeDasharray,strokeDashoffset",
        });
      // Garde-fou : si le navigateur suspend l'animation, le réseau s'affiche d'office.
      safety = window.setTimeout(() => {
        if (draw.progress() < 1) draw.progress(1);
      }, 2500);
    }

    // La conduite du déroulé se remplit au fil du défilement.
    const pipe = document.querySelector(".conduite span");
    if (pipe && window.ScrollTrigger) {
      gsap.fromTo(pipe, { scaleX: 0 }, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: ".deroule", start: "top 80%", end: "bottom 60%", scrub: 0.8 },
      });
    }

    return () => window.clearTimeout(safety);
  });

  if (window.ScrollTrigger) {
    window.addEventListener("load", () => window.ScrollTrigger.refresh(), { once: true });
  }
})();
