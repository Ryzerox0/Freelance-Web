---
name: Studio Web
description: Portfolio de Baptiste Curie-Cadet, créateur de sites vitrines pour artisans et commerçants de Marseille. Noir bleuté, sobre, un seul bleu.
colors:
  noir: "#090b0f"
  ardoise: "#10141b"
  ardoise-2: "#161c25"
  texte: "#e6eaf0"
  texte-doux: "#b4bfcd"
  gris: "#8b97a8"
  filet: "rgba(139, 151, 168, 0.18)"
  filet-fort: "rgba(139, 151, 168, 0.34)"
  bleu: "#4f8cff"
  bleu-plein: "#2f6bea"
  bleu-survol: "#2559c9"
  bleu-voile: "rgba(79, 140, 255, 0.07)"
  bleu-clair: "#a9c6ff"
  blanc: "#ffffff"
typography:
  display:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.6vw, 5.1rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.8vw, 3.1rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline-contact:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 5vw, 4rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  title-case:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.8vw, 1.45rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title-small:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  price:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  email:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 5.4vw, 4.2rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  lead-display:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 1.9vw, 1.6rem)"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  body-lead:
    fontFamily: "Atkinson Hyperlegible, Verdana, sans-serif"
    fontSize: "clamp(1.0625rem, 1.3vw, 1.18rem)"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "Atkinson Hyperlegible, Verdana, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  body-small:
    fontFamily: "Atkinson Hyperlegible, Verdana, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Atkinson Hyperlegible, Verdana, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.65
  cote:
    fontFamily: "Fragment Mono, ui-monospace, Consolas, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  rayon: "6px"
  feuille: "8px"
  rond: "50%"
spacing:
  gouttiere: "clamp(20px, 5vw, 64px)"
  section: "clamp(88px, 11vw, 152px)"
  entete: "72px"
  entete-mobile: "64px"
  largeur: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.bleu-plein}"
    textColor: "{colors.blanc}"
    typography: "{typography.label}"
    rounded: "{rounded.rayon}"
    padding: "0 24px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.bleu-survol}"
    textColor: "{colors.blanc}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.texte}"
    typography: "{typography.label}"
    rounded: "{rounded.rayon}"
    padding: "0 24px"
    height: "50px"
  button-outline-hover:
    backgroundColor: "{colors.bleu-voile}"
    textColor: "{colors.texte}"
  quote-cta:
    backgroundColor: "transparent"
    textColor: "{colors.texte}"
    typography: "{typography.label}"
    rounded: "{rounded.rayon}"
    padding: "0 18px"
    height: "46px"
  nav-cta:
    backgroundColor: "transparent"
    textColor: "{colors.texte}"
    typography: "{typography.label}"
    rounded: "{rounded.rayon}"
    padding: "0 18px"
    height: "44px"
  nav-cta-mobile:
    backgroundColor: "{colors.bleu-plein}"
    textColor: "{colors.blanc}"
    rounded: "{rounded.rayon}"
    height: "56px"
  text-link:
    textColor: "{colors.texte}"
    typography: "{typography.label}"
    height: "44px"
  text-link-hover:
    textColor: "{colors.blanc}"
  skill-chip:
    backgroundColor: "transparent"
    textColor: "{colors.texte}"
    typography: "{typography.cote}"
    rounded: "{rounded.rayon}"
    padding: "6px 14px"
  quote-line-featured:
    backgroundColor: "{colors.ardoise-2}"
    padding: "24px 20px"
  case-shot:
    rounded: "{rounded.feuille}"
---

# Design System: Studio Web

## Overview

**Creative North Star: « La précision sans effet »**

Studio Web se présente comme un atelier sérieux et clair : on comprend en un écran qui est Baptiste, ce qu'il propose et à partir de quel prix, sans image de démonstration en ouverture. Le monde est un noir bleuté profond, des surfaces ardoise à peine plus claires, des filets d'un pixel et un seul bleu qui sert de lien, de repère et d'action. La précision remplace l'effet : tout est aligné, mesuré et lisible.

Décision de l'utilisateur (14/10/2026) : pas d'image de site fictif en haut de page, et pas d'effet d'apparition (tracé, révélation, comparateur) sur les captures des démos. Les démos s'affichent en captures fixes dans la section Réalisations.

La densité est éditoriale et calme : de grandes respirations entre sections, des listes structurées par des filets plutôt que des cartes, des tableaux de devis qui se lisent comme une feuille d'atelier. La typographie porte l'élégance (grotesque serrée en titres, texte hyperlisible), le bleu porte la structure. La profondeur ne vient jamais d'une lueur ni d'un flou : uniquement de deux tons d'ardoise et de filets.

Refus confirmés par l'utilisateur et le contrat : aucun effet lumineux, aucun halo, aucun flou, aucun dégradé décoratif, pas de portfolio noir générique à cartes.

**Key Characteristics:**
- Noir bleuté, deux ardoises, trois niveaux de texte gris bleuté, un seul bleu.
- Filets d'un pixel comme unique structure (listes, tableaux, en-têtes, pied de page).
- Ouverture en texte seul : titre, présentation, bouton, et un encadré « L'essentiel » (prix de départ, devis écrit, interlocuteur, zone).
- Démos en captures fixes, encadrées d'un filet, sans animation.
- Mouvement limité au titre qui s'écrit et à la ligne de cote de la méthode.
- Aucune ombre, aucune lueur, aucun flou.

## Colors

Une palette nocturne quasi monochrome, gris bleuté du fond au texte, traversée par un seul bleu franc.

### Primary
- **Bleu de trait** (`bleu`) : le soulignement des liens, le trait qui se trace sous la navigation survolée, la ligne de cote de la méthode, les numéros d'étape, les puces en tiret des inclusions, l'icône plus/moins de la FAQ, l'anneau de focus (2px, décalage 3px) et la couleur du curseur de saisie. Contraste 6:1 sur le fond.
- **Bleu plein** (`bleu-plein`) : le seul aplat bleu du site, réservé à l'action principale (« Écrire à Baptiste », « Aller à l'accueil », bouton « Me contacter » dans le menu mobile) et à la sélection de texte. Texte blanc dessus (4,8:1).
- **Bleu survol** (`bleu-survol`) : état survolé du bouton plein uniquement.
- **Voile bleu** (`bleu-voile`) : remplissage à 7 % des boutons contour au survol.
- **Bleu clair** (`bleu-clair`) : petit texte bleu qui doit rester lisible en gras à 0,875rem (étiquette « Plus complet », liens dans le texte légal, bouton « Ce qui est inclus » sur mobile). Valeur codée en dur dans la feuille, pas encore en propriété personnalisée.

### Neutral
- **Noir bleuté** (`noir`) : fond de page, en-tête défilé (à 96 % d'opacité), menu mobile, pied de page.
- **Ardoise** (`ardoise`) : fond des sections Tarifs et Contact.
- **Ardoise claire** (`ardoise-2`) : la ligne de tarif mise en avant ; aucun autre usage en surface.
- **Texte** (`texte`) : titres, texte fort, montants, adresse e-mail (16:1).
- **Texte doux** (`texte-doux`) : paragraphes courants et liens de navigation au repos (10:1).
- **Gris ardoise** (`gris`) : légendes, notes, problèmes des services, unités de prix, en-têtes de colonnes (6,6:1).
- **Filet** (`filet`) : séparateurs entre lignes de listes et de tableaux, bordures de section.
- **Filet fort** (`filet-fort`) : bord d'ouverture d'une liste ou d'un tableau, cadre des captures et du portrait, contour des boutons secondaires et des étiquettes de compétence, piste du curseur.
- **Blanc** (`blanc`) : texte sur bleu plein, et état survolé des liens et des questions de FAQ (le texte passe de `texte` à blanc).

### Exception de marque
Le logo existant (`images/logo-studio-web*.webp`) garde son dégradé violet vers turquoise : c'est un actif de marque antérieur, et la seule couleur hors palette admise. Il ne fournit aucune couleur au reste du système.

### Named Rules
**La règle du bleu unique.** Un seul bleu dessine, souligne et agit. Aucune deuxième teinte d'accent ; seul le logo fait exception.

**La règle de l'aplat rare.** Le bleu plein n'apparaît qu'en fond du bouton d'action principale. Partout ailleurs le bleu est un trait d'un pixel ou un voile de 7 %.

## Typography

**Display Font:** Schibsted Grotesk (avec Segoe UI, system-ui)
**Body Font:** Atkinson Hyperlegible (avec Verdana)
**Label/Mono Font:** Fragment Mono (avec ui-monospace, Consolas)

**Character:** une grotesque serrée, graisse 500 et interlettrage négatif, pour une élégance d'architecte ; un texte conçu pour la lisibilité pour un public non technique ; un mono réservé à ce qui se mesure.

Écart assumé par rapport au contrat de direction : le contrat nommait Geist et Geist Mono ; le détecteur les a signalés comme surexploitées, d'où Schibsted Grotesk et Fragment Mono.

### Hierarchy
- **Display** (500, clamp(2.5rem, 5.6vw, 5.1rem), 1.02, -0.035em) : le titre d'accueil, en trois lignes ; clamp(2.15rem, 9.6vw, 3rem) sous 760px. Les titres de page des pages légales et 404 suivent la même voix à clamp(2.4rem, 5.4vw, 4.2rem).
- **Headline** (500, clamp(2rem, 3.8vw, 3.1rem), 1.05, -0.025em) : titres de section. Le titre du contact monte à clamp(2.3rem, 5vw, 4rem), limité à 18ch.
- **Title réalisation** (500, clamp(1.8rem, 2.8vw, 2.4rem), -0.03em) : nom de chaque démo.
- **Title** (600, clamp(1.25rem, 1.8vw, 1.45rem), 1.2) : services, étapes, groupes de tarifs (ceux-ci à 500, clamp(1.5rem, 2.2vw, 1.9rem)).
- **Title small** (600, 1.2rem, 1.25) : intitulé de chaque ligne de tarif.
- **Prix** (Schibsted Grotesk 500, 1.75rem, chiffres tabulaires, -0.03em, jamais coupé) : montants des tarifs.
- **Adresse e-mail** (Schibsted Grotesk 400, clamp(1.9rem, 5.4vw, 4.2rem)) : l'adresse du contact, soulignée d'un filet bleu.
- **Chapeau en display** (Schibsted Grotesk 400, clamp(1.3rem, 1.9vw, 1.6rem), 1.35) : la phrase d'ouverture de « À propos ».
- **Body lead** (Atkinson 400, clamp(1.0625rem, 1.3vw, 1.18rem), 1.65) : phrase d'accueil et chapeau du contact, 38 à 40rem de large.
- **Body** (Atkinson 400, 1.0625rem, 1.65) : tout le texte courant, 62 à 72ch maximum.
- **Body small** (Atkinson 400, 0.95rem) : légendes, notes, inclusions, conditions, pied de page. Jamais en dessous.
- **Label** (Atkinson 700, 1rem) : boutons, liens d'action, navigation (0.97rem), questions de FAQ (1.08rem).
- **Cote** (Fragment Mono 400, 0.9 à 0.95rem) : en-têtes de colonnes du devis, numéros d'étape 01 à 04, étiquettes de compétence.

### Named Rules
**La règle du mono qui mesure.** Fragment Mono n'écrit que des mesures, des repères et des noms d'outils : cotes, numéros, colonnes, compétences. Jamais un titre, jamais une phrase.

**La règle des prix lisibles.** Les montants sont en Schibsted Grotesk à chiffres tabulaires, pas en mono : écart délibéré au contrat (qui prévoyait le mono), pour la lisibilité des grands montants.

## Layout

Conteneur unique de 1200px plus deux gouttières fluides (clamp(20px, 5vw, 64px)). Les sections respirent de clamp(88px, 11vw, 152px) ; l'en-tête collant fait 72px (64px sous 760px) et le défilement par ancre compense sa hauteur plus 16px.

Les compositions sont des grilles asymétriques en fractions : en-tête de section 6/5 (titre à gauche, phrase alignée en bas à droite), services en trois colonnes 3/4/5 (titre, problème, réponse) alignées sur la ligne de base, réalisations 7/4 alternées (la seconde inversée), à propos 5/7, FAQ 4/8 avec la colonne de titre collante, devis en trois colonnes (intitulé, prix de 11rem, bouton de 12rem). La feuille d'accueil est en retrait à droite, 840px maximum, pour laisser le titre dominer.

Sections alternées : fond noir, puis Tarifs et Contact sur ardoise, bornés par des filets.

Points de rupture observés :
- **1024px** : le devis resserre ses colonnes (9rem, puis bouton à largeur libre) ; services en deux colonnes avec titre au-dessus ; méthode en deux colonnes et la ligne de cote disparaît ; FAQ et réalisations en une colonne, la colonne de titre FAQ cesse d'être collante.
- **960px** : la navigation passe en menu repliable (même seuil dans script.js) : liste plein écran sous l'en-tête, liens en Schibsted Grotesk 1.35rem séparés par des filets, hauteur 56px, et « Me contacter » devient un bouton bleu plein.
- **760px** : tout passe en une colonne ; boutons d'accueil et de contact pleine largeur ; les lignes de tarif s'empilent (intitulé, prix, bouton) et leurs inclusions se replient derrière « Ce qui est inclus » (ouvertes sans JavaScript) ; les en-têtes de colonnes du devis disparaissent .

## Elevation & Depth

Le système est entièrement plat. Aucune `box-shadow`, aucun `backdrop-filter`, aucun flou, aucune lueur. La profondeur vient de trois moyens seulement : le passage noir vers ardoise vers ardoise claire, les filets d'un pixel à deux intensités, et les filets qui bornent listes, tableaux et images. L'en-tête ne s'opacifie (noir à 96 %, filet bas) qu'après 18px de défilement.

### Named Rules
**La règle du filet.** Ce qui sépare est un filet d'un pixel ; ce qui ouvre une liste est un filet fort. Jamais une ombre, jamais une carte flottante.

## Shapes

Des angles à peine adoucis : 6px pour tout ce qui se clique ou s'étiquette (boutons, appel de devis, étiquettes de compétence, lien d'évitement), 8px pour ce qui encadre une image (captures de démo, portrait). Seul rond : la poignée de la barre de défilement. Les marqueurs sont dessinés au trait plutôt qu'en glyphes : tiret de 7px pour les inclusions, croix de deux traits de 1,5px pour la FAQ, deux barres pour le menu.

## Components

### Buttons
Sobres et nets, hauteur généreuse pour le toucher.
- **Shape:** angles légèrement adoucis (6px), hauteur 50px, marge interne 0 24px, Atkinson 700 1rem.
- **Primary:** aplat bleu plein, texte blanc. Un par écran au plus.
- **Hover / Focus:** le fond passe au bleu survol en 220ms ; enfoncé, translation de 1px vers le bas ; focus en anneau bleu de 2px décalé de 3px.
- **Outline:** fond transparent, contour filet fort, texte clair ; au survol le contour devient bleu et le fond prend le voile bleu. Même traitement pour « Demander un devis » (46px, 0 18px) et « Me contacter » dans la navigation (44px).

### Liens d'action
- Texte clair en gras, soulignement bleu de 1px décalé de 6px ; au survol le texte devient blanc et le soulignement descend à 9px. Hauteur de cible 44px.
- Liens du pied de page : texte doux, soulignement filet fort qui devient bleu au survol.

### Chips
- **Style:** étiquettes de compétence en Fragment Mono 0.95rem, contour filet fort, 6px, marge 6px 14px, fond transparent. Pas d'état sélectionné : ce sont des étiquettes, pas des filtres.

### Navigation
- Liens en Atkinson 700, texte doux, 44px de haut ; au survol le texte s'éclaircit et un trait bleu de 1px se trace de gauche à droite sous le lien (380ms, courbe de sortie). « Me contacter » en bouton contour.
- Sous 960px : bouton à deux barres qui se croisent en X, liste déroulée sur fond noir, liens en Schibsted Grotesk 1.35rem, « Me contacter » en bleu plein.
- Pages légales et 404 : seulement le logo et « Retour à l'accueil ».

### Encadré « L'essentiel » (ouverture)
- À droite de la présentation (sept colonnes contre quatre) ; au-dessus de 760px seulement, empilé dessous sur téléphone.
- Ouvert par un filet fort, lignes séparées par des filets, libellé en gris à gauche, valeur en Schibsted Grotesk 600 à droite (retour à la ligne permis).
- Contenu uniquement tiré des tarifs et du produit : création dès 600 €, refonte dès 350 €, devis écrit, interlocuteur unique, Marseille et alentours.

### Capture de démo
- Capture fixe de la page d'accueil de la démo, format 1440/900, filet fort, angles de 8px, chargement différé.
- Aucune animation, aucun plan, aucun curseur : la capture illustre, le texte (objectif, choix, résultat) explique.

### Feuille de devis
- Tableau ouvert par un filet fort, en-têtes de colonnes en mono gris, groupes titrés au-dessus d'un filet fort, lignes séparées par des filets (24px de marge verticale).
- La ligne mise en avant déborde de 20px de chaque côté sur fond ardoise claire, avec l'étiquette « Plus complet » en bleu clair.
- Inclusions en deux colonnes, chaque élément précédé d'un tiret bleu de 7px.
- Prix alignés à droite (à gauche sous 760px), unité en gris en dessous.

### Ligne de cote de la méthode
Quatre étapes sur une ligne horizontale : un filet fort de fond, un trait bleu qui le recouvre au fil du défilement (variable de progression de 0 à 1, entre 85 % et 55 % de la fenêtre, lissage 0,6), un talon bleu vertical de 15px au-dessus de chaque étape, et le numéro en mono bleu au-dessus du titre. Sans JavaScript, la ligne est entièrement tracée. Sous 1024px, la ligne et les talons disparaissent et seuls les numéros restent.

### FAQ
Questions en Atkinson 700 1.08rem, 66px de haut minimum, séparées par des filets ; une croix bleue dont la barre verticale pivote à plat à l'ouverture (380ms).

### Mouvement
- **Ouverture:** chaque ligne du titre s'écrit de gauche à droite (découpe de 100 % à 0, montée de 14px, 1,1s, décalage de 0,18s, expo.out) ; l'en-tête, la phrase et les boutons sont visibles d'emblée.
- **Garde-fou:** si le navigateur suspend l'animation, le titre s'affiche d'office après 4s.
- **Pas d'effet sur les images:** les captures de démo n'apparaissent pas, ne se tracent pas et ne se révèlent pas (décision de l'utilisateur).
- **Transitions d'état:** 220ms ; courbe de sortie cubic-bezier(0.16, 1, 0.3, 1) pour ce qui se trace ou pivote (380ms).
- **Mouvements réduits:** aucune animation GSAP, transitions ramenées à 0,01ms, défilement instantané. Tout est visible : titre complet, ligne de cote de la méthode tracée.

## Do's and Don'ts

### Do:
- **Do** tracer la structure avec des filets d'un pixel (`filet` entre les lignes, `filet-fort` pour ouvrir une liste ou cadrer une image).
- **Do** réserver le bleu plein au bouton d'action principale, et utiliser `bleu` en trait de 1px pour tout le reste.
- **Do** écrire en Fragment Mono uniquement les mesures, numéros, colonnes et noms d'outils.
- **Do** afficher les prix en Schibsted Grotesk à chiffres tabulaires, sans retour à la ligne.
- **Do** ouvrir la page sur du texte utile (qui, quoi, à partir de quel prix), sans image de démonstration.
- **Do** réserver le mouvement au titre et à la ligne de la méthode, une seule fois, et livrer l'état final complet en mouvements réduits ou sans JavaScript.
- **Do** tenir les cibles à 44px minimum et le texte à 0.95rem minimum.

### Don't:
- **Don't** ajouter d'ombre, de lueur, de halo, de flou ou de `backdrop-filter` : la profondeur vient de l'ardoise et des filets.
- **Don't** introduire un deuxième accent ni un dégradé ; le dégradé violet vers turquoise du logo est un actif de marque et ne se propage pas.
- **Don't** animer l'apparition des captures de démo ni les placer en haut de page.
- **Don't** enfermer le contenu dans des cartes à fond et ombre ; listes et tableaux restent ouverts, bornés par des filets.
- **Don't** utiliser de caractères comme icônes (flèches, coches) : les marqueurs se dessinent au trait.
- **Don't** placer de surtitre au-dessus des titres de section.
