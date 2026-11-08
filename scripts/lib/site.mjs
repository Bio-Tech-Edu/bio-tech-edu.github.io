// Utilitários compartilhados pelos geradores do site (blog, páginas institucionais e landing pages).
// Fonte única de: escape/slug/datas, renderização de markdown com sumário, tema, cabeçalho e rodapé.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const SITE = "https://bio-tech-edu.github.io";
export const AUTOR_PADRAO = "Pâmella Araújo Balcaçar";

export const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export const slugify = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
export const toList = (v) => (Array.isArray(v) ? v : typeof v === "string" ? v.split(",") : []).map((x) => String(x).trim()).filter(Boolean);
export const isoDate = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? "").slice(0, 10));
export const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
export const MESES = ["jan.", "fev.", "mar.", "abr.", "maio", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];
export const abntDate = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${d} ${MESES[m - 1]} ${y}`; };
export const abntAuthor = (name) => { const t = name.trim().split(/\s+/); if (t.length < 2) return name.toUpperCase(); const last = t.pop().toUpperCase(); return `${last}, ${t.join(" ")}`; };
export const jsonLd = (o) => JSON.stringify(o).replace(/</g, "\\u003c");

// ---------- markdown (com sumário) ----------
// Markdown → HTML com id nos títulos e sumário (títulos ## e ###).
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

export function renderMarkdown(src) {
  toc = [];
  seenIds = new Map();
  const html = marked.parse(src);
  return { html, toc };
}

export const THEME_SCRIPT = `<script>try{var t=localStorage.getItem("theme");if(!t)t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}</script>`;
export const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />`;

// Cabeçalho e rodapé vêm do index.html (fonte única); os caminhos são ajustados por contexto.
const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const grab = (re, nome) => {
  const m = indexHtml.match(re);
  if (!m) { console.error(`index.html: não encontrei ${nome}`); process.exit(1); }
  return m[0];
};
// O <header> do index.html traz a barra de navegação e, no fim, o hero da página inicial.
// O hero sai do cabeçalho compartilhado: não aparece no blog, nas publicações, nas páginas
// institucionais nem no 404. O index.html não é alterado e o blog mantém o próprio bloco (blog-hero).
const HEADER_INDEX = grab(/<header class="site-header">[\s\S]*?<\/header>/, "<header>");
export const HEADER = HEADER_INDEX.replace(
  /\s*<div class="container hero"[\s\S]*?(?=<\/header>)/,
  '\n      <!-- Hero da página inicial removido nas páginas geradas. Para alterá-lo, edite index.html. -->\n    ',
);
if (/class="container hero"|class="hero-copy"/.test(HEADER)) {
  console.error("✖ o hero da página inicial ainda está no cabeçalho compartilhado. Confira a remoção em scripts/build-blog.mjs.");
  process.exit(1);
}
export const FOOTER = grab(/<footer class="site-footer">[\s\S]*?<\/footer>/, "<footer>");
// mode: 0 = raiz (blog.html) · 1 = pasta blog/ · "abs" = caminhos absolutos (404.html)
export function fragment(html, mode) {
  if (mode === 0) return html.replace(/href="#/g, 'href="index.html#').replace('<a href="blog.html">Blog</a>', '<a href="blog.html" aria-current="page">Blog</a>');
  if (mode === 1) return html.replace(/href="#/g, 'href="../index.html#').replace(/(href|src)="(?!https?:|mailto:|\.\.\/|#)/g, '$1="../');
  return html.replace(/href="#/g, 'href="/index.html#').replace(/(href|src)="(?!https?:|mailto:|\/|#)/g, '$1="/');
}

