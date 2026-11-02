/* Página do blog: carrossel, busca, filtros (área, atuação, formato, tags), comunidade e mídia. */
(async function () {
  const { el, norm, fmtDate: fmt } = window.BT;
  const $ = (id) => document.getElementById(id);
  const PAGE = 6;

  // ----- comunidade e mídia (blog/config.json) -----
  const config = await fetch("blog/config.json").then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
  const waBox = $("wa-box");
  if (waBox) {
    if (config.whatsapp) {
      waBox.append(el("a", { class: "btn primary", href: config.whatsapp, target: "_blank", rel: "noopener noreferrer", text: config.whatsappRotulo || "Entrar na comunidade" }));
    } else {
      waBox.append(el("p", { text: "O link da comunidade será divulgado em breve." }));
    }
  }
  const mediaList = $("media-links");
  if (mediaList) {
    (config.midia || []).forEach((m) =>
      mediaList.append(el("li", {}, el("a", { href: m.url, target: "_blank", rel: "noopener noreferrer", text: m.titulo }), m.descricao ? el("small", { text: m.descricao }) : null)));
    if (!mediaList.children.length) mediaList.remove();
  }

  // ----- publicações -----
  let posts = [];
  try {
    posts = await fetch("blog/posts.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); });
  } catch (e) {
    $("post-list").replaceChildren(el("p", { class: "empty", text: "Não foi possível carregar as publicações. Se estiver abrindo o arquivo direto do computador, use um servidor local (python3 -m http.server)." }));
    return;
  }
  if (!posts.length) {
    $("post-list").replaceChildren(el("p", { class: "empty", text: "Ainda não há publicações." }));
    return;
  }

  // ----- carrossel: 5 publicações de maior destaque (depois, as mais recentes) -----
  const top = [...posts].sort((a, b) => (b.destaque - a.destaque) || b.date.localeCompare(a.date)).slice(0, 5);
  const slidesBox = $("carousel-slides");
  const dotsBox = $("carousel-dots");
  let cur = 0;
  const slides = top.map((p, i) =>
    el("article", { class: "slide", role: "group", "aria-roledescription": "slide", "aria-label": `${i + 1} de ${top.length}`, hidden: i !== 0 },
      el("div", { class: "slide-media" }, p.cover ? el("img", { src: p.cover, alt: p.coverAlt || "", loading: i ? "lazy" : "eager" }) : null),
      el("div", { class: "slide-body" },
        el("div", { class: "card-tags" }, el("span", { class: "project-tag", text: p.area }), el("span", { class: "format-tag", text: p.formato })),
        el("h3", {}, el("a", { href: p.url, text: p.title })),
        el("p", { text: p.summary }),
        el("p", { class: "meta", text: `${fmt(p.date)} · ${p.readingTime} min de leitura` }),
        el("a", { class: "btn primary", href: p.url, text: "Ler publicação" }))));
  slidesBox.append(...slides);
  const dots = top.map((p, i) => el("button", { type: "button", "aria-label": `Ir para a publicação ${i + 1}`, onclick: () => show(i) }));
  dotsBox.append(...dots);
  function show(i) {
    cur = (i + top.length) % top.length;
    slides.forEach((s, k) => (s.hidden = k !== cur));
    dots.forEach((d, k) => d.setAttribute("aria-current", String(k === cur)));
    $("carousel-count").textContent = `${cur + 1} de ${top.length}`;
  }
  $("carousel-prev").addEventListener("click", () => show(cur - 1));
  $("carousel-next").addEventListener("click", () => show(cur + 1));
  $("carousel").addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
  if (top.length < 2) document.querySelector(".carousel-ctrl").hidden = true;
  show(0);
  $("carousel").hidden = false;

  // ----- busca, facetas, tags -----
  const KEYS = ["q", "area", "atuacao", "formato", "tag"];
  const LABEL = { area: "Área", atuacao: "Atuação", formato: "Formato", tag: "Tag", q: "Busca" };
  const params = new URLSearchParams(location.search);
  const state = { limit: PAGE };
  KEYS.forEach((k) => (state[k] = params.get(k) || ""));

  function syncUrl() {
    const p = new URLSearchParams();
    KEYS.forEach((k) => state[k] && p.set(k, state[k]));
    const s = p.toString();
    history.replaceState(null, "", s ? `?${s}` : location.pathname);
  }
  const filtered = () =>
    posts.filter((p) =>
      (!state.q || norm([p.title, p.summary, p.area, p.atuacao, p.formato, ...p.tags].join(" ")).includes(norm(state.q))) &&
      (!state.area || p.area === state.area) &&
      (!state.atuacao || p.atuacao === state.atuacao) &&
      (!state.formato || p.formato === state.formato) &&
      (!state.tag || p.tags.includes(state.tag)));
  const count = (get) => {
    const m = new Map();
    posts.forEach((p) => [].concat(get(p)).forEach((v) => m.set(v, (m.get(v) || 0) + 1)));
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt-BR"));
  };
  function toggle(key, val) {
    state[key] = state[key] === val ? "" : val;
    state.limit = PAGE;
    render();
  }
  function renderFacet(id, key, entries) {
    const box = $(id);
    if (!box) return;
    box.replaceChildren(...entries.map(([name, n]) =>
      el("button", { type: "button", "aria-pressed": String(state[key] === name), onclick: () => toggle(key, name) },
        el("span", { text: name }), el("span", { class: "count", text: String(n) }))));
  }
  function card(p) {
    return el("article", { class: "post-card" },
      p.cover ? el("img", { class: "post-cover", src: p.cover, alt: p.coverAlt || "", loading: "lazy", decoding: "async" }) : el("div", { class: "post-cover", "aria-hidden": "true" }),
      el("div", { class: "post-card-body" },
        el("div", { class: "card-tags" }, el("span", { class: "project-tag", text: p.area }), el("span", { class: "format-tag", text: p.formato })),
        el("h3", {}, el("a", { href: p.url, text: p.title })),
        el("p", { text: p.summary }),
        el("p", { class: "meta", text: `${fmt(p.date)} · ${p.readingTime} min · ${p.atuacao}` }),
        el("a", { class: "more", href: p.url, "aria-label": `Ler: ${p.title}`, text: "Ler publicação →" })));
  }
  function clearAll() {
    KEYS.forEach((k) => (state[k] = ""));
    $("post-search").value = "";
    state.limit = PAGE;
    render();
  }
  function render() {
    syncUrl();
    renderFacet("facet-area", "area", count((p) => p.area));
    renderFacet("facet-atuacao", "atuacao", count((p) => p.atuacao));
    renderFacet("facet-formato", "formato", count((p) => p.formato));
    $("tag-cloud").replaceChildren(...count((p) => p.tags).slice(0, 30).map(([t, n]) =>
      el("button", { type: "button", "aria-pressed": String(state.tag === t), onclick: () => toggle("tag", t), text: `#${t} (${n})` })));

    const active = KEYS.filter((k) => state[k]);
    $("active-filters").replaceChildren(
      ...active.map((k) => el("button", {
        type: "button", class: "chip-btn", "aria-label": `Remover filtro ${LABEL[k]}: ${state[k]}`,
        onclick: () => { state[k] = ""; if (k === "q") $("post-search").value = ""; state.limit = PAGE; render(); },
        text: `${LABEL[k]}: ${state[k]} ✕`,
      })),
      active.length > 1 ? el("button", { type: "button", class: "chip-btn", onclick: clearAll, text: "Limpar tudo" }) : null);

    const list = filtered();
    $("result-count").textContent = `${list.length} ${list.length === 1 ? "publicação" : "publicações"}`;
    $("post-list").replaceChildren(...(list.length ? list.slice(0, state.limit).map(card) : [el("p", { class: "empty", text: "Nenhuma publicação encontrada. Tente outro termo ou remova filtros." })]));
    $("load-more").hidden = list.length <= state.limit;
  }
  $("post-search").value = state.q;
  $("post-search").addEventListener("input", (e) => { state.q = e.target.value.trim(); state.limit = PAGE; render(); });
  $("load-more").addEventListener("click", () => { state.limit += PAGE; render(); });
  render();
})();
