---
# MODELO: página de proposta para um serviço educacional (ex.: Projeto Executivo Educacional).
# Base: modelos_de_landing_page_setor_educacional.md, Modelo 1.
#
# COMO USAR
# 1. Copie este arquivo para landings/<slug>.md (o nome do arquivo deve ser igual ao slug).
# 2. Substitua TODOS os marcadores de texto entre colchetes duplos por informação real.
#    Enquanto restar algum marcador, o build recusa a página e aponta a linha.
# 3. Apague os campos que não se aplicam. Campos opcionais estão indicados como "opcional".
# 4. Prova social (números, depoimentos) só entra com dados verificáveis e autorização por escrito.
# 5. Publique somente depois da revisão jurídica (ver docs/GUIA-LANDING-PAGES.md, seção 13).

catalogo: false
slug: "projeto-executivo-educacional"
title: "Projeto Executivo Educacional"
modo: "proposta"
selo: "Para escolas e redes de ensino"
resumo: "A metodologia que conecta gestão escolar, corpo docente, apoio administrativo e AEE em um ecossistema integrado, prático e orientado a resultados."
cta_texto: "Solicitar apresentação executiva"
prova_social: "[[NÚMERO]] instituições atendidas e [[NÚMERO]] estudantes impactados, dados de [[ANO]]"   # opcional; sem dado real, apague o campo
# imagem: "assets/img/lp/matriz-projeto-executivo.webp"   # opcional: mockup da matriz de fluxo
# imagem_alt: "Descrição do mockup: o que aparece e o que representa."
vendedor: "[[NOME OU RAZÃO SOCIAL]]"
vendedor_contato: "[[E-MAIL OU WHATSAPP DE ATENDIMENTO]]"
vendedor_documento: "[[CNPJ]]"   # opcional em modelos sem CNPJ; não publique CPF sem necessidade

formulario:
  # posicao: "topo"   # opcional: "topo" coloca o formulário ao lado do título; padrão: formulário no fim da página
  endpoint: "[[LINK HTTPS DO SERVIÇO QUE RECEBE O FORMULÁRIO]]"
  titulo: "Leve a excelência executiva para a sua instituição"
  botao: "Solicitar proposta personalizada"
  comunicacoes: "Quero receber novidades e materiais por e-mail."   # opcional; use "" para não exibir
  # consentimento: "texto próprio do aceite"   # opcional; há um texto padrão, que cita a política de privacidade
  # campos: opcional. Se omitido, o formulário usa nome, e-mail, WhatsApp, cargo, tipo de instituição e número de alunos.

blocos:
  - tipo: "cards"
    titulo: "Sua instituição enfrenta desarticulação entre as equipes e sobrecarga no dia a dia?"
    itens:
      - icone: "🏫"
        titulo: "Gestores e coordenadores"
        texto: "Dificuldade em alinhar diretrizes pedagógicas com rotinas administrativas e prazos de implementação."
      - icone: "👩‍🏫"
        titulo: "Professores e licenciandos"
        texto: "Sobrecarga de planejamento sem metodologias claras para a recomposição de aprendizagem."
      - icone: "📋"
        titulo: "Técnicos administrativos e assistentes"
        texto: "Desconexão entre os processos de secretaria e apoio e o projeto político-pedagógico."
      - icone: "🔬"
        titulo: "Técnicos de laboratório"
        texto: "Falta de integração entre aulas práticas e o currículo teórico-pedagógico."
      - icone: "♿"
        titulo: "Profissionais de AEE"
        texto: "Desafios na construção e execução articulada do Plano de Desenvolvimento Individual (PDI) com a sala regular."

  - tipo: "cards"
    titulo: "Uma estrutura prática, sistêmica e inclusiva para a sua escola"
    texto: "O projeto funciona como o plano diretor da instituição: mapeia fluxos, padroniza rotinas pedagógicas e administrativas e capacita cada profissional para sua função estratégica."
    itens:
      - titulo: "Articulação pedagógico-administrativa"
        texto: "Integração do secretariado ao apoio docente."
      - titulo: "Inclusão efetiva"
        texto: "Práticas de AEE integradas ao planejamento diário de professores e assistentes."
      - titulo: "Espaços de aprendizagem ativa"
        texto: "Dinamização de laboratórios e ambientes práticos com roteiros executivos."
      - titulo: "Formação continuada e mentoria"
        texto: "Capacitação contínua para estagiários, licenciandos e professores."

  - tipo: "cards"
    titulo: "O que está incluído no projeto executivo"
    itens:
      - titulo: "Matriz executiva de papéis e responsabilidades"
        texto: "Manual claro de atribuições para professores, assistentes, técnicos e equipe de apoio."
      - titulo: "Plano integrado de inclusão e AEE"
        texto: "Protocolos de alinhamento entre sala de recursos, atendimento especializado e professores regentes."
      - titulo: "Guia de gestão de laboratórios e ambientes práticos"
        texto: "Manual executivo para técnicos e docentes organizarem aulas experimentais com segurança e eficiência."
      - titulo: "Fluxograma de processos administrativo-pedagógicos"
        texto: "Padronização de registros, frequência, avaliações e relatórios para a secretaria e a assistência escolar."
      - titulo: "Programa de estágio e licenciatura integrado"
        texto: "Matriz de acolhimento e desenvolvimento para licenciandos e estagiários no ambiente escolar."
      - titulo: "Painel de monitoramento de aprendizagem"
        texto: "Indicadores para a coordenação pedagógica e a gestão escolar."

  - tipo: "depoimentos"
    titulo: "O impacto na voz de quem faz a educação acontecer"
    # Use apenas depoimentos reais, autorizados por escrito. Sem depoimento autorizado, apague este bloco.
    itens:
      - nome: "[[NOME DA PESSOA]]"
        cargo: "[[CARGO E INSTITUIÇÃO]]"
        texto: "[[DEPOIMENTO REAL, COM AUTORIZAÇÃO]]"
        autorizacao: false   # troque para true somente com autorização registrada

  - tipo: "passos"
    titulo: "Como funciona a implementação"
    itens:
      - titulo: "Diagnóstico escolar 360°"
        texto: "Mapeamento de necessidades com os segmentos do corpo docente e técnico."
      - titulo: "Desenho do projeto executivo"
        texto: "Personalização dos cadernos de encargos pedagógicos e administrativos."
      - titulo: "Formação e imersão das equipes"
        texto: "Capacitação prática dividida por funções: gestão, AEE, laboratório, sala de aula e apoio."
      - titulo: "Acompanhamento e ajuste de rota"
        texto: "Monitoramento mensal da execução e suporte técnico aos gestores."

  - tipo: "formulario"   # opcional: posiciona o formulário nesta ordem. Sem este bloco, ele vai ao fim da página.

faq:
  - pergunta: "O projeto executivo atende escolas públicas e privadas?"
    resposta: "Sim. A metodologia é adaptável às exigências da BNCC, da LDB e às especificidades das redes estaduais, municipais e particulares."
  - pergunta: "Como o projeto contempla estagiários e técnicos administrativos?"
    resposta: "Há roteiros de trabalho específicos que esclarecem o papel de apoio pedagógico e operacional de cada função."

cta_final:
  titulo: "Transforme a gestão da sua escola a partir de hoje."
  texto: "Solicite um diagnóstico preliminar e o escopo do projeto."
  botao: "Solicitar proposta personalizada"
---

## Como esta proposta é preparada

Descreva aqui, em markdown, o contexto da instituição, a forma de diagnóstico e o que a proposta inclui. Este texto aparece depois dos blocos e antes do formulário.

Você pode usar listas, links e negrito. Para links internos, use `../termos.html` ou `../privacidade.html`.
