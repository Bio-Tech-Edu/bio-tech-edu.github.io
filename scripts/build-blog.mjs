// Converte posts/*.md em páginas HTML, blog/posts.json, blog/feed.xml e blog.html.
// Uso: npm ci && node scripts/build-blog.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = path.join(ROOT, "posts");
const OUT_DIR = path.join(ROOT, "blog");
const SITE = "https://bio-tech-edu.github.io";
const AUTOR_PADRAO = "Pâmella Araújo Balcaçar";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const slugify = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const toList = (v) => (Array.isArray(v) ? v : typeof v === "string" ? v.split(",") : []).map((x) => String(x).trim()).filter(Boolean);
const isoDate = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? "").slice(0, 10));
const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });

marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens);
      const id = slugify(inner.replace(/<[^>]+>/g, ""));
      return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
    },
  },
});

const THEME_SCRIPT = `<script>try{var t=localStorage.getItem("theme");if(!t)t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}</script>`;
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />`;

// Cabeçalho e rodapé vêm do index.html (fonte única) e têm os caminhos ajustados.
const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const grab = (re, nome) => {
  const m = indexHtml.match(re);
  if (!m) { console.error(`index.html: não encontrei ${nome}`); process.exit(1); }
  return m[0];
};
const HEADER = grab(/<header class="site-header">[\s\S]*?<\/header>/, "<header>");
const FOOTER = grab(/<footer class="site-footer">[\s\S]*?<\/footer>/, "<footer>");
function fragment(html, depth) {
  if (depth === 0) {
    return html.replace(/href="#/g, 'href="index.html#').replace('<a href="blog.html">Blog</a>', '<a href="blog.html" aria-current="page">Blog</a>');
  }
  return html.replace(/href="#/g, 'href="../index.html#').replace(/(href|src)="(?!https?:|mailto:|\.\.\/|#)/g, '$1="../');
}

// ---------- leitura dos posts ----------
const files = fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_")) : [];
const posts = [];
const slugs = new Set();
let erro = false;
for (const f of files) {
  const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, f), "utf8"));
  if (data.rascunho === true) continue;
  const date = isoDate(data.date);
  if (!data.title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.warn(`⚠ ${f}: faltam "title" e/ou "date" (AAAA-MM-DD). Arquivo ignorado.`);
    continue;
  }
  const slug = slugify(data.slug || f.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, ""));
  if (slugs.has(slug)) { console.error(`✖ ${f}: slug repetido "${slug}".`); erro = true; continue; }
  slugs.add(slug);
  const plain = content.replace(/```[\s\S]*?```/g, " ").replace(/[#>*_`\[\]()!|-]/g, " ").replace(/\s+/g, " ").trim();
  posts.push({
    slug,
    title: String(data.title),
    date,
    summary: String(data.summary || plain.slice(0, 160).trim() + "…"),
    area: String(data.area || "Geral"),
    atuacao: String(data.atuacao || "Geral"),
    tags: toList(data.tags),
    destaque: data.destaque === true ? 1 : Number(data.destaque) || 0,
    cover: data.cover ? String(data.cover) : "",
    coverAlt: String(data.cover_alt || ""),
    autoria: String(data.autoria || AUTOR_PADRAO),
    readingTime: Math.max(1, Math.round(plain.split(" ").filter(Boolean).length / 200)),
    url: `blog/${slug}.html`,
    _html: marked.parse(content).replace(/src="assets\//g, 'src="../assets/'),
  });
}
if (erro) process.exit(1);
posts.sort((a, b) => b.date.localeCompare(a.date));

// ---------- saída ----------
fs.mkdirSync(OUT_DIR, { recursive: true });
for (const f of fs.readdirSync(OUT_DIR)) {
  if (f.endsWith(".html") || f === "posts.json" || f === "feed.xml") fs.unlinkSync(path.join(OUT_DIR, f));
}

function postPage(p) {
  const cover = p.cover ? `<figure class="post-cover-fig"><img src="../${esc(p.cover)}" alt="${esc(p.coverAlt)}" /></figure>` : "";
  const tags = p.tags.map((t) => `<a href="../blog.html?tag=${encodeURIComponent(t)}">#${esc(t)}</a>`).join("");
  const wa = `https://wa.me/?text=${encodeURIComponent(`${p.title} — ${SITE}/${p.url}`)}`;
  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(p.title)} | Blog Bio+Tech EduDesign</title>
    <meta name="description" content="${esc(p.summary)}" />
    <meta name="theme-color" content="#071b30" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${esc(p.title)}" />
    <meta property="og:description" content="${esc(p.summary)}" />
    <meta property="og:image" content="${SITE}/${esc(p.cover || "assets/hero.png")}" />
    <link rel="canonical" href="${SITE}/${p.url}" />
    <link rel="alternate" type="application/rss+xml" title="Blog Bio+Tech EduDesign" href="feed.xml" />
    <link rel="icon" type="image/png" href="../assets/favicon.png" />
    ${THEME_SCRIPT}
    ${FONTS}
    <link rel="stylesheet" href="../assets/styles.css" />
  </head>
  <body>
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div class="bg-orb orb-one"></div>
    <div class="bg-orb orb-two"></div>
    ${fragment(HEADER, 1)}
    <main id="conteudo">
      <article class="container post">
        <nav class="crumbs" aria-label="Você está em"><a href="../blog.html">Blog</a> / <a href="../blog.html?area=${encodeURIComponent(p.area)}">${esc(p.area)}</a></nav>
        <span class="project-tag">${esc(p.area)}</span>
        <h1>${esc(p.title)}</h1>
        <p class="meta">${esc(fmtDate(p.date))} · ${p.readingTime} min de leitura · ${esc(p.autoria)} · Atuação: ${esc(p.atuacao)}</p>
        ${cover}
        <div class="prose">
${p._html}
        </div>
        <footer class="post-foot">
          <div class="post-tags" aria-label="Tags">${tags}</div>
          <p><a class="btn secondary" href="${wa}" target="_blank" rel="noopener noreferrer">Compartilhar no WhatsApp</a> <a class="btn secondary" href="../blog.html">Voltar ao blog</a></p>
        </footer>
      </article>
    </main>
    ${fragment(FOOTER, 1)}
    <script src="../assets/theme.js"></script>
  </body>
</html>
`;
}

for (const p of posts) fs.writeFileSync(path.join(OUT_DIR, `${p.slug}.html`), postPage(p));

const publico = posts.map(({ _html, ...rest }) => rest);
fs.writeFileSync(path.join(OUT_DIR, "posts.json"), JSON.stringify(publico, null, 2) + "\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Blog Bio+Tech EduDesign</title><link>${SITE}/blog.html</link>
<description>Ciência, tecnologia e design educacional.</description><language>pt-BR</language>
${posts.slice(0, 20).map((p) => `<item><title>${esc(p.title)}</title><link>${SITE}/${p.url}</link><guid>${SITE}/${p.url}</guid><pubDate>${new Date(p.date + "T12:00:00Z").toUTCString()}</pubDate><description>${esc(p.summary)}</description></item>`).join("\n")}
</channel></rss>
`;
fs.writeFileSync(path.join(OUT_DIR, "feed.xml"), rss);

const tpl = fs.readFileSync(path.join(ROOT, "scripts", "blog.template.html"), "utf8");
fs.writeFileSync(
  path.join(ROOT, "blog.html"),
  tpl.replace("<!--THEME-->", THEME_SCRIPT).replace("<!--HEADER-->", fragment(HEADER, 0)).replace("<!--FOOTER-->", fragment(FOOTER, 0)),
);

console.log(`✔ ${posts.length} publicação(ões) gerada(s) em blog/ e blog.html atualizado.`);
