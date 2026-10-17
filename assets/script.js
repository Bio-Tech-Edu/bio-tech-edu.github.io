const projects = [
  {
    title: "Pre-ENEM Química",
    type: "OAD",
    summary: "Produto educacional para preparação ao ENEM com foco em Química e desenvolvimento de competências em leitura, raciocínio e aplicação de conceitos.",
    description: "A proposta articula explicações conceituais, exercícios orientados e repertório de conteúdos alinhado ao perfil da avaliação do ENEM.",
    screenshot: "assets/screenshots/pre-enem-quimica.svg",
    repo: "https://github.com/Bio-Tech-Edu/pre-enem-quimica"
  },
  {
    title: "Chemical Royale",
    type: "REA",
    summary: "Jogo educativo gamificado que explora Química por meio de narrativa, desafios e progressão de níveis com feedback imediato.",
    description: "A estratégia combina storytelling e aprendizagem ativa para ampliar o engajamento e favorecer a retenção de conceitos científicos.",
    screenshot: "assets/screenshots/chemical-royale.svg",
    repo: "https://github.com/Bio-Tech-Edu/chemical-royale"
  },
  {
    title: "Termoquímica",
    type: "OAD",
    summary: "Recurso digital para estudo de energia em reações químicas, calor, entalpia e sua relação com transformações físicas e químicas.",
    description: "O objeto contribui para a modelagem conceitual por meio de explicações visuais e contextos voltados à investigação e à interpretação.",
    screenshot: "assets/screenshots/termoquimica.svg",
    repo: "https://github.com/Bio-Tech-Edu/termoquimica"
  },
  {
    title: "Soluções",
    type: "REA",
    summary: "Recurso educacional aberto sobre soluções químicas com abordagem lúdica, sequências didáticas e desenvolvimento de raciocínio quantitativo.",
    description: "O material favorece o entendimento de concentrações, propriedades e aplicações práticas em contextos do cotidiano e do ensino científico.",
    screenshot: "assets/screenshots/solucoes.svg",
    repo: "https://github.com/Bio-Tech-Edu/solucoes"
  },
  {
    title: "Chemical Royale v2",
    type: "RED",
    summary: "Versão aprimorada do jogo educativo com refinamento de interface, ux e mecânicas de interação para uso em ambientes pedagógicos.",
    description: "A atualização amplia a capacidade de uso em sala de aula e oficinas, melhorando experiência, dinâmica e alinhamento à prática docente.",
    screenshot: "assets/screenshots/chemical-royale-v2.svg",
    repo: "https://github.com/Bio-Tech-Edu/chemical-royale-v2"
  },
  {
    title: "Cinética",
    type: "OAD",
    summary: "Material interativo para exploração de velocidade de reação e fatores que influenciam a rapidez dos processos químicos.",
    description: "A proposta permite a análise de variáveis, interpretação de gráficos e construção de explicações científicas a partir de observações.",
    screenshot: "assets/screenshots/cinetica.svg",
    repo: "https://github.com/Bio-Tech-Edu/cinetica"
  },
  {
    title: "Equilíbrio",
    type: "RED",
    summary: "Recurso digital voltado ao estudo do equilíbrio químico e à compreensão de grandezas, reações reversíveis e estabilidade do sistema.",
    description: "A abordagem favorece o raciocínio quantitativo e a leitura de resultados em contextos de experimentação e modelagem conceitual.",
    screenshot: "assets/screenshots/equilibrio.svg",
    repo: "https://github.com/Bio-Tech-Edu/equilibrio"
  },
  {
    title: "Eletroquímica",
    type: "OAD",
    summary: "Material para estudo de reações de oxirredução, células eletroquímicas e processos que conectam teoria e aplicações tecnológicas.",
    description: "A estrutura didática prioriza relação entre fenômenos químicos e contexto tecnológico, ampliando a compreensão científica e aplicada.",
    screenshot: "assets/screenshots/eletroquimica.svg",
    repo: "https://github.com/Bio-Tech-Edu/eletroquimica"
  },
  {
    title: "ENEM",
    type: "REA",
    summary: "Aulão e materiais de apoio para revisão de Ciências da Natureza com foco em repertório e estratégias de resolução de provas.",
    description: "O recurso apoia a preparação para o ENEM por meio de abordagem orientada para competências, análise de contextos e revisão estratégica.",
    screenshot: "assets/screenshots/enem.svg",
    repo: "https://github.com/Bio-Tech-Edu/enem"
  },
  {
    title: "Meu Dia em Passos",
    type: "RED",
    summary: "Planner educativo em versões web e impressa para organização do estudo, rotina e autorregulação do aprendizado.",
    description: "A ferramenta conecta planejamento, produtividade e metacognição, oferecendo suporte prático para estudantes e professores.",
    screenshot: "assets/screenshots/meu_dia_em_passos.svg",
    repo: "https://github.com/Bio-Tech-Edu/meu_dia_em_passos"
  },
  {
    title: "Org",
    type: "OAD",
    summary: "Jornada interativa com cientistas brasileiras, missões, simulações e desafios em formato de aprendizagem imersiva.",
    description: "A proposta utiliza narrativa, interatividade e avaliação formativa para ampliar o engajamento e estimular o raciocínio científico.",
    screenshot: "assets/screenshots/org.svg",
    repo: "https://github.com/Bio-Tech-Edu/org"
  },
  {
    title: "Portal Bio-Tech-Edu",
    type: "RED",
    summary: "Portal institucional para apresentação e organização do portfólio de recursos digitais desenvolvidos pela marca.",
    description: "A interface funciona como curadoria de projetos, favorecendo acesso, visibilidade e organização do ecossistema educacional da marca.",
    screenshot: "assets/screenshots/site.svg",
    repo: "https://github.com/Bio-Tech-Edu/site"
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
          <a class="link-btn" href="${project.screenshot}" target="_blank" rel="noreferrer">Screenshot</a>
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
