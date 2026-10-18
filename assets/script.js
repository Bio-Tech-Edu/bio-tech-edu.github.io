const projects = [
  {
    title: "Termoquímica",
    type: "REA",
    summary: "Recurso digital para estudo de energia em reações químicas, calor, entalpia e sua relação com transformações físicas e químicas.",
    description: "O objeto contribui para a modelagem conceitual por meio de explicações visuais e contextos voltados à investigação e à interpretação.",
    screenshot: "assets/screenshots/termoquimica_0.png",
    repo: "https://github.com/Bio-Tech-Edu/termoquimica"
  },
  {
    title: "Soluções",
    type: "REA",
    summary: "Recurso educacional aberto sobre soluções químicas com abordagem lúdica, sequências didáticas e desenvolvimento de raciocínio quantitativo.",
    description: "O material favorece o entendimento de concentrações, propriedades e aplicações práticas em contextos do cotidiano e do ensino científico.",
    screenshot: "assets/screenshots/solucoes.png",
    repo: "https://github.com/Bio-Tech-Edu/solucoes"
  },
  {
    title: "Cinética",
    type: "REA",
    summary: "Material interativo para exploração de velocidade de reação e fatores que influenciam a rapidez dos processos químicos.",
    description: "A proposta permite a análise de variáveis, interpretação de gráficos e construção de explicações científicas a partir de observações.",
    screenshot: "assets/screenshots/cinetica.png",
    repo: "https://github.com/Bio-Tech-Edu/cinetica"
  },
  {
    title: "Equilíbrio",
    type: "REA",
    summary: "Recurso digital voltado ao estudo do equilíbrio químico e à compreensão de grandezas, reações reversíveis e estabilidade do sistema.",
    description: "A abordagem favorece o raciocínio quantitativo e a leitura de resultados em contextos de experimentação e modelagem conceitual.",
    screenshot: "assets/screenshots/equilibrio.png",
    repo: "https://github.com/Bio-Tech-Edu/equilibrio"
  },
  {
    title: "Eletroquímica",
    type: "REA",
    summary: "Material para estudo de reações de oxirredução, células eletroquímicas e processos que conectam teoria e aplicações tecnológicas.",
    description: "A estrutura didática prioriza relação entre fenômenos químicos e contexto tecnológico, ampliando a compreensão científica e aplicada.",
    screenshot: "assets/screenshots/eletroquimica_000.png",
    repo: "https://github.com/Bio-Tech-Edu/eletroquimica"
  },
  {
    title: "ENEM",
    type: "RED",
    summary: "Aulão e materiais de apoio para revisão de Ciências da Natureza com foco em repertório e estratégias de resolução de provas.",
    description: "O recurso apoia a preparação para o ENEM por meio de abordagem orientada para competências, análise de contextos e revisão estratégica.",
    screenshot: "assets/screenshots/enem.png",
    repo: "https://github.com/Bio-Tech-Edu/enem"
  },
  {
    title: "Org",
    type: "REA",
    summary: "Jornada interativa com cientistas brasileiras, missões, simulações e desafios em formato de aprendizagem imersiva.",
    description: "A proposta utiliza narrativa, interatividade e avaliação formativa para ampliar o engajamento e estimular o raciocínio científico.",
    screenshot: "assets/screenshots/org.png",
    repo: "https://github.com/Bio-Tech-Edu/org"
  },
  {
    title: "Genética Mendeliana: Explorando a análise de dados genéticos",
    type: "OAD",
    summary: "É um kit pedagógico modelo (editável): plano de aula; atividade prática em planilha e design gráfico web interativo (Canva Presentation/Document).",
    description: "Capacitar os alunos a compreenderem os princípios básicos da Genética Mendeliana, incluindo a primeira e a segunda lei de Mendel, e a analisar dados genéticos utilizando ferramentas computacionais, de acordo com a Base Nacional Comum Curricular (BNCC) e seu complemento.",
    screenshot: "assets/screenshots/kit_p_002.png",
    link: "https://canva.link/5u59sg358jzkuio"
  }
];

const projectGrid = document.getElementById("project-grid");
const filterButtons = document.querySelectorAll(".filter");

function renderProjects(filter = "all") {
  projectGrid.innerHTML = "";

  const filtered = filter === "all"
    ? projects
    : projects.filter((project) => project.type === filter);

  filtered.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.innerHTML = `
      <div class="project-thumb">
        <img src="${project.screenshot}" alt="${project.title} screenshot" />
      </div>
      <div class="project-content">
        <span class="project-tag">${project.type}</span>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <p>${project.description}</p>
        <div class="project-actions">
          <a class="link-btn primary" href="${project.repo}" target="_blank" rel="noreferrer">Repositório</a>
          <a class="link-btn primary" href="${project.link}" target="_blank" rel="noreferrer">Acesso</a>
        </div>
      </div>
    `;
    projectGrid.appendChild(card);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    renderProjects(button.dataset.filter);
  });
});

renderProjects();
