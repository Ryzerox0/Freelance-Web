"use strict";

/* Maison Olive (démo fictive)
   - carte par moment (onglets accessibles au clavier) : l'aplat de la section change de couleur ;
   - module de réservation : jours d'ouverture à venir, créneaux du service, confirmation sans envoi ;
   - barre « Réserver » collante sur téléphone, masquée quand le module est à l'écran ;
   - mouvement (GSAP, si disponible et accepté) : le soleil se lève derrière le plat, une fois. */

(() => {
  const year = document.getElementById("annee");
  if (year) year.textContent = String(new Date().getFullYear());

  // ---------- La carte par moment ----------
  const carte = document.querySelector(".carte");
  const tabs = Array.from(document.querySelectorAll(".onglets [role='tab']"));
  if (carte && tabs.length) {
    const select = (tab, focus) => {
      tabs.forEach((other) => {
        const on = other === tab;
        other.setAttribute("aria-selected", String(on));
        other.tabIndex = on ? 0 : -1;
        document.getElementById(other.getAttribute("aria-controls")).hidden = !on;
      });
      carte.dataset.moment = tab.dataset.moment;
      if (focus) tab.focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(tab, false));
      tab.addEventListener("keydown", (event) => {
        const keys = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 };
        if (!(event.key in keys)) return;
        event.preventDefault();
        select(tabs[(keys[event.key] + tabs.length) % tabs.length], true);
      });
    });
  }

  // ---------- Réservation de démonstration ----------
  const form = document.querySelector("[data-reservation]");
  if (form) {
    const jour = form.querySelector("#jour");
    const heure = form.querySelector("#heure");
    const status = document.querySelector(".reserver-statut");
    const ouvert = [2, 3, 4, 5, 6]; // du mardi au samedi, comme dans les horaires d'exemple
    const midi = ["12:00", "12:30", "13:00", "13:30"];
    const soir = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
    const format = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });

    jour.innerHTML = "";
    const today = new Date();
    for (let i = 0, added = 0; added < 8 && i < 14; i += 1) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      if (!ouvert.includes(d.getDay())) continue;
      const label = i === 0 ? "Aujourd’hui" : i === 1 ? "Demain" : format.format(d);
      jour.add(new Option(label.charAt(0).toUpperCase() + label.slice(1), [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-")));
      added += 1;
    }

    const fillSlots = () => {
      const previous = heure.value;
      heure.innerHTML = "";
      const groups = [["Déjeuner", midi], ["Dîner", soir]];
      groups.forEach(([name, slots]) => {
        const group = document.createElement("optgroup");
        group.label = name;
        slots.forEach((slot) => group.appendChild(new Option(slot.replace(":00", " h").replace(":", " h "), slot)));
        heure.appendChild(group);
      });
      if (previous) heure.value = previous;
      if (!heure.value) heure.value = "20:00";
    };
    fillSlots();

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const couverts = form.querySelector("#couverts").value;
      const dayText = jour.options[jour.selectedIndex].text.toLowerCase();
      const timeText = heure.options[heure.selectedIndex].text;
      status.textContent = `Table pour ${couverts} ${couverts === "1" ? "personne" : "personnes"}, ${dayText} à ${timeText}. C’est une démonstration : aucune réservation n’a été envoyée.`;
      status.hidden = false;
      status.focus();
    });

    // Barre collante sur téléphone : inutile quand le module est déjà visible.
    const bar = document.querySelector(".barre-reserver");
    if (bar && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => bar.classList.toggle("cachee", entry.isIntersecting));
      }, { threshold: 0.2 });
      observer.observe(form);
    }
  }

  // ---------- Mouvement ----------
  if (typeof window.gsap === "undefined") return;
  const { gsap } = window;
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    const lever = gsap.timeline({ defaults: { ease: "expo.out" } })
      .from(".soleil", { yPercent: 38, duration: 1.6 }, 0.1)
      .from(".vignette", { y: 24, duration: 1.2 }, 0.25);
    // Garde-fou : si le navigateur suspend l'animation, la scène s'affiche d'office.
    const safety = window.setTimeout(() => {
      if (lever.progress() < 1) lever.progress(1);
    }, 2500);
    return () => window.clearTimeout(safety);
  });
})();
