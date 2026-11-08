// Valida a configuração de comentários (blog/config.json) e se assets/js/comments.js lê apenas chaves que existem.
// Uso: node scripts/check-comments.mjs   (código 1 se houver erro; avisos não bloqueiam)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SHORTNAME = /^[a-z0-9][a-z0-9-]{0,49}$/i;
const erros = [];
const avisos = [];

const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "blog/config.json"), "utf8"));
const c = cfg.comentarios || {};
const provedor = c.provedor || "";

if (!["", "disqus", "giscus"].includes(provedor)) erros.push(`comentarios.provedor "${provedor}" desconhecido. Use "disqus", "giscus" ou "" (desligado).`);
if (provedor === "disqus" && !SHORTNAME.test(String(c.disqus?.shortname || ""))) {
  erros.push(`comentarios.disqus.shortname inválido ou vazio ("${c.disqus?.shortname ?? ""}"). Use o identificador exibido no painel do Disqus (letras, números e hífen).`);
}
if (provedor === "giscus") {
  for (const k of ["repo", "repoId", "categoryId"]) if (!c.giscus?.[k]) erros.push(`comentarios.giscus.${k} está vazio.`);
}
if (!provedor) avisos.push('comentários desligados (provedor ""): as publicações mostram a mensagem "em breve".');

// Formato aceito de blog/config.json → comentarios. Chaves fora deste formato são erro (ex.: "shortName" com N maiúsculo).
const FORMATO = { disqus: ["shortname"], giscus: ["repo", "repoId", "category", "categoryId"] };
for (const [bloco, chaves] of Object.entries(FORMATO)) {
  for (const k of Object.keys(c[bloco] || {})) {
    if (!chaves.includes(k)) erros.push(`blog/config.json: comentarios.${bloco}.${k} não é uma chave válida (use: ${chaves.join(", ")}).`);
  }
}

// Cada chave lida por comments.js (d.<chave> para Disqus, g.<chave> para Giscus) precisa estar no formato acima.
const js = fs.readFileSync(path.join(ROOT, "assets/js/comments.js"), "utf8");
const lidas = { disqus: new Set([...js.matchAll(/\bd\.(\w+)/g)].map((m) => m[1])), giscus: new Set([...js.matchAll(/\bg\.(\w+)/g)].map((m) => m[1])) };
for (const [bloco, chaves] of Object.entries(lidas)) {
  for (const k of chaves) {
    if (!FORMATO[bloco].includes(k)) erros.push(`assets/js/comments.js lê ${bloco}.${k}, que não existe no formato de blog/config.json (chaves válidas: ${FORMATO[bloco].join(", ")}).`);
  }
}

for (const a of avisos) console.warn(`⚠ ${a}`);
if (erros.length) {
  console.error(`✖ comentários: ${erros.length} erro(s):\n` + erros.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(`✔ comentários: provedor "${provedor || "desligado"}" configurado e chaves do script conferidas.`);
