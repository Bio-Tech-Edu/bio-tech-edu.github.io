// script.js — injeta os projetos na página
const projects = [
  {
    id: 'pre-enem-quimica',
    title: 'Pre‑ENEM — Química',
    repo: 'https://github.com/Bio-Tech-Edu/pre-enem-quimica',
    screenshot: 'assets/screenshots/pre-enem-quimica.svg',
    summary: 'Produto educacional para preparação ao ENEM com foco em Química. Conteúdo estruturado por competências, exercícios e explicações passo a passo.',
    pedagogy: 'Metodologias: ensino por problemas, exercícios comentados, foco em aplicação de conceitos. Público: estudantes do ensino médio preparando-se para o ENEM.'
  },
  {
    id: 'chemical-royale',
    title: 'Chemical Royale',
    repo: 'https://github.com/Bio-Tech-Edu/chemical-royale',
    screenshot: 'assets/screenshots/chemical-royale.svg',
    summary: 'Jogo educativo gamificado que explora conceitos de química através de desafios e narrativa (storytelling).',
    pedagogy: 'Metodologias: gamificação e storytelling para engajamento cognitivo; há feedback imediato e progressão de desafios.'
  },
  {
    id: 'termoquimica',
    title: 'Termoquímica — Simulador',
    repo: 'https://github.com/Bio-Tech-Edu/termoquimica',
    screenshot: 'assets/screenshots/termoquimica.svg',
    summary: 'Simulador interativo sobre energia e transformações térmicas em reações químicas.',
    pedagogy: 'Metodologias: modelagem e simulação para construção de modelos conceituais; ideal para experimentação virtual em aulas remotas.'
  },
  {
    id: 'solucoes',
    title: 'Soluções — Gamificado',
    repo: 'https://github.com/Bio-Tech-Edu/solucoes',
    screenshot: 'assets/screenshots/solucoes.svg',
    summary: 'Recurso gamificado sobre soluções e concentrações químicas para suporte à aprendizagem ativa.',
    pedagogy: 'Metodologias: desafios práticos, orientação por feedback e scaffolding de tarefas; fomenta habilidades de resolução de problemas.'
  },
  {
    id: 'chemical-royale-v2',
    title: 'Chemical Royale — v2',
    repo: 'https://github.com/Bio-Tech-Edu/chemical-royale-v2',
    screenshot: 'assets/screenshots/chemical-royale-v2.svg',
    summary: 'Evolução do jogo Chemical Royale com melhorias em interface e mecânicas de jogo.',
    pedagogy: 'Atualização com foco em usabilidade e potencial para uso em oficinas educacionais e competições de aprendizagem.'
  },
  {
    id: 'cinetica',
    title: 'Cinética — Simulador',
    repo: 'https://github.com/Bio-Tech-Edu/cinetica',
    screenshot: 'assets/screenshots/cinetica.svg',
    summary: 'Ferramenta interativa para explorar velocidade de reação e fatores que influenciam cinética química.',
    pedagogy: 'Permite visualização de experimentos virtuais e análise de gráficos para desenvolver pensamento científico.'
  },
  {
    id: 'equilibrio',
    title: 'Equilíbrio Químico',
    repo: 'https://github.com/Bio-Tech-Edu/equilibrio',
    screenshot: 'assets/screenshots/equilibrio.svg',
    summary: 'Módulo sobre equilíbrio químico com atividades práticas e problemas contextualizados.',
    pedagogy: 'Foco em raciocínio quantitativo, interpretação de resultados e aplicação em situações experimentais.'
  },
  {
    id: 'eletroquimica',
    title: 'Eletroquímica',
    repo: 'https://github.com/Bio-Tech-Edu/eletroquimica',
    screenshot: 'assets/screenshots/eletroquimica.svg',
    summary: 'Conjunto de atividades e simuladores sobre reações de oxirredução e dispositivos eletroquímicos.',
    pedagogy: 'Atividades experimentais virtuais que aproximam conceitos teóricos à prática tecnológica.'
  },
  {
    id: 'enem',
    title: 'ENEM — Repertório',
    repo: 'https://github.com/Bio-Tech-Edu/enem',
    screenshot: 'assets/screenshots/enem.svg',
    summary: 'Aulão e materiais de apoio voltados ao repertório de Ciências da Natureza no ENEM.',
    pedagogy: 'Materiais expositivos, exercícios comentados e estratégias de resolução de provas para uso em sala e revisão.'
  },
  {
    id: 'meu_dia_em_passos',
    title: 'Meu Dia em Passos — Planner',
    repo: 'https://github.com/Bio-Tech-Edu/meu_dia_em_passos',
    screenshot: 'assets/screenshots/meu_dia_em_passos.svg',
    summary: 'Planner educativo em formatos PDF e web para organização do estudo e rotina.',
    pedagogy: 'Ferramenta metacognitiva para planejamento, autorregulação e acompanhamento de tarefas de estudo.'
  },
  {
    id: 'org',
    title: 'Jornada Interativa — Org',
    repo: 'https://github.com/Bio-Tech-Edu/org',
    screenshot: 'assets/screenshots/org.svg',
    summary: 'Jornada interativa com cientistas brasileiras, missões, simuladores e desafios estilo ENEM.',
    pedagogy: 'Narrativa guiada, missões laboratoriais e avaliações formativas com feedback instrucional.'
  },
  {
    id: 'site',
    title: 'Portal — site',
    repo: 'https://github.com/Bio-Tech-Edu/site',
    screenshot: 'assets/screenshots/site.svg',
    summary: 'Portal que apresenta o portfólio de objetos de aprendizagem digitais da Bio‑Tech‑Edu.',
    pedagogy: 'Portal institucional para curadoria de recursos, acesso rápido por público educacional e professores.'
  }
];

function el(tag,cls){const e=document.createElement(tag);if(cls)e.className=cls;return e}

const container=document.getElementById('projects')
projects.forEach(p=>{
  const card=el('article','card')
  const shot=el('div','screenshot')
  const img=document.createElement('img')
  img.src=p.screenshot
  img.alt=p.title+' — screenshot'
  img.style.width='100%'
  img.style.height='100%'
  img.style.objectFit='cover'
  shot.appendChild(img)
  card.appendChild(shot)

  const h=el('h3')
  h.textContent=p.title
  card.appendChild(h)

  const desc=el('p','desc')
  desc.textContent=p.summary
  card.appendChild(desc)

  const ped=el('p','desc')
  ped.innerHTML = '<strong>Técnico‑pedagógico:</strong> '+p.pedagogy
  card.appendChild(ped)

  const tags=el('div','tags')
  tags.innerHTML = '<span class="tag">OAD / REA / RED</span><span class="tag">Ciências da Natureza</span><span class="tag">Ensino Médio</span>'
  card.appendChild(tags)

  const actions=el('div','actions')
  const a=el('a','btn')
  a.href=p.repo
  a.target='_blank'
  a.textContent='Abrir repositório'
  actions.appendChild(a)
  const b=el('a','btn ghost')
  b.href=p.screenshot
  b.target='_blank'
  b.textContent='Abrir screenshot'
  actions.appendChild(b)
  card.appendChild(actions)

  container.appendChild(card)
})
