// Vérifications automatiques du site Studio Web (Node.js 18+, sans dépendance).
// Usage, depuis la racine du dépôt : node outils/verifier-site.mjs
// Le script s'arrête avec le code 1 si une vérification échoue.

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(join(root, file), "utf8");
const pages = readdirSync(root).filter((file) => file.endsWith(".html"));

let failures = 0;
const check = (ok, message) => {
  console.log(`${ok ? "OK  " : "ÉCHEC"} ${message}`);
  if (!ok) failures += 1;
};

// Attributs d'une balise, sous forme d'objet.
const attributes = (tag) => Object.fromEntries(
  [...tag.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].slice(1).map(([, name, value = ""]) => [name, value]),
);

for (const page of pages) {
  const html = read(page);

  // 1. Liens et ressources locales : le fichier existe.
  const references = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map(([, url]) => url)
    .concat([...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap(([, set]) => set.split(",").map((part) => part.trim().split(/\s+/)[0])));
  const missing = references
    .filter((url) => !/^(https?:|mailto:|tel:|#|data:)/.test(url))
    .map((url) => url.split(/[?#]/)[0])
    .filter((path) => path && path !== "/")
    .filter((path) => !existsSync(join(root, path.replace(/^\//, ""))));
  check(missing.length === 0, `${page} : ressources locales présentes${missing.length ? ` (manquantes : ${[...new Set(missing)].join(", ")})` : ""}`);

  // 2. Ancres internes : chaque lien #id pointe vers un identifiant de la page.
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id));
  const broken = [...html.matchAll(/\shref="#([^"]+)"/g)].map(([, id]) => id).filter((id) => !ids.has(id));
  check(broken.length === 0, `${page} : ancres internes valides${broken.length ? ` (cassées : ${broken.join(", ")})` : ""}`);

  // 3. Images : texte alternatif et dimensions (évite les décalages de mise en page).
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => attributes(tag));
  check(images.every((image) => "alt" in image), `${page} : toutes les images ont un attribut alt`);
  check(images.every((image) => image.width && image.height), `${page} : toutes les images ont une largeur et une hauteur`);

  // 4. Titres : un seul h1, sans saut de niveau.
  const levels = [...html.matchAll(/<h([1-6])\b/g)].map(([, level]) => Number(level));
  const skips = levels.filter((level, index) => index > 0 && level > levels[index - 1] + 1);
  check(levels.filter((level) => level === 1).length === 1, `${page} : un seul titre h1`);
  check(skips.length === 0, `${page} : hiérarchie des titres sans saut`);

  // 5. Langue et titre de page.
  check(/<html lang="fr">/.test(html) && /<title>[^<]{10,}<\/title>/.test(html), `${page} : langue et titre définis`);
}

// 6. Page d'accueil : contenu commercial intact.
const index = read("index.html");
const quoteLabels = [...index.matchAll(/class="quote-cta" aria-label="([^"]+)"/g)].map(([, label]) => label);
check(quoteLabels.length === 12 && new Set(quoteLabels).size === 12, "index.html : 12 lignes de tarif avec un libellé accessible distinct");
check((index.match(/href="mailto:/g) || []).length >= 14, "index.html : liens e-mail pré-remplis présents");
for (const anchor of ["services", "offre", "realisations", "methode", "apropos", "faq", "contact"]) {
  check(index.includes(`id="${anchor}"`), `index.html : ancre #${anchor} conservée`);
}

// 7. Données structurées : JSON valide et adresse e-mail cohérente.
const jsonLd = index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
let structured = null;
try { structured = jsonLd && JSON.parse(jsonLd[1]); } catch { structured = null; }
check(Boolean(structured) && structured.email === "bcuriecadet@gmail.com", "index.html : données structurées valides");

// 8. CSS : toute variable utilisée est définie.
const css = read("style.css");
const defined = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(([, name]) => name));
const undefinedVars = [...new Set([...css.matchAll(/var\((--[\w-]+)/g)].map(([, name]) => name))].filter((name) => !defined.has(name));
check(undefinedVars.length === 0, `style.css : variables définies${undefinedVars.length ? ` (inconnues : ${undefinedVars.join(", ")})` : ""}`);

// 9. Scripts : syntaxe valide.
for (const script of ["script.js", "animations.js", "outils/verifier-site.mjs"]) {
  try {
    execFileSync(process.execPath, ["--check", join(root, script)], { stdio: "pipe" });
    check(true, `${script} : syntaxe valide`);
  } catch (error) {
    check(false, `${script} : ${error.stderr?.toString().trim()}`);
  }
}

// 10. En-têtes de sécurité déclarés pour Cloudflare Pages.
const headers = existsSync(join(root, "_headers")) ? read("_headers") : "";
check(/Content-Security-Policy:/.test(headers) && /X-Content-Type-Options: nosniff/.test(headers), "_headers : politique de sécurité déclarée");

// 11. Aucun secret ni fichier de travail publié.
const tracked = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean);
check(!tracked.some((file) => file.startsWith(".impeccable/") || file.startsWith(".claude/") || /(^|\/)\.env/.test(file)),
  "dépôt : aucun fichier de travail ni fichier .env versionné");
const secretPattern = /(sk_live_|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY|api[_-]?key\s*[:=]\s*["'][^"']{12,})/i;
// Ce script contient le motif recherché : il est exclu de sa propre analyse.
const leaks = tracked.filter((file) => /\.(html|js|mjs|css|json|txt|md|xml)$/.test(file) && file !== "outils/verifier-site.mjs")
  .filter((file) => existsSync(join(root, file)) && secretPattern.test(read(file)));
check(leaks.length === 0, `dépôt : aucun secret apparent${leaks.length ? ` (${leaks.join(", ")})` : ""}`);

console.log(failures ? `\n${failures} vérification(s) en échec.` : "\nToutes les vérifications sont passées.");
process.exit(failures ? 1 : 0);
