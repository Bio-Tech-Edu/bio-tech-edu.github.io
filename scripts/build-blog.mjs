// Converte posts/*.md em páginas HTML e gera: blog/*.html, blog/posts.json, blog/feed.xml,
// blog.html, 404.html e sitemap.xml.   Uso: npm ci && node scripts/build-blog.mjs
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

// ---------- utilitários ----------
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const slugify = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const toList = (v) => (Array.isArray(v) ? v : typeof v === "string" ? v.split(",") : []).map((x) => String(x).trim()).filter(Boolean);
const isoDate = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? "").slice(0, 10));
const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
const MESES = ["jan.", "fev.", "mar.", "abr.", "maio", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];
const abntDate = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${d} ${MESES[m - 1]} ${y}`; };
const abntAuthor = (name) => { const t = name.trim().split(/\s+/); if (t.length < 2) return name.toUpperCase(); const last = t.pop().toUpperCase(); return `${last}, ${t.join(" ")}`; };
const jsonLd = (o) => JSON.stringify(o).replace(/</g, "\\u003c");

// ---------- markdown (com sumário) ----------
let toc = [];
let seenIds = new Map();
marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens);
      const text = inner.replace(/<[^>]+>/g, "");
      let id = slugify(text) || "secao";
      const n = seenIds.get(id) || 0;
      seenIds.set(id, n + 1);
      if (n) id = `${id}-${n + 1}`;
      if (depth === 2 || depth === 3) toc.push({ depth, text, id });
      return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
    },
  },
});

const THEME_SCRIPT = `<script>try{var t=localStorage.getItem("theme");if(!t)t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}</script>`;
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />`;

// Cabeçalho e rodapé vêm do index.html (fonte única); os caminhos são ajustados por contexto.
const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const grab = (re, nome) => {
  const m = indexHtml.match(re);
  if (!m) { console.error(`index.html: não encontrei ${nome}`); process.exit(1); }
  return m[0];
};
const HEADER = grab(/<header class="site-header">[\s\S]*?<\/header>/, "<header>");
const FOOTER = grab(/<footer class="site-footer">[\s\S]*?<\/footer>/, "<footer>");
// mode: 0 = raiz (blog.html) · 1 = pasta blog/ · "abs" = caminhos absolutos (404.html)
function fragment(html, mode) {
  if (mode === 0) return html.replace(/href="#/g, 'href="index.html#').replace('<a href="blog.html">Blog</a>', '<a href="blog.html" aria-current="page">Blog</a>');
  if (mode === 1) return html.replace(/href="#/g, 'href="../index.html#').replace(/(href|src)="(?!https?:|mailto:|\.\.\/|#)/g, '$1="../');
  return html.replace(/href="#/g, 'href="/index.html#').replace(/(href|src)="(?!https?:|mailto:|\/|#)/g, '$1="/');
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
  toc = []; seenIds = new Map();
  const html = marked.parse(content).replace(/src="assets\//g, 'src="../assets/');
  const atualizado = data.atualizado ? isoDate(data.atualizado) : "";
  posts.push({
    slug,
    title: String(data.title),
    date,
    atualizado: /^\d{4}-\d{2}-\d{2}$/.test(atualizado) ? atualizado : "",
    summary: String(data.summary || plain.slice(0, 160).trim() + "…"),
    area: String(data.area || "Geral"),
    atuacao: String(data.atuacao || "Geral"),
    formato: String(data.formato || "Artigo"),
    publico: toList(data.publico),
    habilidades: toList(data.habilidades),
    tags: toList(data.tags),
    destaque: data.destaque === true ? 1 : Number(data.destaque) || 0,
    cover: data.cover ? String(data.cover) : "",
    coverAlt: String(data.cover_alt || ""),
    autoria: String(data.autoria || AUTOR_PADRAO),
    comentarios: data.comentarios !== false,
    readingTime: Math.max(1, Math.round(plain.split(" ").filter(Boolean).length / 200)),
    url: `blog/${slug}.html`,
    _html: html,
    _toc: toc,
  });
}
if (erro) process.exit(1);
posts.sort((a, b) => b.date.localeCompare(a.date));

// ---------- saída ----------
fs.mkdirSync(OUT_DIR, { recursive: true });
for (const f of fs.readdirSync(OUT_DIR)) {
  if (f.endsWith(".html") || f === "posts.json" || f === "feed.xml") fs.unlinkSync(path.join(OUT_DIR, f));
}

function related(p) {
  const score = (q) => 3 * q.tags.filter((t) => p.tags.includes(t)).length + 2 * (q.area === p.area) + (q.atuacao === p.atuacao) + (q.formato === p.formato);
  return posts.filter((q) => q.slug !== p.slug).map((q) => ({ q, s: score(q) })).sort((a, b) => b.s - a.s || b.q.date.localeCompare(a.q.date)).slice(0, 3).map((x) => x.q);
}
const miniCard = (q) => `<article class="post-card"><div class="post-card-body"><div class="card-tags"><span class="project-tag">${esc(q.area)}</span><span class="format-tag">${esc(q.formato)}</span></div><h3><a href="${q.slug}.html">${esc(q.title)}</a></h3><p>${esc(q.summary)}</p></div></article>`;

function postPage(p, i) {
  const url = `${SITE}/${p.url}`;
  const cover = p.cover ? `<figure class="post-cover-fig"><img src="../${esc(p.cover)}" alt="${esc(p.coverAlt)}" /></figure>` : "";
  const tags = p.tags.map((t) => `<a href="../blog.html?tag=${encodeURIComponent(t)}">#${esc(t)}</a>`).join("");
  const wa = `https://wa.me/?text=${encodeURIComponent(`${p.title} — ${url}`)}`;
  const tocHtml = p._toc.length >= 3
    ? `<details class="toc" open><summary>Neste texto</summary><ol>${p._toc.map((t) => `<li${t.depth === 3 ? ' class="sub"' : ""}><a href="#${t.id}">${esc(t.text)}</a></li>`).join("")}</ol></details>`
    : "";
  const skills = p.habilidades.length
    ? `<div class="post-aside"><span class="skill-label">Habilidades trabalhadas</span><div class="skill-list inline">${p.habilidades.map((h) => `<span class="skill-chip bncc">${esc(h)}</span>`).join("")}</div></div>`
    : "";
  const meta = [fmtDate(p.date) + (p.atualizado ? ` (atualizado em ${fmtDate(p.atualizado)})` : ""), `${p.readingTime} min de leitura`, p.autoria, `Atuação: ${p.atuacao}`, p.publico.length ? `Para: ${p.publico.join(", ")}` : ""].filter(Boolean).map(esc).join(" · ");
  const title = p.title + (/[.?!]$/.test(p.title) ? "" : ".");
  const cite = `<aside class="cite" aria-labelledby="h-cite"><h2 id="h-cite">Como citar</h2><p id="cite-text">${esc(abntAuthor(p.autoria))}. ${esc(title)} <strong>Bio+Tech EduDesign</strong>, ${abntDate(p.date)}. Disponível em: ${url}. Acesso em: <span data-acesso>[data de acesso]</span>.</p><button class="btn secondary" id="copy-cite" type="button">Copiar citação</button> <span id="cite-status" role="status"></span></aside>`;
  const comments = p.comentarios
    ? `<section id="comentarios" class="comments" aria-labelledby="h-coment" data-slug="${esc(p.slug)}" data-url="${url}" data-title="${esc(p.title)}"><h2 id="h-coment">Comentários</h2><p id="comments-status" class="comments-status" role="status">Verificando configuração dos comentários…</p><button id="load-comments" class="btn secondary" type="button" hidden>Carregar comentários</button><div id="comments-embed"></div><noscript><p>Ative o JavaScript para ver e enviar comentários.</p></noscript></section>`
    : "";
  const rel = related(p);
  const relHtml = rel.length ? `<section class="related" aria-labelledby="h-rel"><h2 id="h-rel">Continue lendo</h2><div class="post-list">${rel.map(miniCard).join("")}</div></section>` : "";
  const newer = posts[i - 1], older = posts[i + 1];
  const nav = newer || older
    ? `<nav class="post-nav" aria-label="Navegação entre publicações">${older ? `<a class="prev" href="${older.slug}.html"><small>← Publicação anterior</small><span>${esc(older.title)}</span></a>` : "<span></span>"}${newer ? `<a class="next" href="${newer.slug}.html"><small>Próxima publicação →</small><span>${esc(newer.title)}</span></a>` : "<span></span>"}</nav>`
    : "";
  const ld = jsonLd({
    "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.summary, inLanguage: "pt-BR",
    datePublished: p.date, dateModified: p.atualizado || p.date, mainEntityOfPage: url, articleSection: p.area, keywords: p.tags.join(", "),
    image: `${SITE}/${p.cover || "assets/img/hero.png"}`, author: { "@type": "Person", name: p.autoria },
    publisher: { "@type": "Organization", name: "Bio+Tech EduDesign", logo: { "@type": "ImageObject", url: `${SITE}/assets/img/favicon.png` } },
  });
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
    <meta property="og:image" content="${SITE}/${esc(p.cover || "assets/img/hero.png")}" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" type="application/rss+xml" title="Blog Bio+Tech EduDesign" href="feed.xml" />
    <link rel="icon" type="image/png" href="../assets/img/favicon.png" />
    <script type="application/ld+json">${ld}</script>
    ${THEME_SCRIPT}
    ${FONTS}
    <link rel="stylesheet" href="../assets/css/styles.css" />
    <link rel="stylesheet" href="../assets/css/blog.css" />
  </head>
  <body>
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div class="bg-orb orb-one"></div>
    <div class="bg-orb orb-two"></div>
    ${fragment(HEADER, 1)}
    <main id="conteudo">
      <article class="container post">
        <nav class="crumbs" aria-label="Você está em"><a href="../blog.html">Blog</a> / <a href="../blog.html?area=${encodeURIComponent(p.area)}">${esc(p.area)}</a></nav>
        <div class="card-tags"><span class="project-tag">${esc(p.area)}</span><span class="format-tag">${esc(p.formato)}</span></div>
        <h1>${esc(p.title)}</h1>
        <p class="meta">${meta}</p>
        ${cover}
        ${skills}
        ${tocHtml}
        <div class="prose">
${p._html}
        </div>
        <footer class="post-foot">
          <div class="post-tags" aria-label="Tags">${tags}</div>
          <p><a class="btn secondary" href="${wa}" target="_blank" rel="noopener noreferrer">Compartilhar no WhatsApp</a> <a class="btn secondary" href="../blog.html">Voltar ao blog</a></p>
        </footer>
        ${cite}
        ${comments}
        ${relHtml}
        ${nav}
      </article>
    </main>
    ${fragment(FOOTER, 1)}
    <script src="../assets/js/lib.js"></script>
    <script src="../assets/js/theme.js"></script>
    <script src="../assets/js/post.js"></script>
    <script src="../assets/js/comments.js"></script>
  </body>
</html>
`;
}

posts.forEach((p, i) => fs.writeFileSync(path.join(OUT_DIR, `${p.slug}.html`), postPage(p, i)));

const publico = posts.map(({ _html, _toc, ...rest }) => rest);
fs.writeFileSync(path.join(OUT_DIR, "posts.json"), JSON.stringify(publico, null, 2) + "\n");

fs.writeFileSync(path.join(OUT_DIR, "feed.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Blog Bio+Tech EduDesign</title><link>${SITE}/blog.html</link>
<description>Ciência, tecnologia e design educacional.</description><language>pt-BR</language>
${posts.slice(0, 20).map((p) => `<item><title>${esc(p.title)}</title><link>${SITE}/${p.url}</link><guid>${SITE}/${p.url}</guid><pubDate>${new Date(p.date + "T12:00:00Z").toUTCString()}</pubDate><description>${esc(p.summary)}</description></item>`).join("\n")}
</channel></rss>
`);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${SITE}/</loc></url>
<url><loc>${SITE}/blog.html</loc><lastmod>${posts[0]?.date ?? today}</lastmod></url>
${posts.map((p) => `<url><loc>${SITE}/${p.url}</loc><lastmod>${p.atualizado || p.date}</lastmod></url>`).join("\n")}
</urlset>
`);

const tpl = fs.readFileSync(path.join(ROOT, "scripts", "blog.template.html"), "utf8");
fs.writeFileSync(path.join(ROOT, "blog.html"), tpl.replace("<!--THEME-->", THEME_SCRIPT).replace("<!--HEADER-->", fragment(HEADER, 0)).replace("<!--FOOTER-->", fragment(FOOTER, 0)));

fs.writeFileSync(path.join(ROOT, "404.html"), `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Página não encontrada | Bio+Tech EduDesign</title>
    <meta name="robots" content="noindex" />
    <meta name="theme-color" content="#071b30" />
    <link rel="icon" type="image/png" href="/assets/img/favicon.png" />
    ${THEME_SCRIPT}
    ${FONTS}
    <link rel="stylesheet" href="/assets/css/styles.css" />
    <link rel="stylesheet" href="/assets/css/blog.css" />
  </head>
  <body>
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    ${fragment(HEADER, "abs")}
    <main id="conteudo" class="container notfound">
      <span class="eyebrow">Erro 404</span>
      <h1>Página não encontrada</h1>
      <p>O endereço pode ter mudado ou a publicação foi removida.</p>
      <p><a class="btn primary" href="/index.html">Ir para o início</a> <a class="btn secondary" href="/blog.html">Ver o blog</a></p>
    </main>
    ${fragment(FOOTER, "abs")}
    <script src="/assets/js/lib.js"></script>
    <script src="/assets/js/theme.js"></script>
  </body>
</html>
`);

console.log(`✔ ${posts.length} publicação(ões) gerada(s); blog.html, 404.html e sitemap.xml atualizados.`);
