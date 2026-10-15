STUDIO WEB — GUIDE DU PROJET
============================

Site statique (HTML, CSS, JavaScript), sans étape de build.
Publié par Cloudflare Pages à chaque fusion sur la branche master :
https://freelance-web-932.pages.dev/

Attention : Cloudflare Pages publie TOUT le contenu du dépôt.
Ne versionnez jamais de fichier de travail, de mot de passe ni de clé.


FICHIERS
--------
index.html              Page d'accueil (services, réalisations, tarifs,
                        méthode, à propos, FAQ, contact)
style.css               Styles de tout le site Studio Web
script.js               Menu mobile, copie de l'adresse e-mail, FAQ,
                        retour en haut, détails des tarifs sur mobile
animations.js           Animations (GSAP et ScrollTrigger, chargés depuis
                        cdnjs) et comparateurs plan / site
mentions-legales.html   Mentions légales (à compléter, voir plus bas)
confidentialite.html    Politique de confidentialité
404.html                Page « introuvable », servie par Cloudflare Pages
_headers                En-têtes de sécurité et de cache (Cloudflare Pages)
robots.txt, sitemap.xml Référencement
images/                 Images du site et des démos (dont les schémas SVG de la plomberie)
fonts/                  Toutes les polices du site, hébergées localement (aucun appel
                        à Google Fonts) ; licences SIL OFL dans fonts/OFL-*.txt

demo-plomberie.html, services.html, contact.html, plomberie.css, plomberie.js
                        Démo fictive « Dupont Plomberie » (menu mobile et
                        formulaire de démonstration qui n'envoie rien)
demo-restaurant.html, restaurant.css, restaurant.js
                        Démo fictive « Maison Olive » (une seule page)

PRODUCT.md              Ce que fait le site, pour qui, et ce qu'il ne doit
                        jamais affirmer
DESIGN.md               Système visuel (couleurs, polices, composants,
                        animations)
outils/verifier-site.mjs
                        Vérifications automatiques (voir plus bas)


VOIR LE SITE EN LOCAL
---------------------
À la racine du projet :

    python -m http.server 8080

puis ouvrir http://localhost:8080 dans le navigateur.
(Ouvrir index.html par un double-clic fonctionne aussi, mais certains
navigateurs limitent alors les scripts.)


VÉRIFIER AVANT DE PUBLIER
-------------------------
    node outils/verifier-site.mjs

Le script contrôle les liens et les ancres, les textes alternatifs et les
dimensions des images, la hiérarchie des titres, les libellés des tarifs,
les données structurées, les variables CSS, la syntaxe des scripts, les
en-têtes de sécurité et l'absence de secrets dans le dépôt.
Il doit afficher « Toutes les vérifications sont passées. »


MODIFIER LE SITE
----------------
- Après une modification de style.css, script.js ou animations.js,
  augmenter le numéro « ?v= » qui les appelle dans les pages HTML,
  sinon les visiteurs gardent l'ancienne version en cache.
- Les prix sont indicatifs : le devis écrit fait foi.
- Les démos doivent rester présentées comme fictives.
- Ne jamais afficher de client, d'avis, de chiffre ou de compétence
  qui ne soit pas réel.


PUBLIER
-------
1. Créer une branche, faire les modifications, lancer la vérification.
2. Pousser la branche et ouvrir une Pull Request sur GitHub.
3. Cloudflare publie un aperçu de la branche : le vérifier.
4. Fusionner la Pull Request : le site est mis en ligne.


À COMPLÉTER PAR L'ÉDITEUR
-------------------------
- Mentions légales : statut juridique, adresse et numéro SIRET
  (les trois champs « [À RENSEIGNER] » de mentions-legales.html).
- Confidentialité : mettre la notice à jour si un service est ajouté
  (formulaire, mesure d'audience, cookies…), avec la date en bas de page.
- Ces modèles ne remplacent pas un conseil juridique et ne réalisent
  aucune démarche administrative.
