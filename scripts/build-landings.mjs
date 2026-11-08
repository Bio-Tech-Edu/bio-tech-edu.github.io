// Converte landings/*.md em páginas HTML:
//   recursos/<slug>.html → produtos do catálogo (padrão: catalogo: true)
//   lp/<slug>.html       → landing pages avulsas, fora do catálogo (catalogo: false), como propostas e kits gratuitos
// Modos: gratuito e venda (produtos do catálogo); proposta e captura (formulário para contato).
// Uso: node scripts/build-landings.mjs   (código 1 se algum texto tiver erro; os demais são gerados)
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ROOT, SITE, esc, toList, renderMarkdown, THEME_SCRIPT, FONTS, HEADER, FOOTER, fragment, jsonLd } from "./lib/site.mjs";

const LANDINGS_DIR = path.join(ROOT, "landings");
const DIRS = { recursos: path.join(ROOT, "recursos"), lp: path.join(ROOT, "lp") };
const PROJETOS = JSON.parse(fs.readFileSync(path.join(ROOT, "data/projects.json"), "utf8"));
const TIPOS = { OAD: "objeto de aprendizagem digital", REA: "recurso educacional aberto", RED: "recurso educacional digital" };
const MODOS = ["gratuito", "venda", "proposta", "captura"];
const BLOCOS = ["cards", "passos", "depoimentos", "lista", "texto", "formulario"];
const SLUG = /^[a-z0-9][a-z0-9-]*$/;
const CAMPO = /^[a-z][a-z0-9_]*$/;
const https = (u) => /^https:\/\/\S+$/.test(String(u || ""));
const MARCADOR = /\[\[[^\]]*\]\]/;
const noActions = process.env.GITHUB_ACTIONS === "true";
const CONSENTIMENTO_PADRAO = "Concordo que meus dados sejam usados para o contato sobre esta solicitação, conforme a política de privacidade do site.";
const CAMPOS_PROPOSTA = [
  { nome: "nome", rotulo: "Nome completo", tipo: "text", autocomplete: "name" },
  { nome: "email", rotulo: "E-mail institucional", tipo: "email", autocomplete: "email" },
  { nome: "whatsapp", rotulo: "WhatsApp", tipo: "tel", autocomplete: "tel", obrigatorio: false },
  { nome: "funcao", rotulo: "Cargo ou função", tipo: "select", opcoes: ["Gestor(a)", "Coordenador(a)", "Professor(a)", "Especialista em AEE", "Técnico(a) administrativo(a)", "Estagiário(a) ou licenciando(a)", "Outro"] },
  { nome: "instituicao", rotulo: "Tipo de instituição", tipo: "select", opcoes: ["Pública", "Privada", "Rede de ensino"] },
  { nome: "alunos", rotulo: "Número de alunos da instituição", tipo: "number", obrigatorio: false },
];
const CAMPOS_CAPTURA = [
  { nome: "nome", rotulo: "Nome completo", tipo: "text", autocomplete: "name" },
  { nome: "email", rotulo: "E-mail (de preferência institucional)", tipo: "email", autocomplete: "email" },
  { nome: "funcao", rotulo: "Sua função na educação", tipo: "select", opcoes: ["Professor(a)", "Gestor(a)", "Coordenador(a)", "Especialista em AEE", "Técnico(a) administrativo(a)", "Estagiário(a) ou licenciando(a)", "Outro"] },
];

const problemas = [];
function avisar(nivel, file, msg) {
  problemas.push({ nivel, file, msg });
  if (noActions) console.log(`::${nivel === "erro" ? "error" : "warning"} file=landings/${file}::${msg}`);
  else console.error(`${nivel === "erro" ? "✖" : "⚠"} landings/${file} — ${msg}`);
}

// ---------- validação ----------
function validarFormulario(f, modo, file) {
  const erro = (m) => { avisar("erro", file, m); return null; };
  if (!f.endpoint) return erro(`modo ${modo} precisa de "formulario.endpoint" (link https do serviço que recebe os dados).`);
  if (!https(f.endpoint)) return erro('"formulario.endpoint" deve começar com https://');
  const campos = Array.isArray(f.campos) && f.campos.length ? f.campos : (modo === "proposta" ? CAMPOS_PROPOSTA : CAMPOS_CAPTURA);
  for (const c of campos) {
    if (!c || !CAMPO.test(String(c.nome || ""))) return erro(`campo de formulário com nome inválido: "${c?.nome ?? ""}" (use minúsculas, números e _).`);
    if (!c.rotulo) return erro(`campo "${c.nome}" sem "rotulo".`);
    if (c.tipo === "select" && !(Array.isArray(c.opcoes) && c.opcoes.length)) return erro(`campo select "${c.nome}" precisa de "opcoes".`);
    if (c.tipo && !["text", "email", "tel", "number", "select"].includes(c.tipo)) return erro(`campo "${c.nome}": tipo "${c.tipo}" desconhecido.`);
  }
  let arquivo = "";
  if (modo === "captura") {
    arquivo = String(f.arquivo || "");
    if (!arquivo) return erro('modo captura precisa de "formulario.arquivo" (o material gratuito, dentro de assets/).');
    if (!fs.existsSync(path.join(ROOT, arquivo))) return erro(`arquivo do material não encontrado: ${arquivo}. Coloque o arquivo no repositório antes de publicar.`);
  }
  if (f.redirecionar && !https(f.redirecionar)) return erro('"formulario.redirecionar" deve começar com https://');
  return {
    titulo: String(f.titulo || ""),
    endpoint: String(f.endpoint),
    botao: String(f.botao || (modo === "captura" ? "Baixar material gratuito" : "Solicitar proposta")),
    campos,
    consentimento: String(f.consentimento || CONSENTIMENTO_PADRAO),
    comunicacoes: f.comunicacoes === undefined ? "Quero receber novidades e materiais por e-mail." : String(f.comunicacoes),
    redirecionar: arquivo ? `${SITE}/${arquivo}` : String(f.redirecionar || ""),
    arquivo,
  };
}

function validarBlocos(lista, modo, file) {
  if (lista === undefined) return [];
  const erro = (m) => { avisar("erro", file, m); return null; };
  if (!Array.isArray(lista)) return erro('"blocos" deve ser uma lista.');
  for (const b of lista) {
    if (!b || !BLOCOS.includes(b.tipo)) return erro(`bloco com tipo desconhecido: "${b?.tipo ?? ""}". Use ${BLOCOS.join(", ")}.`);
    if (b.tipo === "formulario" && !["proposta", "captura"].includes(modo)) return erro('o bloco "formulario" só existe nos modos proposta e captura.');
    if (["cards", "passos", "lista", "depoimentos"].includes(b.tipo)) {
      if (!Array.isArray(b.itens) || !b.itens.length) return erro(`bloco "${b.tipo}" precisa de uma lista "itens".`);
    }
    if (["cards", "passos"].includes(b.tipo)) {
      for (const i of b.itens) if (!i || !i.titulo) return erro(`cada item do bloco "${b.tipo}" precisa de "titulo".`);
    }
    if (b.tipo === "depoimentos") {
      for (const d of b.itens) {
        if (!d || !d.nome || !d.texto) return erro('cada depoimento precisa de "nome" e "texto".');
        if (d.autorizacao !== true) return erro(`depoimento de "${d.nome}" sem "autorizacao: true". Publique só depoimentos autorizados por escrito.`);
      }
    }
    if (b.tipo === "texto" && !b.texto) return erro('bloco "texto" precisa do campo "texto".');
  }
  return lista;
}

function lerLanding(file) {
  const bruto = fs.readFileSync(path.join(LANDINGS_DIR, file), "utf8");
  let data, content;
  try { ({ data, content } = matter(bruto)); }
  catch (e) { avisar("erro", file, `cabeçalho inválido: ${e.reason || e.message}`); return null; }
  const erro = (m) => { avisar("erro", file, m); return null; };
  const marcador = bruto.match(MARCADOR);
  if (marcador) return erro(`marcador não preenchido: ${marcador[0]}. Substitua pelo texto real (ou apague o campo) antes de publicar.`);

  const nome = file.replace(/\.md$/, "");
  const slug = String(data.slug || "");
  if (!slug) return erro('falta o campo "slug".');
  if (!SLUG.test(slug)) return erro(`slug "${slug}" inválido: use minúsculas, números e hífen.`);
  if (slug !== nome) return erro(`o slug "${slug}" deve ser igual ao nome do arquivo ("${nome}").`);
  const catalogo = data.catalogo !== false;
  const produto = catalogo ? PROJETOS.find((p) => p.slug === slug) : null;
  if (catalogo && !produto) return erro(`nenhum produto com slug "${slug}" em data/projects.json. Adicione o produto ao catálogo ou use "catalogo: false".`);
  const modo = String(data.modo || (catalogo ? "gratuito" : ""));
  if (!MODOS.includes(modo)) return erro(`modo "${modo}" desconhecido. Use ${MODOS.join(", ")}.`);
  if (!catalogo && ["gratuito", "venda"].includes(modo)) return erro(`modo ${modo} só existe para produtos do catálogo. Use "proposta" ou "captura" em páginas avulsas.`);
  if (data.formulario && !["proposta", "captura"].includes(modo)) return erro(`o campo "formulario" só existe nos modos proposta e captura (modo atual: ${modo}).`);
  const title = String(data.title || (produto ? produto.title : ""));
  if (!title) return erro('falta o campo "title".');
  if (!data.resumo) return erro('falta o campo "resumo".');
  const tipo = String(data.tipo || (produto ? produto.type : ""));
  if (tipo && !TIPOS[tipo]) return erro(`tipo "${tipo}" desconhecido. Use OAD, REA ou RED.`);
  const cabecalho = String(data.cabecalho || "padrao");
  if (!["padrao", "simples"].includes(cabecalho)) return erro('"cabecalho" deve ser "padrao" ou "simples".');

  if (modo === "gratuito") {
    if (!data.acesso && !data.repositorio) return erro('modo gratuito precisa de "acesso" ou "repositorio".');
    for (const k of ["acesso", "repositorio"]) if (data[k] && !https(data[k])) return erro(`"${k}" deve começar com https://`);
  }
  if (modo === "venda") {
    for (const k of ["preco", "checkout", "vendedor", "vendedor_contato"]) if (!data[k]) return erro(`modo venda precisa do campo "${k}".`);
    if (!https(data.checkout)) return erro('"checkout" deve começar com https://');
    const dias = data.arrependimento_dias === undefined ? 7 : Number(data.arrependimento_dias);
    if (!Number.isFinite(dias) || dias < 7) return erro('"arrependimento_dias" deve ser 7 ou mais em compras online (art. 49 do CDC).');
    data._dias = dias;
  }
  if (modo === "proposta" || modo === "captura") {
    for (const k of ["vendedor", "vendedor_contato"]) if (!data[k]) return erro(`modo ${modo} precisa do campo "${k}" (quem responde pela oferta).`);
  }
  let formulario = null;
  if (modo === "proposta" || modo === "captura") {
    formulario = validarFormulario(data.formulario || {}, modo, file);
    if (!formulario) return null;
  } else if (data.formulario) {
    return erro(`o campo "formulario" só existe nos modos proposta e captura (modo atual: ${modo}).`);
  }
  const blocos = validarBlocos(data.blocos, modo, file);
  if (blocos === null) return null;
  if (blocos.some((b) => b.tipo === "formulario") && !formulario) return erro('o bloco "formulario" precisa de configuração em "formulario".');
  if (data.faq !== undefined) {
    if (!Array.isArray(data.faq)) return erro('"faq" deve ser uma lista.');
    for (const item of data.faq) if (!item || !item.pergunta || !item.resposta) return erro('cada item de "faq" precisa de "pergunta" e "resposta".');
  }
  if (data.cta_final && (!data.cta_final.titulo || !data.cta_final.botao)) return erro('"cta_final" precisa de "titulo" e "botao".');

  const imagem = data.imagem ? String(data.imagem) : (produto ? produto.screenshot : "");
  if (imagem && !fs.existsSync(path.join(ROOT, imagem))) return erro(`imagem não encontrada: ${imagem}`);
  if (imagem && !data.imagem_alt) avisar("aviso", file, 'falta "imagem_alt". Descreva a imagem para leitores de tela.');
  if (catalogo && !data.licenca) avisar("aviso", file, 'falta "licenca". Confirme a licença do recurso antes de publicar.');
  if (!content.trim() && !blocos.length) avisar("aviso", file, "a página não tem texto nem blocos.");
  return { slug, nome, data, content, catalogo, modo, tipo, title, produto, imagem, cabecalho, formulario, blocos, dir: catalogo ? "recursos" : "lp" };
}

// ---------- montagem ----------
const itemFicha = (rotulo, valor) => (valor ? `<div class="ficha-item"><dt>${esc(rotulo)}</dt><dd>${valor}</dd></div>` : "");
const renderCards = (itens) => `<ul class="lp-cards">${itens.map((i) => `<li class="lp-card">${i.icone ? `<span class="lp-icon" aria-hidden="true">${esc(i.icone)}</span>` : ""}<h3>${esc(i.titulo)}</h3>${i.texto ? `<p>${esc(i.texto)}</p>` : ""}</li>`).join("")}</ul>`;
const renderPassos = (itens) => `<ol class="lp-passos">${itens.map((i) => `<li><h3>${esc(i.titulo)}</h3>${i.texto ? `<p>${esc(i.texto)}</p>` : ""}</li>`).join("")}</ol>`;
const renderLista = (itens) => `<ul class="lp-lista">${itens.map((i) => `<li>${esc(typeof i === "string" ? i : i.titulo)}</li>`).join("")}</ul>`;
const renderDepoimentos = (itens) => `<div class="lp-depo">${itens.map((d) => `<figure class="lp-depo-item"><blockquote><p>${esc(d.texto)}</p></blockquote><figcaption><strong>${esc(d.nome)}</strong>${d.cargo ? `, ${esc(d.cargo)}` : ""}</figcaption></figure>`).join("")}</div>`;

function formHtml(F, L) {
  const campos = F.campos.map((c) => {
    const id = `campo-${c.nome}`;
    const obrig = c.obrigatorio !== false;
    const attrs = `name="${c.nome}" id="${id}"${obrig ? ' required aria-required="true"' : ""}${c.autocomplete ? ` autocomplete="${esc(c.autocomplete)}"` : ""}`;
    const control = c.tipo === "select"
      ? `<select ${attrs}><option value="">Selecione</option>${c.opcoes.map((o) => `<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select>`
      : `<input type="${esc(c.tipo || "text")}" ${attrs}${c.tipo === "number" ? ' min="1"' : ""} />`;
    return `<div class="lp-field"><label for="${id}">${esc(c.rotulo)}${obrig ? ' <span class="lp-obrig">(obrigatório)</span>' : ""}</label>${control}</div>`;
  }).join("");
  const titulo = F.titulo ? `<h2 id="formulario-titulo">${esc(F.titulo)}</h2>` : "";
  return `<div class="lp-form-card" id="formulario">
            <form class="lp-form" action="${esc(F.endpoint)}" method="post"${F.titulo ? ' aria-labelledby="formulario-titulo"' : ""}>
              ${titulo}
              <input type="hidden" name="_subject" value="${esc(L.title)}" />
              <input type="hidden" name="origem" value="${esc(L.slug)}" />
              ${F.redirecionar ? `<input type="hidden" name="_next" value="${esc(F.redirecionar)}" />` : ""}
              <div class="hp-field" aria-hidden="true"><label for="campo-_gotcha">Deixe este campo vazio</label><input type="text" name="_gotcha" id="campo-_gotcha" tabindex="-1" autocomplete="off" /></div>
              ${campos}
              <div class="lp-check"><input type="checkbox" id="consentimento" name="consentimento" value="sim" required aria-required="true" /><label for="consentimento">${esc(F.consentimento)} <a href="../privacidade.html">Ler a política de privacidade</a></label></div>
              ${F.comunicacoes ? `<div class="lp-check"><input type="checkbox" id="comunicacoes" name="comunicacoes" value="sim" /><label for="comunicacoes">${esc(F.comunicacoes)}</label></div>` : ""}
              <button class="btn primary" type="submit">${esc(F.botao)}</button>
            </form>
          </div>`;
}

function landingPage(L) {
  const { slug, data, content, catalogo, modo, tipo, produto, imagem, formulario: F, blocos, cabecalho } = L;
  const url = `${SITE}/${L.dir}/${slug}.html`;
  const venda = modo === "venda";
  const proposta = modo === "proposta" || modo === "captura";
  const acesso = modo === "gratuito" && data.acesso ? String(data.acesso) : "";
  const repo = data.repositorio ? String(data.repositorio) : "";
  const ctaExterno = `target="_blank" rel="noopener noreferrer"`;
  const topoForm = proposta && F && String(data.formulario?.posicao || "") === "topo";
  const publico = toList(data.publico);
  const inclui = toList(data.inclui);
  const faq = Array.isArray(data.faq) ? data.faq : [];
  const hab = (lista, rotulo, cls) => (lista && lista.length
    ? `<div class="ficha-item"><dt>${esc(rotulo)}</dt><dd><div class="skill-list inline">${toList(lista).map((h) => `<span class="skill-chip ${cls}">${esc(h)}</span>`).join("")}</div></dd></div>`
    : "");
  const { html: corpoBruto } = renderMarkdown(content);
  const corpo = corpoBruto.replace(/src="assets\//g, 'src="../assets/').replace(/href="assets\//g, 'href="../assets/');
  const licencaLink = /CC BY-SA 4\.0/i.test(data.licenca || "") ? ` <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt" target="_blank" rel="noopener noreferrer">(ver licença)</a>` : "";

  // CTA principal e secundário
  let ctaTexto, ctaHref, ctaExternoAttr;
  if (proposta) {
    ctaTexto = data.cta_texto ? String(data.cta_texto) : F.botao;
    ctaHref = "#formulario"; ctaExternoAttr = "";
  } else if (venda) {
    ctaTexto = data.cta_texto ? String(data.cta_texto) : "Quero este material";
    ctaHref = String(data.checkout); ctaExternoAttr = ctaExterno;
  } else {
    ctaTexto = data.cta_texto ? String(data.cta_texto) : acesso ? "Acessar o recurso" : "Ver no GitHub";
    ctaHref = acesso || repo; ctaExternoAttr = ctaExterno;
  }
  const selo = catalogo
    ? `<div class="card-tags"><span class="project-tag">${esc(tipo)}</span><span class="format-tag">${venda ? "Produto pago" : "Gratuito"}</span></div>`
    : (data.selo ? `<div class="card-tags"><span class="format-tag">${esc(data.selo)}</span></div>` : "");

  const ficha = (catalogo || tipo || publico.length || toList(data.habilidades).length || toList(data.habilidades_computacao).length || data.licenca)
    ? `<section class="landing-ficha" aria-labelledby="h-ficha">
          <h2 id="h-ficha">Ficha do recurso</h2>
          <dl class="ficha">
            ${tipo ? itemFicha("Tipo", `${esc(tipo)}: ${TIPOS[tipo]}`) : ""}
            ${catalogo ? itemFicha("Acesso", venda ? "Pago, com compra pela plataforma indicada" : "Gratuito") : ""}
            ${publico.length ? itemFicha("Público", esc(publico.join(", "))) : ""}
            ${hab(toList(data.habilidades), "Habilidades BNCC", "bncc")}
            ${hab(toList(data.habilidades_computacao), "Habilidades BNCC Computação", "computacao")}
            ${data.licenca ? itemFicha("Licença", `${esc(data.licenca)}${licencaLink}`) : ""}
            ${repo ? itemFicha("Código-fonte", `<a href="${esc(repo)}" ${ctaExterno}>${esc(repo.replace(/^https:\/\//, ""))}</a>`) : ""}
          </dl>
        </section>` : "";

  const corpoBlocos = blocos.map((b, i) => {
    const h = b.titulo ? `<h2 id="b${i}-titulo">${esc(b.titulo)}</h2>` : "";
    const rotulado = b.titulo ? ` aria-labelledby="b${i}-titulo"` : "";
    let conteudo = "";
    if (b.tipo === "cards") conteudo = renderCards(b.itens);
    else if (b.tipo === "passos") conteudo = renderPassos(b.itens);
    else if (b.tipo === "lista") conteudo = renderLista(b.itens);
    else if (b.tipo === "depoimentos") conteudo = renderDepoimentos(b.itens);
    else if (b.tipo === "texto") conteudo = `<div class="prose lp-texto">${renderMarkdown(String(b.texto)).html}</div>`;
    else if (b.tipo === "formulario") return "";
    return `<section class="lp-section lp-bloco lp-bloco-${b.tipo}"${rotulado}>${h}${b.texto && b.tipo !== "texto" ? `<p class="lp-intro">${esc(b.texto)}</p>` : ""}${conteudo}</section>`;
  }).join("\n");
  const blocoFormulario = blocos.find((b) => b.tipo === "formulario");
  const blocoForm = Boolean(blocoFormulario) || (proposta && !topoForm);
  const posForm = blocoForm && !topoForm
    ? `<section class="lp-section lp-formulario"${blocoFormulario?.titulo ? ` aria-labelledby="formulario-bloco-titulo"` : ""}>${blocoFormulario?.titulo ? `<h2 id="formulario-bloco-titulo">${esc(blocoFormulario.titulo)}</h2>` : ""}${blocoFormulario?.texto ? `<p class="lp-intro">${esc(blocoFormulario.texto)}</p>` : ""}${formHtml(blocoFormulario?.titulo ? { ...F, titulo: "" } : F, L)}</section>`
    : "";

  const fornecedor = proposta || venda ? `<section class="landing-oferta" aria-labelledby="h-fornecedor">
          <h2 id="h-fornecedor">Quem responde pela oferta</h2>
          <div class="oferta-grid">
            <div class="oferta-card">
              <h3>Fornecedor</h3>
              <p>${esc(data.vendedor)}${data.vendedor_documento ? ` · ${esc(data.vendedor_documento)}` : ""}</p>
              <p>Atendimento: ${esc(data.vendedor_contato)}</p>
              <p><a href="../termos.html">Termos de uso</a> · <a href="../privacidade.html">Política de privacidade</a></p>
            </div>
          </div>
        </section>` : "";

  const oferta = venda ? `
        <section class="landing-oferta" aria-labelledby="h-oferta">
          <h2 id="h-oferta">Informações da compra</h2>
          <div class="oferta-grid">
            ${inclui.length ? `<div class="oferta-card"><h3>O que você recebe</h3><ul>${inclui.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>` : ""}
            <div class="oferta-card">
              <h3>Preço e pagamento</h3>
              <p class="price">${esc(data.preco)}</p>
              ${data.preco_obs ? `<p>${esc(data.preco_obs)}</p>` : ""}
              <p>O pagamento é feito na plataforma de venda, indicada no botão de compra.</p>
            </div>
            <div class="oferta-card">
              <h3>Direito de arrependimento</h3>
              <p>Você pode desistir desta compra em até ${L.data._dias} dias corridos, a contar do recebimento, conforme o art. 49 do Código de Defesa do Consumidor.</p>
              ${data.garantia ? `<p><strong>Garantia:</strong> ${esc(data.garantia)}</p>` : ""}
            </div>
            <div class="oferta-card">
              <h3>Fornecedor</h3>
              <p>${esc(data.vendedor)}${data.vendedor_documento ? ` · ${esc(data.vendedor_documento)}` : ""}</p>
              <p>Atendimento: ${esc(data.vendedor_contato)}</p>
              <p><a href="../termos.html">Termos de uso</a> · <a href="../privacidade.html">Política de privacidade</a></p>
            </div>
          </div>
        </section>` : "";

  const faqHtml = faq.length ? `<section class="landing-faq lp-section" aria-labelledby="h-faq"><h2 id="h-faq">Perguntas frequentes</h2><div class="faq">${faq.map((f) => `<details><summary>${esc(f.pergunta)}</summary><p>${esc(f.resposta)}</p></details>`).join("")}</div></section>` : "";

  const cta = data.cta_final ? `<section class="lp-cta-band" aria-labelledby="h-cta"><h2 id="h-cta">${esc(data.cta_final.titulo)}</h2>${data.cta_final.texto ? `<p>${esc(data.cta_final.texto)}</p>` : ""}<a class="btn primary" href="${proposta ? "#formulario" : esc(ctaHref)}"${proposta ? "" : ` ${ctaExterno}`}>${esc(data.cta_final.botao)}</a></section>` : "";

  const imagemFig = imagem ? `<figure class="landing-media">
            <img src="../${esc(imagem)}" alt="${esc(data.imagem_alt || `Captura de tela do recurso ${L.title}.`)}" width="1000" height="560" fetchpriority="high" decoding="async" />
          </figure>` : "";
  const direita = topoForm ? `<div class="lp-hero-form">${formHtml(F, L)}</div>` : imagemFig;

  const ld = jsonLd(catalogo
    ? { "@context": "https://schema.org", "@type": "LearningResource", name: L.title, description: data.resumo, url, inLanguage: "pt-BR", isAccessibleForFree: !venda, learningResourceType: TIPOS[tipo], image: `${SITE}/${imagem}`, ...(data.licenca ? { license: String(data.licenca) } : {}) }
    : { "@context": "https://schema.org", "@type": "WebPage", name: L.title, description: data.resumo, url, inLanguage: "pt-BR", image: `${SITE}/${imagem || "assets/img/hero.png"}` });
  const crumbs = catalogo
    ? `<a href="../index.html">Início</a> / <a href="../index.html#projetos">Catálogo</a> / <span>${esc(L.title)}</span>`
    : `<a href="../index.html">Início</a> / <span>${esc(L.title)}</span>`;
  const header = cabecalho === "simples"
    ? `<header class="site-header"><div class="container topbar"><a class="brand" href="../index.html" aria-label="Bio+Tech EduDesign — início"><img src="../assets/img/favicon.png" alt="" width="44" height="44" /><div><strong>Bio+Tech EduDesign</strong></div></a></div></header>`
    : fragment(HEADER, 1);
  const voltar = catalogo
    ? `<p class="landing-voltar"><a class="btn secondary" href="../index.html#projetos">Voltar ao catálogo</a></p>`
    : `<p class="landing-voltar"><a class="btn secondary" href="../index.html">Voltar ao início</a></p>`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(L.title)} | Bio+Tech EduDesign</title>
    <meta name="description" content="${esc(data.resumo)}" />
    <meta name="theme-color" content="#071b30" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(L.title)}" />
    <meta property="og:description" content="${esc(data.resumo)}" />
    <meta property="og:image" content="${SITE}/${esc(imagem || "assets/img/hero.png")}" />
    <link rel="canonical" href="${url}" />
    <link rel="icon" type="image/png" href="../assets/img/favicon.png" />
    <script type="application/ld+json">${ld}</script>
    ${THEME_SCRIPT}
    ${FONTS}
    <link rel="stylesheet" href="../assets/css/styles.css" />
    <link rel="stylesheet" href="../assets/css/blog.css" />
    <link rel="stylesheet" href="../assets/css/landing.css" />
  </head>
  <body>
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div class="bg-orb orb-one"></div>
    <div class="bg-orb orb-two"></div>
    ${header}
    <main id="conteudo">
      <article class="container landing">
        <nav class="crumbs" aria-label="Você está em">${crumbs}</nav>

        <header class="landing-hero${topoForm ? " landing-hero--form" : ""}">
          <div class="landing-copy">
            ${selo}
            <h1>${esc(L.title)}</h1>
            <p class="landing-lead">${esc(data.resumo)}</p>${data.prova_social ? `<p class="prova-social">${esc(data.prova_social)}</p>` : ""}
            <div class="cta-stack">
              <a class="btn primary" href="${esc(ctaHref)}"${ctaExternoAttr ? ` ${ctaExternoAttr}` : ""}>${esc(ctaTexto)}</a>
              ${catalogo && !venda && acesso && repo ? `<a class="btn secondary" href="${esc(repo)}" ${ctaExterno}>Ver no GitHub</a>` : ""}
            </div>
            ${venda ? `<p class="price-line"><strong>${esc(data.preco)}</strong>${data.preco_obs ? ` · ${esc(data.preco_obs)}` : ""}</p>` : ""}
          </div>
          ${direita}
        </header>

        ${ficha}

        <div class="prose">
${corpo}
        </div>
${corpoBlocos ? `\n${corpoBlocos}\n` : ""}${posForm ? `\n        ${posForm}\n` : ""}${faqHtml ? `\n        ${faqHtml}\n` : ""}${cta ? `\n        ${cta}\n` : ""}${oferta}${fornecedor}
        ${voltar}
      </article>
    </main>
    ${fragment(FOOTER, 1)}
    <script src="../assets/js/lib.js"></script>
    <script src="../assets/js/theme.js"></script>
  </body>
</html>
`;
}

// ---------- execução ----------
const files = fs.existsSync(LANDINGS_DIR) ? fs.readdirSync(LANDINGS_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_")).sort() : [];
const geradas = [];
const slugsVistos = new Set();
for (const dir of Object.values(DIRS)) {
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(dir)) if (f.endsWith(".html")) fs.unlinkSync(path.join(dir, f));
}
for (const f of files) {
  const L = lerLanding(f);
  if (!L) continue;
  if (slugsVistos.has(L.slug)) { avisar("erro", f, `slug "${L.slug}" repetido.`); continue; }
  slugsVistos.add(L.slug);
  fs.writeFileSync(path.join(DIRS[L.dir === "lp" ? "lp" : "recursos"], `${L.slug}.html`), landingPage(L));
  geradas.push(`${L.dir}/${L.slug}`);
}

const nErros = problemas.filter((p) => p.nivel === "erro").length;
const nAvisos = problemas.length - nErros;
console.log(`${nErros ? "⚠" : "✔"} ${geradas.length} de ${files.length} página(s) gerada(s) (recursos/ e lp/).${nAvisos ? ` ${nAvisos} aviso(s).` : ""}`);
if (nErros) {
  console.error(`✖ ${nErros} erro(s): as páginas com erro NÃO foram geradas. Corrija o(s) arquivo(s) indicado(s).`);
  process.exit(1);
}
