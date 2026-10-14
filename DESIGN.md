---
name: Studio Web
description: Portfolio de Baptiste Curie-Cadet, créateur de sites pour artisans et commerçants de Marseille. Monde « La lumière qui pousse ».
colors:
  nuit: "#07080d"
  sol: "#0c0e16"
  lilas: "#b57bff"
  cyan: "#3fe0d0"
  veine: "#9fffe9"
  eclosion: "#f4fffd"
  texte: "#d5d9ee"
  texte-doux: "#a3a9c8"
  texte-faible: "#868dae"
  filet: "rgba(181, 123, 255, 0.22)"
  filet-clair: "rgba(213, 217, 238, 0.14)"
  alerte: "#ffd27a"
typography:
  display:
    fontFamily: "Darker Grotesque, Arial Narrow, sans-serif"
    fontSize: "clamp(3.4rem, 8.6vw, 6rem)"
    fontWeight: 300
    lineHeight: 0.9
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Darker Grotesque, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 5.4vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  headline-project:
    fontFamily: "Darker Grotesque, Arial Narrow, sans-serif"
    fontSize: "clamp(2.4rem, 4vw, 3.4rem)"
    fontWeight: 500
    lineHeight: 0.95
  title:
    fontFamily: "Darker Grotesque, Arial Narrow, sans-serif"
    fontSize: "clamp(1.6rem, 2.4vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.05
  title-small:
    fontFamily: "Darker Grotesque, Arial Narrow, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 600
    lineHeight: 1.1
  price:
    fontFamily: "Darker Grotesque, Arial Narrow, sans-serif"
    fontSize: "2.1rem"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tnum"
  body:
    fontFamily: "Atkinson Hyperlegible, Verdana, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  body-lead:
    fontFamily: "Atkinson Hyperlegible, Verdana, sans-serif"
    fontSize: "clamp(1.0625rem, 1.4vw, 1.2rem)"
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
rounded:
  rayon: "6px"
  cadre: "10px"
  pilule: "999px"
spacing:
  largeur: "1200px"
  gouttiere: "clamp(20px, 5vw, 64px)"
  section: "clamp(88px, 12vw, 160px)"
  hauteur-entete: "76px"
  hauteur-entete-mobile: "64px"
components:
  button-bloom:
    backgroundColor: "{colors.eclosion}"
    textColor: "{colors.nuit}"
    typography: "{typography.label}"
    rounded: "{rounded.rayon}"
    padding: "0 26px"
    height: "52px"
  button-outline:
    backgroundColor: "rgba(63, 224, 208, 0.04)"
    textColor: "{colors.eclosion}"
    typography: "{typography.label}"
    rounded: "{rounded.rayon}"
    padding: "0 26px"
    height: "52px"
  button-outline-hover:
    backgroundColor: "rgba(63, 224, 208, 0.1)"
    textColor: "#ffffff"
  quote-cta:
    backgroundColor: "rgba(63, 224, 208, 0.04)"
    textColor: "{colors.eclosion}"
    typography: "{typography.label}"
    rounded: "{rounded.rayon}"
    padding: "0 18px"
    height: "46px"
  nav-link:
    textColor: "{colors.texte-doux}"
    typography: "{typography.label}"
    padding: "0 14px"
    height: "44px"
  nav-link-hover:
    textColor: "{colors.eclosion}"
  nav-cta:
    textColor: "{colors.eclosion}"
    typography: "{typography.label}"
    rounded: "{rounded.rayon}"
    padding: "0 18px"
    height: "44px"
  nav-cta-hover:
    backgroundColor: "rgba(159, 255, 233, 0.06)"
  text-link:
    textColor: "{colors.eclosion}"
    typography: "{typography.label}"
    height: "44px"
  quote-tag:
    textColor: "#d8bdff"
    rounded: "{rounded.pilule}"
    padding: "2px 12px"
  project-frame:
    backgroundColor: "{colors.sol}"
    rounded: "{rounded.cadre}"
  legal-panel:
    backgroundColor: "{colors.sol}"
    rounded: "{rounded.cadre}"
    padding: "clamp(24px, 4vw, 52px)"
  placeholder-warning:
    backgroundColor: "rgba(255, 210, 122, 0.07)"
    textColor: "{colors.alerte}"
    rounded: "{rounded.rayon}"
    padding: "16px 20px"
---

# Design System: Studio Web

## Overview

**Creative North Star: "La lumière qui pousse"**

« Faire rayonner votre activité » pris à la lettre. La page est une nuit profonde où pousse un réseau de racines lumineuses : une plante en canvas éclot dans l'introduction, une racine SVG longe la marge gauche de toute la page d'accueil, s'allonge au défilement et allume un nœud à chaque titre de section, puis rejoint une seconde plante au pied du contact. La lumière n'est jamais un décor posé sur des cartes : c'est la matière même du monde, et elle se dépose sur ce que le visiteur regarde (titre, projet survolé, ligne de tarif, étape de méthode).

La densité est aérée et éditoriale : de grands titres fins et hauts, des colonnes asymétriques 7/5, des listes séparées par des filets d'un pixel plutôt que des grilles de cartes égales. Le mouvement suit trois verbes : pousser (un tracé qui s'allonge), éclore (opacité et lueur qui montent, sortie expo), dériver (spores lentes). Tout est lisible sans JavaScript, sans GSAP et avec mouvements réduits.

Le monde refuse explicitement le portfolio sombre à dégradé fait de cartes de verre identiques.

**Key Characteristics:**
- Fond nuit unique, surfaces à peine plus claires, aucune ombre noire : la profondeur vient de la lumière.
- Deux lueurs du logo (lilas, cyan) et un vert pâle de veine pour tout ce qui est trait, nœud ou racine.
- Le seul aplat blanc du site est l'action principale « Écrire à Baptiste ».
- Titres Darker Grotesque fins et hauts ; texte Atkinson Hyperlegible.
- Filets d'un pixel, nœuds lumineux comme puces, pas d'empilement de cartes égales.
- Mouvement : pousser, éclore, dériver ; joué une fois ; mouvements réduits = image fixe, tout visible.

## Colors

Une nuit bleutée presque noire, deux lueurs saturées issues du logo et un vert d'eau pâle qui trace la vie du monde.

### Primary
- **Cyan de lueur** (cyan) : la lumière d'ambiance. Halo des boutons au survol, bord et fond des boutons secondaires, anneau de focus (2px, décalage 4px), curseur de saisie, lueur floue de la racine, halo autour des nœuds allumés et des spores.

### Secondary
- **Lilas du logo** (lilas) : la lueur rare. Sélection de texte, nœud de la ligne de tarif mise en avant, dégradé lilas vers cyan sous l'adresse e-mail du contact, halo derrière le portrait et dans la lueur des projets. Ses filets (filet, lilas à 22 %) structurent les tableaux et les cadres.

### Tertiary
- **Veine** (veine) : la couleur de tout ce qui pousse. Racine SVG, nœuds, brindilles et vrilles, puces-nœuds, petits traits des inclusions, soulignement qui pousse sous les liens de navigation, croix de la FAQ, message de copie, liens des pages légales. Toujours en trait, nœud ou texte court, jamais en grande surface.

### Neutral
- **Nuit** (nuit) : fond de toutes les pages, intérieur des nœuds éteints, texte du bouton principal.
- **Sol** (sol) : surfaces posées sur la nuit : fond des cadres de projet, bande des tarifs (dégradé vers sol à 86 %), panneau des pages légales.
- **Éclosion** (eclosion) : titres, textes forts, valeurs de prix, spores et bourgeons ; en aplat uniquement sur l'action principale.
- **Texte** (texte, 14:1 sur la nuit) : texte courant.
- **Texte doux** (texte-doux, 8:1) : chapôs, paragraphes de section, liens de navigation au repos.
- **Texte faible** (texte-faible, 5,6:1) : métadonnées, notes, unités, en-têtes de colonnes, légendes, chiffres d'étapes éteints.
- **Filet clair** (filet-clair) : séparateurs neutres (lignes de tarif, FAQ, pied de page, en-tête défilé).
- **Alerte** (alerte) : uniquement l'avertissement des champs à renseigner sur les pages légales.

### Named Rules
**The Éclosion Unique Rule.** L'éclosion n'est posée en aplat que sur l'action principale (bouton « Écrire à Baptiste », son équivalent « Me contacter » dans le menu mobile, et le lien d'évitement). Partout ailleurs elle n'est que couleur de texte ou de point lumineux.

**The Veine Rule.** La veine est réservée à ce qui pousse : traits, nœuds, vrilles et courts textes d'état. Elle ne remplit jamais une surface.

**The Glow Not Shadow Rule.** Toute lueur est colorée (cyan ou lilas, en rgba). Aucune ombre grise ou noire n'existe dans le système.

## Typography

**Display Font:** Darker Grotesque (avec Arial Narrow, sans-serif), graisses 300 à 700 chargées depuis Google Fonts
**Body Font:** Atkinson Hyperlegible (avec Verdana, sans-serif), 400 et 700, italique 400

**Character:** Un grotesque étroit et haut, très fin aux grandes tailles, qui se lit comme de la lumière filée ; en face, une linéale conçue pour la lisibilité qui porte les explications et les prix sans effort.

### Hierarchy
- **Display** (300, clamp(3.4rem, 8.6vw, 6rem), 0.9) : le seul titre d'accueil, largeur max 11.5em ; sur mobile clamp(3rem, 15vw, 4.25rem). Le titre du contact (300, clamp(3rem, 7vw, 5.5rem), 16ch) et celui des pages légales (300, clamp(3rem, 7vw, 5rem)) en sont des variantes.
- **Headline** (400, clamp(2.6rem, 5.4vw, 4.25rem), 0.98, -0.01em) : titres de section, chacun porteur d'un nœud de la racine.
- **Headline projet** (500, clamp(2.4rem, 4vw, 3.4rem), 0.95) : nom de chaque démo.
- **Title** (600, clamp(1.6rem, 2.4vw, 2rem), 1.05) : titres d'étapes et de groupes ; groupes de tarifs en 500, clamp(2rem, 3vw, 2.5rem).
- **Title small** (600, 1.45rem, 1.1) : nom d'une ligne de tarif.
- **Prix** (600, 2.1rem, 1, chiffres tabulaires) : montants du registre de tarifs.
- **Body** (400, 1.0625rem, 1.65) : texte courant ; colonnes limitées à 32rem en section, 62 à 72ch pour la lecture longue.
- **Body lead** (400, clamp(1.0625rem, 1.4vw, 1.2rem)) : chapôs de l'accueil et du contact.
- **Body small** (400, 0.95rem) : notes, unités, légendes, inclusions.
- **Label** (700, 1rem) : boutons, navigation, liens d'action, questions de FAQ (1.1rem, 1.35).

Deux usages d'affichage ponctuels de Darker Grotesque : la phrase d'introduction du portrait (400, clamp(1.8rem, 2.6vw, 2.25rem), 1.22) et l'adresse e-mail du contact (400, clamp(2.2rem, 6.4vw, 5rem)). Les chiffres d'étapes sont des compteurs CSS en 300, 4.5rem (3.75rem sur mobile).

### Named Rules
**The Thin Tall Rule.** Plus un titre est grand, plus il est fin : 300 pour l'affichage, 400 pour les sections, 500 à 600 seulement pour les titres de taille moyenne. Les titres sont équilibrés (text-wrap: balance), les paragraphes « pretty ».

**The Lit Word Rule.** Dans un titre, un seul mot peut s'allumer (« rayonner » : 600, blanc pur, halo cyan 14px). C'est la thèse de la page, pas un effet réutilisable sur chaque titre.

## Layout

Une colonne de contenu de 1200px maximum, gouttières fluides (clamp(20px, 5vw, 64px)) et sections rythmées par un grand espacement vertical (clamp(88px, 12vw, 160px) ; 1.1 fois au contact). L'en-tête collant mesure 76px (64px sous 760px) et le défilement d'ancre compense sa hauteur plus 16px.

La grille est asymétrique : en-têtes de section, projets et pied en 7/5 (texte large, paragraphe étroit), À propos en 5/7, FAQ en 4/8 avec titre collant. Les projets alternent l'image à gauche puis à droite. Le registre de tarifs est un tableau en trois colonnes (description, 11rem de prix, 12rem d'action). La méthode aligne quatre étapes sur une même tige horizontale. L'introduction occupe la hauteur de l'écran (moins l'en-tête, 960px au plus) et laisse le tiers droit à la plante.

La racine occupe la marge gauche de la colonne, environ 34px avant le texte ; sur mobile la colonne est décalée (34px à gauche) pour qu'elle court à 12px du bord.

Points de rupture :
- **1024px** : tarifs resserrés (9rem, auto), méthode sur deux colonnes sans tige, FAQ sur une colonne et titre non collant.
- **960px** : navigation repliée derrière un bouton de 48px (même seuil dans script.js) ; le menu ouvert est un panneau nuit pleine largeur, liens en Darker Grotesque 1.75rem séparés par des filets, action en aplat éclosion.
- **760px** : tout passe sur une colonne ; la plante d'accueil reçoit un emplacement réservé sous les boutons (min(80vw, 330px)), celle du contact 250px ; les lignes de tarif deviennent description puis prix et action, inclusions repliées dans un détail ; les étapes s'empilent sans nœud ; la vrille de « rayonner » disparaît ; les boutons du contact prennent toute la largeur.

## Elevation & Depth

Pas d'élévation par ombre portée. La profondeur est lumineuse : tout ce qui se soulève émet une lueur colorée, et le seul autre étagement est tonal (nuit, puis sol). L'en-tête devient nuit à 94 % avec un filet clair une fois la page défilée de 18px. Les plantes du canvas utilisent la composition additive (« lighter ») ; le bas du canvas d'accueil s'estompe par masque (noir à 80 % puis transparent) au lieu d'être coupé.

### Shadow Vocabulary
- **Éclosion du bouton** (`box-shadow: 0 10px 36px rgba(63, 224, 208, 0.38), 0 4px 18px rgba(181, 123, 255, 0.3)`) : survol du bouton principal, avec élévation de 2px ; à l'appui `0 4px 14px rgba(63, 224, 208, 0.3)`.
- **Lueur intérieure** (`box-shadow: inset 0 0 12px rgba(63, 224, 208, 0.08)`) : bouton secondaire au repos ; au survol `inset 0 0 16px rgba(63, 224, 208, 0.18), 0 6px 24px rgba(63, 224, 208, 0.22)`.
- **Halo du projet** (`box-shadow: 0 30px 80px -30px rgba(63, 224, 208, 0.45)`) : cadre de projet qui éclot.
- **Nœud allumé** (`box-shadow: 0 2px 12px rgba(63, 224, 208, 0.9)`) : puces et nœuds actifs ; version lilas `0 2px 14px rgba(181, 123, 255, 0.9)` pour la ligne mise en avant.

### Named Rules
**The Light Lifts Rule.** Un élément n'est jamais « posé » par une ombre ; il est allumé. Au repos les surfaces sont plates ; la lueur répond à un état (survol, éclosion, nœud atteint).

## Shapes

Des angles à peine adoucis pour les éléments d'action (6px), un peu plus pour les images et panneaux (10px), la pilule réservée à l'étiquette « Plus complet ». Tout le reste est trait et cercle : filets d'un pixel, nœuds circulaires de 7 à 11px, cercles de spores, courbes de Bézier de la racine aux extrémités arrondies. Les images de projet s'ouvrent depuis le centre par un découpage arrondi (inset 14 % vers 0, rayon 10px). Le halo du portrait est une ellipse floutée (30px) décalée derrière l'image.

### Named Rules
**The One Pixel Rule.** Toute séparation est un filet d'un pixel (filet ou filet-clair). Aucun bloc ne se délimite par un fond plein contrasté ni par une bordure épaisse.

## Components

### Buttons
Un aplat lumineux pour la seule action principale, un contour cyan pour tout le reste.
- **Shape :** coins à peine adoucis (6px), hauteur 52px, padding 0 26px, Atkinson 700 1rem.
- **Primary (éclosion) :** aplat éclosion, texte nuit. Survol : élévation de 2px et halo cyan et lilas ; appui : retour à 0 et halo réduit. Transitions couleur 240ms, ombre et transformation 400ms en sortie douce.
- **Secondary (contour) :** bord cyan à 60 %, fond cyan à 4 %, lueur intérieure. Survol et focus : bord cyan plein, fond à 10 %, texte blanc, lueur extérieure.
- **Quote CTA :** même traitement que le contour, 46px de haut, padding 0 18px, aligné à droite dans sa ligne.
- **Text link :** texte éclosion en 700, soulignement d'un pixel cyan à 60 % décalé de 6px ; au survol le soulignement devient cyan plein et descend à 9px. Cible minimale 44px.

### Chips
- **Style :** une seule étiquette (« Plus complet ») : pilule, bord lilas à 60 %, texte lilas clair, Atkinson 700 0.875rem, accrochée au titre de la ligne de tarif.

### Cards / Containers
- **Cadre de projet :** coins 10px, fond sol, filet lilas d'un pixel, image carrée (715/718). Survol ou centrage tactile : bord veine à 50 %, halo du projet, image agrandie à 1.025, et une lueur radiale (420px, lilas vers cyan, fusion « screen ») qui suit le pointeur.
- **Panneau légal :** coins 10px, fond sol, filet clair, padding clamp(24px, 4vw, 52px), 50rem de large au plus. Seul conteneur à fond plein du système, réservé aux pages légales.
- **Avertissement :** coins 6px, fond alerte à 7 %, bord alerte à 50 %, texte alerte 700.

### Inputs / Fields
Aucun champ de saisie : le contact se fait par e-mail (liens mailto pré-remplis et bouton de copie de l'adresse, dont le statut s'affiche en veine 700).

### Navigation
- **Bureau :** logo 36px à gauche ; liens Atkinson 700 en texte doux, padding 0 14px, 44px de haut. Au survol le texte passe en éclosion et un filet veine d'un pixel pousse de gauche à droite sous le lien (420ms). « Me contacter » est cerné d'un filet veine à 45 % (6px) qui s'intensifie au survol.
- **En-tête :** transparent au sommet, nuit à 94 % et filet clair après 18px de défilement.
- **Mobile (sous 960px) :** bouton de 48px à deux traits qui se croisent à l'ouverture ; panneau nuit en pleine largeur, liens Darker Grotesque 500 1.75rem de 56px séparés par des filets clairs ; « Me contacter » en aplat éclosion pleine largeur.

### Racine lumineuse (signature)
Un tracé SVG d'1.4px en veine (opacité 0.85) doublé d'une lueur cyan de 7px floutée à 5px. Il part du pied de la plante d'accueil, descend dans la marge gauche, passe par un nœud à hauteur de la première ligne de chaque titre de section, puis tourne à l'horizontale vers le pied de la plante du contact. Sa pointe suit le défilement aux trois quarts de l'écran (quickTo 0.6s, power3.out). Chaque nœud atteint s'allume : point rempli d'éclosion avec halo cyan, trois vrilles qui poussent (1400ms, décalées de 160 et 320ms), deux bourgeons qui éclosent après 900ms. Des spores immobiles scintillent (5s, aller-retour) dans les marges des réalisations, de la méthode et du contact. Sur mobile, nœuds plus petits (3.5px) et sans vrilles.

### Plante lumineuse (signature)
Canvas génératif à graine fixe (même forme à chaque visite) : réseau de racines horizontales, tiges effilées cyan puis lilas, ombrelles translucides à nervures, lamelles et bord perlé qui respire, spores qui montent. Le pointeur ravive la lueur des ombrelles et écarte les spores. Croissance en 2.6s (accueil, au chargement) et 2.4s (contact, à l'entrée dans l'écran), power2.inOut. La boucle ne tourne que lorsque la plante est visible.

### Registre de tarifs
Tableau à filets : en-têtes de colonnes en texte faible 700, groupes séparés par un filet lilas, lignes par un filet clair. Chaque ligne porte un nœud de 7px dans la marge gauche, qui s'allume en veine au survol ; la ligne mise en avant a son nœud lilas allumé en permanence. Les inclusions sont listées sur deux colonnes, chacune précédée d'un trait veine de 7px.

### Étapes de méthode
Quatre étapes sur une tige d'un pixel (filet lilas vers veine vers filet lilas). Chaque étape a son grand chiffre Darker Grotesque 300 en texte faible et un nœud de 11px sur la tige ; quand la racine passe, le chiffre devient éclosion avec halo cyan et le nœud s'allume (800ms).

### Motion
- **Pousser :** tracés révélés par stroke-dashoffset (racine, vrilles, vrille de « rayonner » en 1.4s).
- **Éclore :** opacité et lueur, sortie expo.out ; projets ouverts depuis le centre (inset 14 %, luminosité 0.35 et flou 6px vers net, 1.5s), puis leur texte (décalé de 0.08s, back.out(1.3)).
- **Dériver :** spores lentes, portrait qui flotte de 36px contre le défilement.
- **Titre :** écrit ligne à ligne une seule fois (clip-path de gauche à droite, 1.2s, décalage 0.22s), « rayonner » s'allume à 1.15s. Chapô, boutons et promesses posés avec un léger dépassement (back.out(1.4)). Un garde-fou termine l'introduction après 4.5s.
- **Mouvements réduits :** transitions et animations ramenées à 0.01ms, défilement non animé, plantes dessinées adultes en image fixe, racine entièrement tracée, tous les nœuds et étapes allumés. Sans GSAP, tout est affiché et la racine suit seulement le défilement.

## Do's and Don'ts

### Do:
- **Do** garder la nuit (nuit) comme unique fond et sol (sol) comme seule surface posée dessus.
- **Do** réserver l'aplat éclosion à l'action principale, une fois par zone d'action.
- **Do** séparer par des filets d'un pixel (filet, filet-clair) et marquer les listes par des nœuds circulaires de 7px en veine.
- **Do** colorer chaque lueur en cyan ou lilas rgba, et la déclencher par un état (survol, nœud atteint, éclosion).
- **Do** donner un nœud de racine à tout nouveau titre de section de l'accueil (attribut data-node).
- **Do** écrire les grands titres en Darker Grotesque fin (300 à 400) et le texte en Atkinson Hyperlegible, avec des cibles d'au moins 44px.
- **Do** garantir que tout est visible sans JavaScript et avec mouvements réduits : image fixe, nœuds allumés.

### Don't:
- **Don't** empiler des cartes égales ni des panneaux de verre : le monde refuse le portfolio sombre à dégradé fait de cartes identiques.
- **Don't** utiliser d'ombre grise ou noire, ni d'ombre décalée dure.
- **Don't** remplir une surface en veine ou en lilas.
- **Don't** utiliser de pictogrammes en caractères (flèches, coches, étoiles) : les marques se dessinent en traits et cercles.
- **Don't** ajouter de surtitre ou d'étiquette au-dessus des titres de section.
- **Don't** rejouer l'écriture du titre ou l'éclosion d'un bloc : chaque entrée se joue une seule fois.
