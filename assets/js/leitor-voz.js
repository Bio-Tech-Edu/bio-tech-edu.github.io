/**
 * leitor-voz.js — leitura em voz alta (Text-to-Speech) dos posts do blog.
 * Arquitetura 100% Client-side e Nativa usando Web Speech API.
 */

export const MAX_CARACTERES = 150;
const VELOCIDADES = [0.75, 1, 1.25, 1.5, 2];
const CLASSE_DESTAQUE = "tts-lendo";
const SELETOR_BLOCOS = "h1, h2, h3, h4, h5, h6, p, li, blockquote, dt, dd";

const SELETOR_IGNORAR = [
  "pre", "code", "figcaption", "nav", "script", "style", "noscript", 
  "svg", "iframe", "audio", "video", "[hidden]", "[aria-hidden='true']", 
  "[data-no-tts]", ".visually-hidden", ".meta-list", ".leitor-voz"
].join(", ");

const SELETOR_ANINHADOS = "ul, ol, dl, p, li, blockquote, table, h1, h2, h3, h4, h5, h6";
const CHAVE_VELOCIDADE = "leitor-voz:velocidade";
const ATRASO_APOS_CANCELAR_MS = 60;
const ESPERA_RETOMAR_MS = 600;
const MAX_ERROS_SEGUIDOS = 3;

function limpar(texto) {
  return texto
    .replace(/[​-‍﻿­]/g, "") 
    .replace(/\bhttps?:\/\/\S+/gi, "link") 
    .replace(/[·•▪◦|]+/g, ", ") 
    .replace(/\s+/g, " ")
    .trim();
}

export function textoDoBloco(el) {
  const copia = el.cloneNode(true);
  copia.querySelectorAll(`${SELETOR_IGNORAR}, ${SELETOR_ANINHADOS}`).forEach((no) => no.remove());
  copia.querySelectorAll("br").forEach((br) => br.replaceWith(" "));
  return limpar(copia.textContent ?? "");
}

export function coletarBlocos(raiz) {
  const blocos = [];
  raiz.querySelectorAll(SELETOR_BLOCOS).forEach((el) => {
    if (el.closest(SELETOR_IGNORAR)) return;
    const texto = textoDoBloco(el);
    if (/[\p{L}\p{N}]/u.test(texto)) blocos.push({ el, texto });
  });
  return blocos;
}

export function dividirTexto(texto, max = MAX_CARACTERES) {
  const limpo = texto.replace(/\s+/g, " ").trim();
  if (!limpo) return [];
  if (limpo.length <= max) return [limpo];

  const frases = limpo.match(/[^.!?…]+[.!?…]*["”’')\]]*\s*|[.!?…]+\s*/g) ?? [limpo];
  const trechos = [];
  let atual = "";
  const fechar = () => {
    if (atual.trim()) trechos.push(atual.trim());
    atual = "";
  };

  for (const frase of frases) {
    if ((atual + frase).trim().length <= max) {
      atual += frase;
      continue;
    }
    fechar();
    if (frase.trim().length <= max) {
      atual = frase;
      continue;
    }
    let resto = frase.trim();
    while (resto.length > max) {
      const pausa = Math.max(
        resto.lastIndexOf(", ", max - 1),
        resto.lastIndexOf("; ", max - 1),
        resto.lastIndexOf(": ", max - 1),
        resto.lastIndexOf(" – ", max - 1)
      );
      let corte = pausa >= max * 0.4 ? pausa + 1 : resto.lastIndexOf(" ", max);
      if (corte <= 0) corte = max;
      trechos.push(resto.slice(0, corte).trim());
      resto = resto.slice(corte).trim();
    }
    atual = resto;
  }
  fechar();
  return trechos;
}

export function montarFila(blocos) {
  const fila = [];
  blocos.forEach((bloco, i) => {
    dividirTexto(bloco.texto).forEach((texto) => fila.push({ el: bloco.el, texto, bloco: i }));
  });
  return { fila, totalBlocos: blocos.length };
}

export function escolherVoz(vozes) {
  let candidatas = vozes.filter((voz) => normalizarLang(voz) === "pt-br");
  if (!candidatas.length) candidatas = vozes.filter((voz) => normalizarLang(voz).startsWith("pt"));
  if (!candidatas.length) return null;

  const pontos = (voz) => {
    let p = 0;
    if (/natural|neural|online/i.test(voz.name)) p += 100;
    if (/google/i.test(voz.name)) p += 70;
    if (/microsoft/i.test(voz.name)) p += 50;
    if (/premium|enhanced|aprimorad|siri/i.test(voz.name)) p += 60;
    if (voz.default) p += 5;
    return p;
  };

  return candidatas
    .map((voz, ordem) => ({ voz, ordem, p: pontos(voz) }))
    .sort((a, b) => b.p - a.p || a.ordem - b.ordem)[0].voz;
}

const normalizarLang = (voz) => String(voz.lang || "").replace("_", "-").toLowerCase();

function lerVelocidade() {
  try {
    const salva = Number(localStorage.getItem(CHAVE_VELOCIDADE));
    return VELOCIDADES.includes(salva) ? salva : 1;
  } catch {
    return 1;
  }
}

function salvarVelocidade(valor) {
  try { localStorage.setItem(CHAVE_VELOCIDADE, String(valor)); } catch {}
}

export function iniciarLeitorVoz(barra, raiz) {
  const synth = window.speechSynthesis;
  if (!synth || typeof window.SpeechSynthesisUtterance !== "function") return null;

  const campo = (nome) => barra.querySelector(`[data-leitor-voz-${nome}]`);
  const el = {
    alternar: campo("alternar"),
    parar: campo("parar"),
    velocidade: campo("velocidade"),
    rotulo: campo("rotulo"),
    progresso: campo("progresso"),
    status: campo("status"),
    iconeTocar: barra.querySelector('[data-icone="tocar"]'),
    iconePausar: barra.querySelector('[data-icone="pausar"]'),
  };
  
  if (Object.values(el).some((item) => !item)) return null;

  let estado = "parado"; 
  let fila = [];
  let totalBlocos = 0;
  let indice = 0;
  let ficha = 0;
  let falaAtual = null; 
  let atividade = 0;
  let reiniciarAoRetomar = false;
  let errosSeguidos = 0;
  let voz = null;
  let velocidade = lerVelocidade();
  let destacado = null;

  const atualizarVoz = () => { voz = escolherVoz(synth.getVoices()); };

  const anunciar = (mensagem) => { el.status.textContent = mensagem; };

  function atualizarInterface() {
    el.rotulo.textContent = { parado: "Ouvir texto", lendo: "Pausar leitura", pausado: "Retomar leitura" }[estado];
    el.iconeTocar.toggleAttribute("hidden", estado === "lendo");
    el.iconePausar.toggleAttribute("hidden", estado !== "lendo");
    barra.dataset.estado = estado;
    el.parar.setAttribute("aria-disabled", String(estado === "parado"));
    if (estado === "parado") el.progresso.textContent = "";
  }

  function mostrarProgresso() {
    const item = fila[indice];
    if (item) el.progresso.textContent = `Trecho ${item.bloco + 1} de ${totalBlocos}`;
  }

  function alturaCoberta() {
    const cabecalho = document.querySelector("header");
    const base = cabecalho ? cabecalho.getBoundingClientRect().bottom : 0;
    const r = barra.getBoundingClientRect();
    return r.top <= base + 1 ? Math.max(base, r.bottom) : base;
  }

  function destacar(bloco) {
    if (destacado === bloco) return;
    destacado?.classList.remove(CLASSE_DESTAQUE);
    destacado = bloco;
    if (!bloco) return;
    bloco.classList.add(CLASSE_DESTAQUE);

    const r = bloco.getBoundingClientRect();
    if (r.top >= alturaCoberta() && r.bottom <= window.innerHeight) return;
    const reduzir = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    bloco.scrollIntoView({
      block: r.height > window.innerHeight * 0.6 ? "start" : "center",
      behavior: reduzir ? "auto" : "smooth",
    });
  }

  function limparFila() {
    synth.cancel();
    if (synth.paused) synth.resume();
  }

  function falar() {
    const item = fila[indice];
    if (!item) return;
    const minha = ++ficha;
    if (!voz) atualizarVoz();

    const fala = new window.SpeechSynthesisUtterance(item.texto);
    if (voz) {
      fala.voice = voz;
      fala.lang = String(voz.lang).replace("_", "-");
    } else {
      fala.lang = "pt-BR";
    }
    fala.rate = velocidade;

    fala.onstart = () => {
      if (minha !== ficha) return;
      atividade += 1;
      destacar(item.el);
      mostrarProgresso();
    };
    
    fala.onend = () => {
      if (minha !== ficha) return;
      atividade += 1;
      errosSeguidos = 0;
      aoTerminarTrecho();
    };
    
    fala.onerror = (evento) => {
      if (minha !== ficha) return;
      atividade += 1;
      aoErro(evento);
    };

    falaAtual = fala;
    synth.speak(fala);
  }

  function reiniciarTrecho() {
    const minha = ++ficha;
    limparFila();
    setTimeout(() => {
      if (minha === ficha && estado === "lendo") falar();
    }, ATRASO_APOS_CANCELAR_MS);
  }

  function aoTerminarTrecho() {
    if (estado === "pausado") {
      reiniciarAoRetomar = true; 
      return;
    }
    if (estado !== "lendo") return;
    indice += 1;
    if (indice >= fila.length) {
      concluir();
      return;
    }
    falar();
  }

  function aoErro(evento) {
    const tipo = evento && evento.error;
    if (tipo === "canceled" || tipo === "interrupted") {
      if (estado === "pausado") reiniciarAoRetomar = true;
      else parar("Leitura interrompida.");
      return;
    }
    if (tipo === "not-allowed") {
      parar("O navegador bloqueou o áudio. Use o botão Ouvir novamente.");
      return;
    }
    errosSeguidos += 1;
    if (errosSeguidos >= MAX_ERROS_SEGUIDOS) {
      parar("Não foi possível reproduzir a voz neste navegador.");
      return;
    }
    aoTerminarTrecho();
  }

  function redefinir() {
    ficha += 1;
    estado = "parado";
    indice = 0;
    reiniciarAoRetomar = false;
    errosSeguidos = 0;
    falaAtual = null;
    destacar(null);
    atualizarInterface();
    desligarSaida();
  }

  function concluir() {
    redefinir();
    anunciar("Leitura concluída.");
  }

  function parar(mensagem = "Leitura parada.") {
    limparFila();
    redefinir();
    anunciar(mensagem);
  }

  function iniciar() {
    const montada = montarFila(coletarBlocos(raiz));
    if (!montada.fila.length) {
      anunciar("Não há texto para ler neste artigo.");
      return;
    }
    fila = montada.fila;
    totalBlocos = montada.totalBlocos;
    indice = 0;
    errosSeguidos = 0;
    reiniciarAoRetomar = false;
    estado = "lendo";
    atualizarInterface();
    ligarSaida();
    anunciar("Leitura iniciada.");
    reiniciarTrecho(); 
  }

  function pausar() {
    if (synth.speaking) synth.pause();
    else reiniciarAoRetomar = true;
    estado = "pausado";
    atualizarInterface();
    anunciar("Leitura pausada.");
  }

  function retomar() {
    estado = "lendo";
    atualizarInterface();
    anunciar("Leitura retomada.");
    if (reiniciarAoRetomar || !synth.paused) {
      reiniciarAoRetomar = false;
      reiniciarTrecho();
      return;
    }
    const marca = atividade;
    synth.resume();
    setTimeout(() => {
      if (estado === "lendo" && atividade === marca && !synth.speaking) reiniciarTrecho();
    }, ESPERA_RETOMAR_MS);
  }

  function mudarVelocidade(valor) {
    if (!VELOCIDADES.includes(valor)) return;
    velocidade = valor;
    salvarVelocidade(valor);
    if (estado === "lendo") reiniciarTrecho(); 
    else if (estado === "pausado") reiniciarAoRetomar = true; 
  }

  const cancelarAoSair = () => synth.cancel();
  const ligarSaida = () => window.addEventListener("beforeunload", cancelarAoSair);
  function desligarSaida() {
    window.removeEventListener("beforeunload", cancelarAoSair);
  }
  
  window.addEventListener("pagehide", cancelarAoSair); 
  window.addEventListener("pageshow", (evento) => {
    if (evento.persisted) redefinir(); 
  });

  el.alternar.addEventListener("click", () => {
    if (estado === "parado") iniciar();
    else if (estado === "lendo") pausar();
    else retomar();
  });
  el.parar.addEventListener("click", () => {
    if (estado !== "parado") parar();
  });

  el.velocidade.value = String(velocidade);
  el.velocidade.addEventListener("change", () => mudarVelocidade(Number(el.velocidade.value)));

  if (typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", atualizarVoz);
  else synth.onvoiceschanged = atualizarVoz;
  atualizarVoz();

  atualizarInterface();
  barra.hidden = false;

  return { parar: () => estado !== "parado" && parar() };
}

if (typeof document !== "undefined") {
  const barra = document.querySelector("[data-leitor-voz]");
  const raiz = barra?.closest("article");
  if (barra && raiz) iniciarLeitorVoz(barra, raiz);
}