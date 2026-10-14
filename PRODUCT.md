# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Artisans et commerçants de Marseille et de ses alentours (plombiers, restaurateurs, commerces de proximité) qui n'ont pas de site ou dont le site a vieilli. Ils ne sont pas techniciens : ils veulent comprendre ce qu'ils achètent, combien cela coûte, et pouvoir écrire facilement à quelqu'un de confiance. Ils consultent souvent depuis un téléphone.

## Product Purpose

Studio Web est le portfolio de Baptiste Curie-Cadet, créateur indépendant de sites internet. Le site présente l'offre (création et refonte de sites vitrines, visibilité locale, maintenance, rédaction), affiche des tarifs indicatifs et amène le visiteur à envoyer un premier e-mail. Le succès : un artisan local comprend l'offre et écrit à Baptiste.

## Positioning

Un interlocuteur unique, du premier échange à la mise en ligne, qui explique sans jargon, affiche des prix indicatifs publiquement et remet un devis écrit avant de commencer.

## Operating Context

- Premier contact par e-mail uniquement (liens `mailto:` pré-remplis par offre, bouton de copie de l'adresse). Pas de formulaire ni de serveur : choix confirmé par l'utilisateur le 14/10/2026, pour ne dépendre d'aucune clé ni d'aucun service tiers.
- Les tarifs sont indicatifs ; le devis écrit fait foi.
- Site statique publié sur Cloudflare Pages (`freelance-web-932.pages.dev`), déployé depuis la branche `master`.

## Capabilities and Constraints

- Site statique HTML, CSS et JavaScript sans framework ni étape de build : `index.html`, `style.css`, `script.js`, `mentions-legales.html`, `confidentialite.html`.
- Deux démos fictives autonomes, avec leurs propres styles : `demo-plomberie.html` (+ `services.html`, `contact.html`, `plomberie.css`) et `demo-restaurant.html` (+ `restaurant.css`).
- Ancres à préserver : `#services`, `#offre`, `#realisations`, `#methode`, `#apropos`, `#faq`, `#contact`.
- Les fichiers CSS et JS sont versionnés par paramètre (`?v=`) pour contourner le cache.
- Les pages légales contiennent encore des champs `[À RENSEIGNER]` que seul l'éditeur peut compléter.
- Cloudflare Pages publie tout le contenu du dépôt : aucun fichier de travail ni secret ne doit y être versionné (`.impeccable/` et `.claude/` sont exclus par `.gitignore`).

## Brand Commitments

- Nom : Studio Web. Logo existant (`images/Logo.png`, `images/logo-studio-web.webp`) : monogramme « SW » et texte, dégradé violet vers turquoise.
- Voix : vouvoiement, phrases simples, ton chaleureux et rassurant, sans jargon technique.
- Direction visuelle demandée par l'utilisateur (14/10/2026) : portfolio sombre et élégant, surfaces noir profond, nuances gris bleuté, typographie raffinée, un accent bleu maîtrisé ; premium, sobre, précis et mémorable ; aucun effet lumineux décoratif.

## Evidence on Hand

- Deux projets de démonstration fictifs, présentés explicitement comme tels : Dupont Plomberie et Maison Olive (visuels `images/plomberie.webp`, `images/restaurant.webp`).
- Portrait de Baptiste (`images/portrait.webp`).
- Grille de tarifs indicatifs et FAQ dans `index.html`.
- Compétences techniques confirmées par l'utilisateur (14/10/2026) : HTML, CSS, JavaScript, Git et GitHub. Rien d'autre ne doit être affiché.
- Aucun client réel, témoignage, résultat chiffré, avis, certification ou expérience datée : ne pas en inventer. Le parcours se limite à ce que dit déjà le site.

## Product Principles

- La confiance avant l'effet : chaque élément doit rendre l'offre plus claire ou plus crédible.
- Les prix et les conditions restent visibles et honnêtes ; rien n'est promis que le devis ne confirmera pas.
- Le contact doit rester à un geste, sur toutes les tailles d'écran.
- Les démos restent présentées comme fictives.

## Accessibility & Inclusion

Public large et non technique, souvent sur mobile : texte lisible (au moins 16 px), contrastes AA, cibles tactiles d'au moins 44 px, navigation au clavier, respect de `prefers-reduced-motion`.
