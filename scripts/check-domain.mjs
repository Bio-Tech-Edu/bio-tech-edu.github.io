// Garante que o domínio do site está consistente em todo o repositório.
// Fonte única: arquivo CNAME. Uso: node scripts/check-domain.mjs (código 1 se houver inconsistência)
import fs from "node:fs";
import path from "node:path";
import { ROOT, DOMINIO, SITE } from "./lib/site.mjs";

const erros = [];
const ANTIGO = /https?:\/\/bio-tech-edu\.github\.io/;
const cname = fs.existsSync(path.join(ROOT, "CNAME")) ? fs.readFileSync(path.join(ROOT, "CNAME"), "utf8") : null;
if (cname === null) erros.push("falta o arquivo CNAME na raiz (sem ele o GitHub Pages perde o domínio personalizado a cada publicação).");
else if (cname.trim().split(/\s+/).length !== 1) erros.push("CNAME deve ter uma única linha, só com o domínio.");

// A origem antiga não pode aparecer em nenhum arquivo de texto, exceto se o CNAME ainda for o domínio antigo.
if (DOMINIO !== "bio-tech-edu.github.io") {
  (function varrer(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if ([".git", "node_modules"].includes(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { varrer(p); continue; }
      if (!/\.(html|xml|txt|md|json|yml|yaml|mjs|js|css)$/.test(e.name) || e.name === "package-lock.json") continue;
      const m = fs.readFileSync(p, "utf8").match(ANTIGO);
      if (m) erros.push(`${path.relative(ROOT, p)}: ainda usa o endereço antigo (${m[0]}). Troque por ${SITE}.`);
    }
  })(ROOT);
}

const le = (f) => (fs.existsSync(path.join(ROOT, f)) ? fs.readFileSync(path.join(ROOT, f), "utf8") : "");
if (!le("index.html").includes(`<link rel="canonical" href="${SITE}/"`)) erros.push(`index.html: o canonical deve ser ${SITE}/`);
if (!le("blog.html").includes(`<link rel="canonical" href="${SITE}/blog.html"`)) erros.push(`blog.html: o canonical deve ser ${SITE}/blog.html (rode o build).`);
if (!le("robots.txt").includes(`Sitemap: ${SITE}/sitemap.xml`)) erros.push(`robots.txt: a linha Sitemap deve ser ${SITE}/sitemap.xml (rode o build).`);
if (!le("sitemap.xml").includes(`<loc>${SITE}/</loc>`)) erros.push(`sitemap.xml: a primeira URL deve ser ${SITE}/ (rode o build).`);

if (erros.length) {
  console.error(`✖ domínio: ${erros.length} inconsistência(s):\n` + erros.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(`✔ domínio: ${DOMINIO} consistente (CNAME, canonical, sitemap, robots e páginas geradas).`);
