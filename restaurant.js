"use strict";

/* Maison Olive — démo fictive de Studio Web.
   La lumière bouge, le contenu reste immobile : seule l'ombre de la canisse, les photos
   et les fenêtres en arc se déplacent ; le texte se lit toujours à l'arrêt. */
(() => {
  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sourisFine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const gsap = window.gsap;
  const anime = () => typeof gsap !== "undefined" && !reduit.matches;
  const leverAttente = () => document.documentElement.classList.remove("intro-attente");

  const annee = document.getElementById("annee");
  if (annee) annee.textContent = String(new Date().getFullYear());

  // ---------- En-tête : transparent sur la photo, plein ensuite ----------
  const entete = document.querySelector("[data-entete]");
  const accueil = document.querySelector(".accueil");
  const nav = document.getElementById("navigation");
  const navBouton = document.querySelector(".nav-bouton");
  let surAccueil = true;
  const nuits = new Set();

  const majEntete = () => {
    const ouverte = nav && nav.classList.contains("ouverte");
    if (!entete) return;
    if (ouverte) entete.dataset.etat = "plein";
    else if (surAccueil) entete.dataset.etat = "transparent";
    else entete.dataset.etat = nuits.size ? "nuit" : "plein";
  };

  // La nuit tombe : sur le soir et le pied de page, l'en-tête passe au bleu de nuit.
  if (entete && "IntersectionObserver" in window) {
    const veille = new IntersectionObserver((entrees) => {
      entrees.forEach((entree) => {
        if (entree.isIntersecting) nuits.add(entree.target);
        else nuits.delete(entree.target);
      });
      majEntete();
    }, { rootMargin: "0px 0px -94% 0px" });
    document.querySelectorAll(".soir, .pied").forEach((el) => veille.observe(el));
  }

  // L'en-tête reste transparent tant que la page est en haut, puis devient plein au premier défilement.
  let attenteEntete = 0;
  const lireDefilement = () => {
    attenteEntete = 0;
    const haut = window.scrollY < 24;
    if (haut !== surAccueil) {
      surAccueil = haut;
      majEntete();
    }
  };
  if (!accueil) surAccueil = false;
  else window.addEventListener("scroll", () => {
    if (!attenteEntete) attenteEntete = requestAnimationFrame(lireDefilement);
  }, { passive: true });
  if (accueil) lireDefilement();
  majEntete();

  // Navigation mobile
  const fermerNav = (rendreFocus) => {
    if (!nav || !navBouton) return;
    nav.classList.remove("ouverte");
    navBouton.setAttribute("aria-expanded", "false");
    majEntete();
    if (rendreFocus) navBouton.focus();
  };
  if (nav && navBouton) {
    navBouton.addEventListener("click", () => {
      const ouvrir = navBouton.getAttribute("aria-expanded") !== "true";
      // Le panneau se place juste sous l'en-tête, bandeau de démonstration compris.
      if (ouvrir && entete) nav.style.top = `${Math.round(entete.getBoundingClientRect().bottom)}px`;
      nav.classList.toggle("ouverte", ouvrir);
      navBouton.setAttribute("aria-expanded", String(ouvrir));
      majEntete();
      if (ouvrir) {
        const premier = nav.querySelector("a");
        if (premier) premier.focus();
      }
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) fermerNav(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("ouverte")) fermerNav(true);
    });
  }

  // Lien actif selon la section lue
  const liens = Array.from(document.querySelectorAll(".nav a[href^='#']"));
  const sections = liens.map((lien) => document.querySelector(lien.getAttribute("href"))).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const observateur = new IntersectionObserver((entrees) => {
      entrees.forEach((entree) => {
        if (!entree.isIntersecting) return;
        liens.forEach((lien) => {
          if (lien.getAttribute("href") === `#${entree.target.id}`) lien.setAttribute("aria-current", "true");
          else lien.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((section) => observateur.observe(section));
    // De retour sur l'accueil, aucun lien n'est actif.
    if (accueil) observateur.observe(accueil);
  }

  // ---------- Réservation de démonstration ----------
  // Horaires d'exemple : lundi fermé ; dimanche, déjeuner seulement.
  const HORAIRES = {
    midi: { 0: [12, 0, 14, 15], 2: [12, 0, 13, 45], 3: [12, 0, 13, 45], 4: [12, 0, 13, 45], 5: [12, 0, 13, 45], 6: [12, 0, 14, 15] },
    soir: { 2: [19, 30, 21, 45], 3: [19, 30, 21, 45], 4: [19, 30, 21, 45], 5: [19, 30, 21, 45], 6: [19, 30, 22, 15] },
  };
  const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const heureTexte = (h, m) => `${h} h${m ? ` ${String(m).padStart(2, "0")}` : ""}`;
  const dateTexte = (d) => `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
  const isoLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const depuisIso = (iso) => {
    const [a, m, j] = iso.split("-").map(Number);
    return new Date(a, m - 1, j);
  };

  const form = document.querySelector("[data-reservation]");
  if (form) {
    const jour = form.querySelector("#jour");
    const couverts = form.querySelector("#couverts");
    const services = Array.from(form.querySelectorAll("input[name='service']"));
    const etapes = {
      choix: form.querySelector("[data-etape='choix']"),
      heure: form.querySelector("[data-etape='heure']"),
      ticket: form.querySelector("[data-etape='ticket']"),
    };
    const creneaux = form.querySelector("[data-creneaux]");
    const resume = form.querySelector("[data-resume]");
    const ticket = form.querySelector("[data-ticket]");
    const erreur = form.querySelector("[data-erreur]");
    const moins = form.querySelector("[data-pas='-1']");
    const noteDemo = document.querySelector(".plaque-note");
    const plus = form.querySelector("[data-pas='1']");
    let etapeCourante = "choix";

    // Quatorze jours à partir d'aujourd'hui ; les jours fermés restent visibles mais inactifs.
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i += 1) {
      const d = new Date(aujourdhui);
      d.setDate(d.getDate() + i);
      const ouvert = HORAIRES.midi[d.getDay()] || HORAIRES.soir[d.getDay()];
      const option = document.createElement("option");
      option.value = isoLocal(d);
      const nom = i === 0 ? "Aujourd’hui" : i === 1 ? "Demain" : dateTexte(d);
      option.textContent = ouvert ? nom : `${nom} · fermé`;
      option.disabled = !ouvert;
      jour.appendChild(option);
    }
    const premierOuvert = Array.from(jour.options).find((o) => o.value && !o.disabled);
    if (premierOuvert) jour.value = premierOuvert.value;

    const serviceChoisi = () => (services.find((s) => s.checked) || services[1]).value;

    const afficherErreur = (message) => {
      erreur.textContent = message;
      erreur.hidden = !message;
    };

    // Un service sans horaire ce jour-là est désactivé ; on bascule sur l'autre.
    const majServices = () => {
      if (!jour.value) return;
      const j = depuisIso(jour.value).getDay();
      services.forEach((s) => {
        s.disabled = !HORAIRES[s.value][j];
      });
      if (serviceChoisi() && HORAIRES[serviceChoisi()][j] === undefined) {
        const autre = services.find((s) => !s.disabled);
        if (autre) autre.checked = true;
      }
    };

    const bornerCouverts = () => {
      const n = Math.round(Number(couverts.value));
      const valeur = Number.isFinite(n) ? Math.min(8, Math.max(1, n)) : 2;
      moins.disabled = valeur <= 1;
      plus.disabled = valeur >= 8;
      return { valeur, horsLimite: n > 8 };
    };

    const montrer = (nom, focus) => {
      etapeCourante = nom;
      Object.entries(etapes).forEach(([cle, el]) => {
        el.hidden = cle !== nom;
      });
      // Le ticket dit déjà que rien n'est envoyé : la note permanente s'efface alors.
      if (noteDemo) noteDemo.hidden = nom === "ticket";
      if (focus) focus.focus({ preventScroll: true });
      // Opacité seulement : un élément masqué ne pourrait pas recevoir le focus.
      if (anime()) gsap.fromTo(etapes[nom], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" });
    };

    // Une table « complète » est tirée de façon stable à partir de la date et de l'heure.
    const estComplet = (iso, h, m) => {
      let graine = 0;
      for (const c of `${iso}${h}${m}`) graine = (graine * 31 + c.charCodeAt(0)) % 9973;
      return graine % 4 === 0;
    };

    const construireCreneaux = () => {
      const d = depuisIso(jour.value);
      const service = serviceChoisi();
      const plage = HORAIRES[service][d.getDay()];
      creneaux.textContent = "";
      if (!plage) return 0;
      const [h0, m0, h1, m1] = plage;
      const maintenant = new Date();
      let libres = 0;
      for (let t = h0 * 60 + m0; t <= h1 * 60 + m1; t += 15) {
        const h = Math.floor(t / 60);
        const m = t % 60;
        const quand = new Date(d);
        quand.setHours(h, m, 0, 0);
        const passe = quand.getTime() < maintenant.getTime() + 60 * 60 * 1000;
        const complet = !passe && estComplet(jour.value, h, m);
        const id = `creneau-${h}-${m}`;
        const bloc = document.createElement("div");
        bloc.className = "creneau";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "heure";
        input.id = id;
        input.value = `${h}:${m}`;
        input.disabled = passe || complet;
        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = heureTexte(h, m);
        if (passe || complet) {
          const raison = document.createElement("span");
          raison.className = "visuellement-cache";
          raison.textContent = passe ? " (passé)" : " (complet)";
          label.appendChild(raison);
        } else {
          libres += 1;
        }
        bloc.append(input, label);
        creneaux.appendChild(bloc);
      }
      if (!libres) {
        creneaux.textContent = "";
        const vide = document.createElement("p");
        vide.className = "creneaux-vide";
        vide.textContent = "Plus de table libre à ce service. Essayez un autre jour ou l’autre service.";
        creneaux.appendChild(vide);
      }
      return libres;
    };

    jour.addEventListener("change", () => {
      majServices();
      afficherErreur("");
    });
    services.forEach((s) => s.addEventListener("change", () => afficherErreur("")));
    [moins, plus].forEach((bouton) => {
      bouton.addEventListener("click", () => {
        couverts.value = String(bornerCouverts().valeur + Number(bouton.dataset.pas));
        bornerCouverts();
        afficherErreur("");
      });
    });
    couverts.addEventListener("change", () => {
      const { valeur, horsLimite } = bornerCouverts();
      couverts.value = String(valeur);
      afficherErreur(horsLimite ? "En ligne, jusqu’à huit couverts. Pour un groupe, voyez « Peut-on venir à plus de huit ? » dans les infos pratiques." : "");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      afficherErreur("");
      if (etapeCourante === "choix") {
        if (!jour.value) {
          afficherErreur("Choisissez un jour d’ouverture.");
          jour.focus();
          return;
        }
        const { valeur } = bornerCouverts();
        couverts.value = String(valeur);
        const d = depuisIso(jour.value);
        const service = serviceChoisi() === "midi" ? "déjeuner" : "dîner";
        resume.textContent = `Heure du ${service} · ${dateTexte(d)} · ${valeur} couvert${valeur > 1 ? "s" : ""}`;
        const libres = construireCreneaux();
        montrer("heure", libres ? creneaux.querySelector("input:not(:disabled)") : form.querySelector("[data-retour]"));
        return;
      }
      if (etapeCourante === "heure") {
        const choisi = creneaux.querySelector("input:checked");
        if (!choisi) {
          afficherErreur("Choisissez une heure parmi les tables libres.");
          const premier = creneaux.querySelector("input:not(:disabled)");
          if (premier) premier.focus();
          return;
        }
        const [h, m] = choisi.value.split(":").map(Number);
        const n = Number(couverts.value);
        ticket.textContent = "";
        const ligne = document.createElement("strong");
        ligne.textContent = `Table pour ${n} · ${dateTexte(depuisIso(jour.value))} · ${heureTexte(h, m)}`;
        const note = document.createElement("span");
        note.textContent = "Démonstration : rien n’a été envoyé. Sur le site d’un vrai restaurant, cette étape transmet la demande à son outil de réservation et une confirmation part par e-mail.";
        ticket.append(ligne, note);
        montrer("ticket", etapes.ticket);
      }
    });

    form.querySelector("[data-retour]").addEventListener("click", () => {
      afficherErreur("");
      montrer("choix", jour);
    });
    form.querySelector("[data-recommencer]").addEventListener("click", () => {
      afficherErreur("");
      montrer("choix", jour);
    });

    majServices();
    bornerCouverts();

    // Les appels « Réserver » ailleurs dans la page ramènent au module et donnent le focus au jour.
    document.querySelectorAll("[data-vers-reservation], .entete-reserver").forEach((lien) => {
      lien.addEventListener("click", (event) => {
        event.preventDefault();
        const plaque = document.getElementById("reserver");
        plaque.scrollIntoView({ behavior: reduit.matches ? "auto" : "smooth", block: "center" });
        window.setTimeout(() => {
          if (etapeCourante === "ticket") montrer("choix", jour);
          else jour.focus({ preventScroll: true });
        }, reduit.matches ? 0 : 700);
      });
    });
  }

  // ---------- Barre « Réserver » en bas d'écran (mobile) ----------
  const barre = document.querySelector("[data-barre]");
  const plaque = document.getElementById("reserver");
  const soir = document.querySelector(".soir");
  if (barre && plaque && "IntersectionObserver" in window) {
    const visibles = new Set();
    let depasse = false;
    const maj = () => barre.classList.toggle("visible", depasse && visibles.size === 0);
    new IntersectionObserver(([entree]) => {
      if (entree.isIntersecting) visibles.add("plaque");
      else visibles.delete("plaque");
      depasse = entree.boundingClientRect.top < 0 || depasse;
      if (entree.boundingClientRect.top > 0 && !entree.isIntersecting) depasse = false;
      maj();
    }).observe(plaque);
    if (soir) {
      new IntersectionObserver(([entree]) => {
        if (entree.isIntersecting) visibles.add("soir");
        else visibles.delete("soir");
        maj();
      }, { threshold: 0.3 }).observe(soir);
    }
  }

  // ---------- La carte : Midi / Soir ----------
  // Grand écran : les deux moitiés côte à côte. Plus étroit : deux onglets.
  const carte = document.querySelector(".carte");
  const onglets = Array.from(document.querySelectorAll(".onglets [role='tab']"));
  const panneaux = onglets.map((o) => document.getElementById(o.getAttribute("aria-controls")));
  const large = window.matchMedia("(min-width: 1025px)");
  const choisirOnglet = (onglet, focus) => {
    onglets.forEach((o) => {
      const actif = o === onglet;
      o.setAttribute("aria-selected", String(actif));
      o.tabIndex = actif ? 0 : -1;
      const panneau = document.getElementById(o.getAttribute("aria-controls"));
      panneau.hidden = !actif;
      if (actif && anime()) {
        gsap.fromTo(panneau.querySelectorAll(".formule, .plats li"), { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.03, overwrite: true });
      }
    });
    if (focus) onglet.focus();
  };
  onglets.forEach((onglet, i) => {
    onglet.addEventListener("click", () => choisirOnglet(onglet, false));
    onglet.addEventListener("keydown", (event) => {
      const cible = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: onglets.length - 1 }[event.key];
      if (cible === undefined) return;
      event.preventDefault();
      choisirOnglet(onglets[(cible + onglets.length) % onglets.length], true);
    });
  });
  const modeCarte = () => {
    if (!carte || !onglets.length) return;
    const cote = large.matches;
    carte.classList.toggle("cote-a-cote", cote);
    panneaux.forEach((panneau, i) => {
      if (cote) {
        panneau.hidden = false;
        panneau.removeAttribute("role");
        panneau.removeAttribute("aria-labelledby");
        panneau.removeAttribute("tabindex");
      } else {
        panneau.setAttribute("role", "tabpanel");
        panneau.setAttribute("aria-labelledby", onglets[i].id);
        panneau.tabIndex = 0;
        panneau.hidden = onglets[i].getAttribute("aria-selected") !== "true";
      }
    });
  };
  // Le soir venu, la carte s'ouvre sur le dîner (en onglets).
  if (onglets.length === 2 && new Date().getHours() >= 16) choisirOnglet(onglets[1], false);
  modeCarte();
  large.addEventListener("change", modeCarte);

  // ---------- Aperçu de l'assiette au survol (souris uniquement) ----------
  const apercu = document.querySelector(".apercu");
  const apercuImg = apercu && apercu.querySelector("img");
  if (apercu && apercuImg) {
    let cx = 0;
    let cy = 0;
    let x = 0;
    let y = 0;
    let boucle = 0;
    const suivre = () => {
      x += (cx - x) * 0.18;
      y += (cy - y) * 0.18;
      apercu.style.transform = `translate3d(${x + 24}px, ${y - 120}px, 0)`;
      boucle = Math.abs(cx - x) + Math.abs(cy - y) > 0.5 ? requestAnimationFrame(suivre) : 0;
    };
    document.querySelectorAll(".plats li[data-photo]").forEach((li) => {
      li.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "mouse" || !sourisFine.matches) return;
        apercuImg.src = li.dataset.photo;
        cx = x = event.clientX;
        cy = y = event.clientY;
        apercu.style.transform = `translate3d(${x + 24}px, ${y - 120}px, 0)`;
        apercu.classList.add("visible");
      });
      li.addEventListener("pointermove", (event) => {
        cx = event.clientX;
        cy = event.clientY;
        if (!boucle) boucle = requestAnimationFrame(suivre);
      });
      li.addEventListener("pointerleave", () => apercu.classList.remove("visible"));
    });
  }

  // ---------- Le lieu : les volets ----------
  // D'après « Hover Expand Gallery » de Kedhareswer Naidu (21st.dev, licence MIT) :
  // https://21st.dev/@kedhareswer/components/hover-expand-gallery
  const volets = Array.from(document.querySelectorAll("[data-volets] .volet"));
  const ouvrirVolet = (volet) => {
    volets.forEach((v) => {
      const ouvert = v === volet;
      v.classList.toggle("ouvert", ouvert);
      v.querySelector(".volet-bouton").setAttribute("aria-expanded", String(ouvert));
    });
  };
  volets.forEach((volet, i) => {
    const bouton = volet.querySelector(".volet-bouton");
    bouton.addEventListener("click", () => ouvrirVolet(volet));
    bouton.addEventListener("focus", () => ouvrirVolet(volet));
    volet.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") ouvrirVolet(volet);
    });
    bouton.addEventListener("keydown", (event) => {
      const pas = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!pas) return;
      event.preventDefault();
      volets[(i + pas + volets.length) % volets.length].querySelector(".volet-bouton").focus();
    });
  });

  // ---------- Le menu : choisir un temps à la souris quand rien n'est épinglé ----------
  const tempsItems = Array.from(document.querySelectorAll(".temps-item"));
  const fenetres = Array.from(document.querySelectorAll(".menu-cadre img"));
  const menuSection = document.querySelector(".menu");
  let menuEpingle = false;
  const montrerTemps = (index) => {
    tempsItems.forEach((li, i) => li.classList.toggle("actif", i === index));
    if (menuEpingle) return;
    fenetres.forEach((img, i) => {
      if (i > 0) img.style.clipPath = i <= index ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)";
    });
  };
  tempsItems.forEach((li, i) => {
    li.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse" && !menuEpingle) montrerTemps(i);
    });
  });

  // ---------- Mouvement ----------
  if (typeof gsap === "undefined") {
    leverAttente();
    return;
  }
  // On découpe les titres une fois les polices prêtes (sinon les lignes seraient fausses),
  // sans jamais attendre plus de 700 ms.
  const polices = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([polices, new Promise((r) => window.setTimeout(r, 700))]).then(demarrerMouvement);

  function demarrerMouvement() {
    const ST = window.ScrollTrigger;
    const Split = window.SplitText;
    if (ST) gsap.registerPlugin(ST);
    if (Split) gsap.registerPlugin(Split);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", (contexte) => {
      const decoupes = [];
      const canisse = document.querySelector(".canisse-accueil");
      const photo = document.querySelector(".accueil-photo img");
      const mobile = window.matchMedia("(max-width: 700px)").matches;

      // 1. Entrée : l'ombre couvre la table, puis glisse et découvre la lumière ; le nom se pose.
      const intro = gsap.timeline({ defaults: { ease: "expo.out" }, onStart: leverAttente });
      if (canisse) {
        intro.fromTo(canisse, mobile ? { "--decalage-y": "-38vh" } : { "--decalage": "38vw" },
          { ...(mobile ? { "--decalage-y": "0px" } : { "--decalage": "0px" }), duration: 1.9, ease: "power3.inOut" }, 0);
      }
      if (photo) intro.fromTo(photo, { scale: 1.08 }, { scale: 1, duration: 2.4, ease: "power2.out" }, 0);
      const titre = document.querySelector(".accueil h1");
      if (titre && Split) {
        const split = Split.create(titre, { type: "lines,chars", mask: "lines" });
        decoupes.push(split);
        intro.from(split.chars, { yPercent: 115, duration: 1.2, stagger: 0.035 }, 0.55);
      }
      intro.from(".accueil-titre p", { autoAlpha: 0, y: 16, duration: 1 }, 0.95);
      intro.from(".plaque", { autoAlpha: 0, y: 28, duration: 1.1 }, 1.05);
      const secours = window.setTimeout(() => {
        leverAttente();
        intro.progress(1);
      }, 3200);

      if (!ST) return () => window.clearTimeout(secours);

      // Préparation en petites étapes, pendant les temps morts : l'entrée démarre tout de suite.
      const etapes = [
        () => {
          // 2. L'après-midi avance : l'ombre gagne la table pendant qu'on quitte l'accueil.
          if (canisse && !mobile) {
            gsap.to(canisse, {
              "--decalage": "26vw", ease: "none", immediateRender: false,
              scrollTrigger: { trigger: ".accueil", start: "top top", end: "bottom top", scrub: true },
            });
          }
          if (photo) {
            gsap.to(photo, {
              yPercent: 10, ease: "none", immediateRender: false,
              scrollTrigger: { trigger: ".accueil", start: "top top", end: "bottom top", scrub: true },
            });
          }
        },
        () => {
          // 3. La maison : la phrase s'éclaire mot à mot, comme un mur que le soleil atteint.
          const phrase = document.querySelector(".maison-phrase");
          if (phrase && Split) {
            const split = Split.create(phrase, { type: "words" });
            decoupes.push(split);
            gsap.fromTo(split.words, { color: "rgba(28, 33, 64, 0.2)" }, {
              color: "#1c2140", ease: "none", stagger: 0.12,
              scrollTrigger: { trigger: phrase, start: "top 78%", end: "bottom 42%", scrub: 0.6 },
            });
          }
          const arche = document.querySelector(".maison-photo");
          if (arche) {
            gsap.fromTo(arche, { clipPath: "inset(18% 0% 0% 0%)" }, {
              clipPath: "inset(0% 0% 0% 0%)", ease: "none",
              scrollTrigger: { trigger: arche, start: "top 95%", end: "top 45%", scrub: 0.6 },
            });
            gsap.fromTo(arche.querySelector("img"), { scale: 1.14 }, {
              scale: 1, ease: "none",
              scrollTrigger: { trigger: arche, start: "top bottom", end: "bottom top", scrub: true },
            });
          }
        },
        () => {
          // 3 bis. La bande d'ombre glisse sur les murs de chaux pendant qu'on les longe.
          gsap.utils.toArray(".canisse-mur").forEach((mur) => {
            gsap.fromTo(mur, { "--decalage": "-22vw" }, {
              "--decalage": "22vw", ease: "none",
              scrollTrigger: { trigger: mur.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            });
          });
        },
        () => {
          // 4. Les grands aplats d'ombre entrent par une seule ligne en diagonale.
          gsap.utils.toArray(".menu, .soir").forEach((section) => {
            gsap.fromTo(section, { clipPath: "polygon(0% 9%, 100% 0%, 100% 100%, 0% 100%)" }, {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: "top 30%", scrub: true },
            });
          });
        },
        () => {
          // 5. Petit écran : chaque assiette s'ouvre dans sa fenêtre en arc.
          if (window.matchMedia("(min-width: 1025px)").matches) return;
          gsap.utils.toArray(".temps-photo").forEach((arche) => {
            gsap.fromTo(arche, { clipPath: "inset(30% 0% 0% 0%)" }, {
              clipPath: "inset(0% 0% 0% 0%)", ease: "none",
              scrollTrigger: { trigger: arche, start: "top 96%", end: "top 55%", scrub: 0.5 },
            });
          });
        },
        () => {
          // 6. Le lieu : les volets sont clos, le premier s'ouvre quand on arrive.
          const lieu = document.querySelector(".volets");
          if (lieu && volets.length) {
            ouvrirVolet(null);
            ST.create({ trigger: lieu, start: "top 70%", once: true, onEnter: () => ouvrirVolet(volets[0]) });
          }
        },
        () => {
          // 7. Le soir : la photo se pose, le titre s'écrit lettre à lettre.
          gsap.fromTo(".soir-photo img", { scale: 1.12 }, {
            scale: 1, ease: "none",
            scrollTrigger: { trigger: ".soir", start: "top bottom", end: "bottom bottom", scrub: true },
          });
          const titreSoir = document.querySelector(".soir h2");
          if (titreSoir && Split) {
            const split = Split.create(titreSoir, { type: "lines,chars", mask: "lines" });
            decoupes.push(split);
            gsap.from(split.chars, {
              yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.04,
              scrollTrigger: { trigger: ".soir", start: "top 55%", once: true },
            });
          }
        },
        () => window.addEventListener("load", () => ST.refresh(), { once: true }),
      ];
      let tache = 0;
      const suivante = () => {
        const etape = etapes.shift();
        if (!etape) return;
        contexte.add(etape);
        tache = "requestIdleCallback" in window
          ? window.requestIdleCallback(suivante, { timeout: 600 })
          : window.setTimeout(suivante, 50);
      };
      tache = "requestIdleCallback" in window
        ? window.requestIdleCallback(suivante, { timeout: 900 })
        : window.setTimeout(suivante, 150);

      return () => {
        window.clearTimeout(secours);
        if ("cancelIdleCallback" in window) window.cancelIdleCallback(tache);
        window.clearTimeout(tache);
        decoupes.forEach((split) => split.revert());
        if (volets.length && !volets.some((v) => v.classList.contains("ouvert"))) ouvrirVolet(volets[0]);
      };
    });

    // Le menu du marché, épinglé sur grand écran : les cinq temps défilent dans une fenêtre en arc.
    mm.add("(min-width: 1025px) and (prefers-reduced-motion: no-preference)", () => {
      const scene = document.querySelector(".menu-scene");
      const fenetreCanisse = document.querySelector(".canisse-fenetre");
      if (!scene || !window.ScrollTrigger || fenetres.length < 2) return undefined;
      menuEpingle = true;
      menuSection.classList.add("anime");
      fenetres.forEach((img) => { img.loading = "eager"; });
      const n = fenetres.length;
      let indexCourant = -1;
      montrerTemps(0);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scene,
          start: () => `top ${entete ? entete.offsetHeight : 0}px`,
          end: () => "+=" + window.innerHeight * 0.75 * (n - 1),
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.min(n - 1, Math.round(self.progress * (n - 1)));
            if (i !== indexCourant) {
              indexCourant = i;
              montrerTemps(i);
            }
          },
        },
      });
      for (let i = 1; i < n; i += 1) {
        tl.fromTo(fenetres[i], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" }, i - 1)
          .fromTo(fenetres[i], { scale: 1.12 }, { scale: 1, duration: 1.2 }, i - 1)
          .to(fenetres[i - 1], { scale: 1.06, duration: 1 }, i - 1);
      }
      if (fenetreCanisse) tl.fromTo(fenetreCanisse, { "--decalage": "-18%" }, { "--decalage": "22%", duration: n - 1 }, 0);

      return () => {
        menuEpingle = false;
        menuSection.classList.remove("anime");
        gsap.set(fenetres, { clearProps: "clipPath,transform" });
        tempsItems.forEach((li) => li.classList.remove("actif"));
      };
    });

    // Sans mouvement : la fenêtre du menu suit simplement le temps survolé, sans transition.
    if (reduit.matches) {
      leverAttente();
      montrerTemps(0);
    }
  }
})();
