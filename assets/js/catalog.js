/* Catálogo de recursos: carrega data/projects.json, filtra por tipo e busca por tema/habilidade. */
(async function () {
  const { el, norm } = window.BT;
  const grid = document.getElementById("project-grid");
  if (!grid) return;
  const buttons = [...document.querySelectorAll(".filter")];
  const search = document.getElementById("search");
  let current = "all";
  let projects = [];

  try {
    projects = await fetch("data/projects.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); });
  } catch (e) {
    grid.replaceChildren(el("p", { class: "empty", text: "Não foi possível carregar o catálogo. Recarregue a página ou acesse a organização no GitHub." }));
    return;
  }

  const metric = document.getElementById("metric-count");
  if (metric) metric.textContent = String(projects.length);

  const matches = (p, q) => !q || norm([p.title, p.type, p.summary, p.description, ...(p.bncc || []), ...(p.bnccComputacao || [])].join(" ")).includes(q);

  function skills(list, label, variant) {
    if (!Array.isArray(list) || !list.length) return null;
    return el("div", { class: "skill-group" },
      el("span", { class: "skill-label", text: label }),
      el("div", { class: "skill-list" }, list.map((s) => el("span", { class: `skill-chip ${variant}`, text: s }))));
  }
  function actions(p) {
    const link = (cls, href, text) => el("a", { class: `link-btn ${cls}`, href, target: "_blank", rel: "noreferrer", text });
    if (p.link) return [link("primary", p.link, "Abrir recurso"), p.repo ? link("secondary", p.repo, "Código") : null];
    if (p.repo) return [link("primary", p.repo, "Ver no GitHub")];
    return [el("span", { class: "link-btn muted", text: "Em breve" })];
  }
  function card(p) {
    return el("article", { class: "project-card" },
      el("div", { class: "project-thumb" }, el("img", { src: p.screenshot, alt: p.alt || `Captura de tela do recurso ${p.title}`, loading: "lazy", decoding: "async" })),
      el("div", { class: "project-content" },
        el("span", { class: "project-tag", text: p.type }),
        el("h3", { text: p.title }),
        el("p", { text: p.summary }),
        el("details", { class: "project-details" },
          el("summary", { text: "Detalhes pedagógicos e BNCC" }),
          el("p", { text: p.description }),
          el("div", { class: "project-skills" }, skills(p.bncc, "BNCC", "bncc"), skills(p.bnccComputacao, "BNCC Computação", "computacao"))),
        el("div", { class: "project-actions" }, actions(p))));
  }
  function render() {
    const q = norm((search?.value || "").trim());
    buttons.forEach((b) => {
      const f = b.dataset.filter;
      const n = projects.filter((p) => (f === "all" || p.type === f) && matches(p, q)).length;
      b.textContent = `${b.dataset.label} (${n})`;
    });
    const list = projects.filter((p) => (current === "all" || p.type === current) && matches(p, q));
    grid.replaceChildren(...(list.length ? list.map(card) : [el("div", { class: "empty-state" }, el("h3", { text: "Nenhum recurso encontrado" }), el("p", { text: "Tente outro termo ou outro tipo de recurso." }))]));
  }

  buttons.forEach((b) => {
    b.setAttribute("aria-pressed", String(b.classList.contains("active")));
    b.addEventListener("click", () => {
      current = b.dataset.filter;
      buttons.forEach((x) => { const on = x === b; x.classList.toggle("active", on); x.setAttribute("aria-pressed", String(on)); });
      render();
    });
  });
  search?.addEventListener("input", render);
  render();
})();
