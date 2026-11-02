// Verifica links/arquivos locais, imagens do catálogo/blog e IDs exigidos pelos scripts.
// Uso: node scripts/check-links.mjs   (retorna código 1 se encontrar problemas)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const problemas = [];
const existe = (p) => fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, "index.html")));

const paginas = ["index.html", "blog.html", "404.html"].filter((f) => fs.existsSync(path.join(ROOT, f)));
const blogDir = path.join(ROOT, "blog");
if (fs.existsSync(blogDir)) fs.readdirSync(blogDir).filter((f) => f.endsWith(".html")).forEach((f) => paginas.push(`blog/${f}`));

for (const rel of paginas) {
  const html = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const base = path.dirname(path.join(ROOT, rel));
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/.test(url)) continue;
    const limpo = decodeURIComponent(url.split("#")[0].split("?")[0]);
    if (!limpo) continue;
    const alvo = limpo.startsWith("/") ? path.join(ROOT, limpo) : path.resolve(base, limpo);
    if (!existe(alvo)) problemas.push(`${rel}: arquivo não encontrado → ${url}`);
  }
}

const exigeImagens = (arquivo, campos) => {
  const f = path.join(ROOT, arquivo);
  if (!fs.existsSync(f)) return problemas.push(`${arquivo}: arquivo ausente`);
  for (const item of JSON.parse(fs.readFileSync(f, "utf8"))) {
    for (const c of campos) if (item[c] && !fs.existsSync(path.join(ROOT, item[c]))) problemas.push(`${arquivo}: imagem não encontrada → ${item[c]} (${item.title})`);
  }
};
exigeImagens("data/projects.json", ["screenshot"]);
exigeImagens("blog/posts.json", ["cover"]);

// IDs que os scripts consultam diretamente (evita erro silencioso em tempo de execução)
const IDS = {
  "blog.html": ["carousel", "carousel-slides", "carousel-dots", "carousel-prev", "carousel-next", "carousel-count", "post-list", "post-search", "active-filters", "result-count", "load-more", "facet-area", "facet-atuacao", "tag-cloud"],
  "index.html": ["project-grid"],
};
for (const [arq, ids] of Object.entries(IDS)) {
  const html = fs.readFileSync(path.join(ROOT, arq), "utf8");
  for (const id of ids) if (!html.includes(`id="${id}"`)) problemas.push(`${arq}: falta o elemento id="${id}" exigido pelos scripts`);
}

if (problemas.length) {
  console.error(`✖ ${problemas.length} problema(s):\n` + problemas.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
console.log(`✔ ${paginas.length} páginas verificadas: links, imagens e IDs ok.`);
