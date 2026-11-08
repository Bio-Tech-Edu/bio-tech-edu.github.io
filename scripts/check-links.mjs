// Verifica links/arquivos locais, imagens do catálogo/blog e IDs exigidos pelos scripts.
// Uso: node scripts/check-links.mjs   (retorna código 1 se encontrar problemas)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const problemas = [];
const existe = (p) => fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, "index.html")));

const paginas = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
for (const obrig of ["index.html", "blog.html", "404.html", "privacidade.html", "termos.html"]) {
  if (!fs.existsSync(path.join(ROOT, obrig))) problemas.push(`página obrigatória ausente: ${obrig} (rode o build)`);
}
const blogDir = path.join(ROOT, "blog");
if (fs.existsSync(blogDir)) fs.readdirSync(blogDir).filter((f) => f.endsWith(".html")).forEach((f) => paginas.push(`blog/${f}`));
const recursosDir = path.join(ROOT, "recursos");
if (fs.existsSync(recursosDir)) fs.readdirSync(recursosDir).filter((f) => f.endsWith(".html")).forEach((f) => paginas.push(`recursos/${f}`));
const lpDir = path.join(ROOT, "lp");
if (fs.existsSync(lpDir)) fs.readdirSync(lpDir).filter((f) => f.endsWith(".html")).forEach((f) => paginas.push(`lp/${f}`));

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

// Toda página deve ter exatamente um h1 (título principal para leitores de tela e para a hierarquia).
for (const rel of paginas) {
  const n = (fs.readFileSync(path.join(ROOT, rel), "utf8").match(/<h1[\s>]/g) || []).length;
  if (n !== 1) problemas.push(`${rel}: tem ${n} h1 (deve ter exatamente um).`);
}

// Formulários: o envio precisa ir a um serviço https. Nenhuma página pode trazer marcador não preenchido.
for (const rel of paginas) {
  const html = fs.readFileSync(path.join(ROOT, rel), "utf8");
  for (const m of html.matchAll(/<form[^>]*action="([^"]*)"/g)) {
    if (!/^https:\/\//.test(m[1])) problemas.push(`${rel}: formulário com envio que não é https (${m[1]}).`);
  }
  if (html.includes("[[")) problemas.push(`${rel}: contém marcador não preenchido ([[...]]). Preencha a landing de origem em landings/.`);
}

// O hero da página inicial só pode existir em index.html (as demais páginas são geradas sem ele).
for (const rel of paginas.filter((p) => p !== "index.html")) {
  if (fs.readFileSync(path.join(ROOT, rel), "utf8").includes('class="hero-copy"')) problemas.push(`${rel}: contém o hero da página inicial (ele deve sair no build).`);
}

const exigeImagens = (arquivo, campos) => {
  const f = path.join(ROOT, arquivo);
  if (!fs.existsSync(f)) return problemas.push(`${arquivo}: arquivo ausente`);
  for (const item of JSON.parse(fs.readFileSync(f, "utf8"))) {
    for (const c of campos) if (item[c] && !fs.existsSync(path.join(ROOT, item[c]))) problemas.push(`${arquivo}: imagem não encontrada → ${item[c]} (${item.title})`);
  }
};
exigeImagens("data/projects.json", ["screenshot"]);

// Todo produto do catálogo com "slug" precisa de landing page gerada (o botão do card aponta para ela)
const projetosPath = path.join(ROOT, "data/projects.json");
if (fs.existsSync(projetosPath)) {
  for (const p of JSON.parse(fs.readFileSync(projetosPath, "utf8"))) {
    if (p.slug && !fs.existsSync(path.join(ROOT, "recursos", `${p.slug}.html`))) {
      problemas.push(`data/projects.json: o produto "${p.title}" (slug ${p.slug}) não tem landing page em recursos/. Crie landings/${p.slug}.md e rode o build.`);
    }
  }
}
exigeImagens("blog/posts.json", ["cover"]);

// Toda publicação listada em posts.json precisa ter sua página HTML (pega "build que não gerou")
const pj = path.join(ROOT, "blog/posts.json");
if (fs.existsSync(pj)) {
  for (const p of JSON.parse(fs.readFileSync(pj, "utf8"))) {
    if (!fs.existsSync(path.join(ROOT, p.url))) problemas.push(`blog/posts.json: a publicação "${p.slug}" não tem página (${p.url}). Rode o build.`);
  }
}

// Avisos (não bloqueiam): imagens acima de 500 KB
const pesadas = [];
(function varrer(dir) {
  for (const e of fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : []) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "brand") varrer(p); continue; }
    if (/\.(png|jpe?g|webp)$/i.test(e.name) && fs.statSync(p).size > 500 * 1024 && e.name !== "hero.png") pesadas.push(`${path.relative(ROOT, p)} (${Math.round(fs.statSync(p).size / 1024)} KB)`);
  }
})(path.join(ROOT, "assets"));
if (pesadas.length) console.warn("⚠ imagens acima de 500 KB (converta para WebP):\n  - " + pesadas.join("\n  - "));

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
