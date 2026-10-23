const projects = [
  {
    title: "Termoquímica",
    type: "REA",
    summary: "Recurso digital para estudo de energia em reações químicas, calor, entalpia e sua relação com transformações físicas e químicas.",
    description: "O objeto contribui para a modelagem conceitual por meio de explicações visuais e contextos voltados à investigação e à interpretação.",
    screenshot: "assets/screenshots/termoquimica_0.png",
    repo: "https://github.com/Bio-Tech-Edu/termoquimica",
    bncc: ["EM13CN01", "EM13CNT103"],
    bnccComputacao: ["EM13TD04", "EM13TD05"]
  },
  {
    title: "Soluções",
    type: "REA",
    summary: "Recurso educacional aberto sobre soluções químicas com abordagem lúdica, sequências didáticas e desenvolvimento de raciocínio quantitativo.",
    description: "O material favorece o entendimento de concentrações, propriedades e aplicações práticas em contextos do cotidiano e do ensino científico.",
    screenshot: "assets/screenshots/solucoes.png",
    repo: "https://github.com/Bio-Tech-Edu/solucoes",
    bncc: ["EM13CN01", "EM13CNT103"],
    bnccComputacao: ["EM13TD04", "EM13TD05"]
  },
  {
    title: "Cinética",
    type: "REA",
    summary: "Material interativo para exploração de velocidade de reação e fatores que influenciam a rapidez dos processos químicos.",
    description: "A proposta permite a análise de variáveis, interpretação de gráficos e construção de explicações científicas a partir de observações.",
    screenshot: "assets/screenshots/cinetica.png",
    repo: "https://github.com/Bio-Tech-Edu/cinetica",
    bncc: ["EM13CN01", "EM13CNT103"],
    bnccComputacao: ["EM13TD04", "EM13TD05"]
  },
  {
    title: "Equilíbrio",
    type: "REA",
    summary: "Recurso educacional aberto voltado ao estudo do equilíbrio químico e à compreensão de grandezas, reações reversíveis e estabilidade do sistema.",
    description: "A abordagem favorece o raciocínio quantitativo e a leitura de resultados em contextos de experimentação e modelagem conceitual.",
    screenshot: "assets/screenshots/equilibrio.png",
    repo: "https://github.com/Bio-Tech-Edu/equilibrio",
    bncc: ["EM13CN01", "EM13CNT103"],
    bnccComputacao: ["EM13TD04", "EM13TD05"]
  },
  {
    title: "Eletroquímica",
    type: "REA",
    summary: "Material para estudo de reações de oxirredução, células eletroquímicas e processos que conectam teoria e aplicações tecnológicas.",
    description: "A estrutura didática prioriza relação entre fenômenos químicos e contexto tecnológico, ampliando a compreensão científica e aplicada.",
    screenshot: "assets/screenshots/eletroquimica_000.png",
    repo: "https://github.com/Bio-Tech-Edu/eletroquimica",
    bncc: ["EM13CN01", "EM13CNT103"],
    bnccComputacao: ["EM13TD04", "EM13TD05"]
  },
  {
    title: "ENEM",
    type: "RED",
    summary: "Dashboard educacional preparatório para o ENEM.",
    description: "O recurso apoia a preparação para o ENEM por meio de abordagem orientada para competências, análise de contextos e revisão estratégica.",
    screenshot: "assets/screenshots/enem.png",
    repo: "https://github.com/Bio-Tech-Edu/enem",
    bncc: ["EM13CN01", "EM13CNT204"],
    bnccComputacao: ["EM13TD01", "EM13TD05"]
  },
  {
    title: "Org",
    type: "REA",
    summary: "Jornada interativa com cientistas brasileiras, missões, simulações e desafios em formato de aprendizagem imersiva.",
    description: "A proposta utiliza narrativa, interatividade e avaliação formativa para ampliar o engajamento e estimular o raciocínio científico.",
    screenshot: "assets/screenshots/org.png",
    repo: "https://github.com/Bio-Tech-Edu/org",
    bncc: ["EM13CN01", "EM13CNT204"],
    bnccComputacao: ["EM13TD01", "EM13TD05"]
  },
  {
    title: "Genética Mendeliana: Explorando a análise de dados genéticos",
    type: "OAD",
    summary: "Kit pedagógico modelo com plano de aula, atividade prática em planilha e design gráfico web interativo.",
    description: "Capacita os alunos a compreenderem os princípios básicos da Genética Mendeliana e a analisarem dados genéticos com apoio de ferramentas digitais.",
    screenshot: "assets/screenshots/kit_p_002.png",
    repo: null,
    link: "https://canva.link/5u59sg358jzkuio",
    bncc: ["EM13CN01", "EM13CNT204"],
    bnccComputacao: ["EM13TD01", "EM13TD04", "EM13TD05"]
  }
];

const projectGrid = document.getElementById("project-grid");
const filterButtons = document.querySelectorAll(".filter");
const searchInput = document.getElementById("search");
let currentFilter = "all";

function renderSkillTags(skills, label, variant) {
  if (!Array.isArray(skills) || !skills.length) return "";
  const tags = skills.map((skill) => `<span class="skill-chip ${variant}">${skill}</span>`).join("");
  return `<div class="skill-group"><span class="skill-label">${label}</span><div class="skill-list">${tags}</div></div>`;
}

function getActionButtons(project) {
  const buttons = [];
  if (project.link) {
    buttons.push(`<a class="link-btn primary" href="${project.link}" target="_blank" rel="noreferrer">Abrir recurso</a>`);
    if (project.repo) buttons.push(`<a class="link-btn secondary" href="${project.repo}" target="_blank" rel="noreferrer">Código</a>`);
  } else if (project.repo) {
    buttons.push(`<a class="link-btn primary" href="${project.repo}" target="_blank" rel="noreferrer">Ver no GitHub</a>`);
  } else {
    buttons.push('<span class="link-btn muted">Em breve</span>');
  }
  return buttons.join("");
}

function matches(project, query) {
  if (!query) return true;
  const hay = [project.title, project.type, project.summary, project.description, ...(project.bncc || []), ...(project.bnccComputacao || [])]
    .join(" ").toLowerCase();
  return hay.includes(query);
}

function updateCounts(query) {
  filterButtons.forEach((btn) => {
    const f = btn.dataset.filter;
    const n = projects.filter((p) => (f === "all" || p.type === f) && matches(p, query)).length;
    btn.textContent = `${btn.dataset.label} (${n})`;
  });
}

function renderProjects() {
  const query = (searchInput?.value || "").trim().toLowerCase();
  updateCounts(query);
  projectGrid.innerHTML = "";
  const list = projects.filter((p) => (currentFilter === "all" || p.type === currentFilter) && matches(p, query));

  if (!list.length) {
    projectGrid.innerHTML = `<div class="empty-state"><h3>Nenhum recurso encontrado</h3><p>Tente outro termo ou outro tipo de recurso.</p></div>`;
    return;
  }

  list.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";
    const alt = project.alt || `Captura de tela do recurso ${project.title}`;
    card.innerHTML = `
      <div class="project-thumb"><img src="${project.screenshot}" alt="${alt}" loading="lazy" /></div>
      <div class="project-content">
        <span class="project-tag">${project.type}</span>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <details class="project-details">
          <summary>Detalhes pedagógicos e BNCC</summary>
          <p>${project.description}</p>
          <div class="project-skills">
            ${renderSkillTags(project.bncc, "BNCC", "bncc")}
            ${renderSkillTags(project.bnccComputacao, "BNCC Computação", "computacao")}
          </div>
        </details>
        <div class="project-actions">${getActionButtons(project)}</div>
      </div>`;
    projectGrid.appendChild(card);
  });
}

filterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((btn) => {
      const on = btn === button;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", String(on));
    });
    renderProjects();
  });
});

searchInput?.addEventListener("input", renderProjects);
const metric = document.getElementById("metric-count");
if (metric) metric.textContent = String(projects.length);
renderProjects();
