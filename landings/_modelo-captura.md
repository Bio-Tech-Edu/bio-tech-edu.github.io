---
# MODELO: página de captura para um material gratuito (lead magnet).
# Base: modelos_de_landing_page_setor_educacional.md, Modelo 2.
#
# COMO USAR
# 1. Copie este arquivo para landings/<slug>.md (o nome do arquivo deve ser igual ao slug).
# 2. Coloque o material gratuito no repositório (ex.: assets/downloads/kit-planejamento.pdf).
#    O build só gera a página se o arquivo existir.
# 3. Substitua TODOS os marcadores de texto entre colchetes duplos. Enquanto restar algum, o build recusa a página.
# 4. O formulário envia os dados ao serviço indicado em "formulario.endpoint" e, depois do envio,
#    redireciona a pessoa para o material. Configure esse serviço antes de publicar.
# 5. Publique somente depois da revisão jurídica (ver docs/GUIA-LANDING-PAGES.md, seção 13).

catalogo: false
slug: "kit-planejamento-escolar"
title: "Kit Executivo de Planejamento Escolar Integrado"
modo: "captura"
cabecalho: "simples"              # sem menu do site, para manter o foco na conversão
selo: "Guia prático gratuito"
resumo: "Um conjunto de ferramentas editáveis para alinhar gestão, corpo docente, AEE e equipe técnica no início ou na reorganização do ano letivo."
cta_texto: "Baixar kit gratuito agora"
# imagem: "assets/img/lp/mockup-kit.webp"   # opcional: mockup das pranchas e planilhas do kit
# imagem_alt: "Descrição do mockup do kit."
vendedor: "[[NOME DO RESPONSÁVEL OU DA ORGANIZAÇÃO]]"
vendedor_contato: "[[E-MAIL DE CONTATO]]"

formulario:
  posicao: "topo"                  # o formulário fica ao lado do título, como no modelo
  endpoint: "[[LINK HTTPS DO SERVIÇO QUE RECEBE O FORMULÁRIO]]"
  arquivo: "assets/downloads/[[NOME-DO-ARQUIVO]].pdf"   # o material gratuito; deve existir no repositório
  titulo: "Solicite agora seu kit"
  botao: "Garanta seu kit gratuito"
  comunicacoes: "Quero receber dicas e novidades por e-mail."   # opcional; use "" para não exibir
  # campos: opcional. Se omitido, o formulário usa nome, e-mail e função na educação.

blocos:
  - tipo: "cards"
    titulo: "O que você vai receber no kit"
    itens:
      - icone: "📋"
        titulo: "Template de plano executivo de aula"
        texto: "Modelo otimizado para professores e licenciandos."
      - icone: "♿"
        titulo: "Checklist de articulação entre sala regular e AEE"
        texto: "Roteiro prático para mapear adaptações curriculares."
      - icone: "🔬"
        titulo: "Roteiro de organização de laboratórios"
        texto: "Guia rápido de segurança e preparação de insumos para técnicos."
      - icone: "📝"
        titulo: "Matriz de alinhamento administrativo"
        texto: "Fluxo de rotinas de atendimento e suporte escolar para assistentes e técnicos administrativos."

  - tipo: "cards"
    titulo: "Quem deve baixar este material"
    itens:
      - icone: "👩‍🏫"
        titulo: "Professores e estagiários"
        texto: "Querem economizar tempo no planejamento e focar no ensino."
      - icone: "🏫"
        titulo: "Gestores e coordenadores"
        texto: "Buscam alinhar toda a equipe com uma comunicação padronizada."
      - icone: "♿"
        titulo: "Especialistas em AEE"
        texto: "Precisam integrar o plano individual à rotina diária da escola."
      - icone: "🏢"
        titulo: "Técnicos e assistentes"
        texto: "Desejam clareza em seus fluxos operacionais e administrativos."

  - tipo: "texto"
    titulo: "Sobre quem desenvolveu o conteúdo"
    texto: "Desenvolvido por uma equipe multidisciplinar de pedagogos, gestores públicos e especialistas em tecnologia educacional, com foco em transformar a gestão prática nas escolas brasileiras."

  - tipo: "formulario"

cta_final:
  titulo: "Transforme a rotina da sua escola a partir de hoje."
  texto: "Baixe o material gratuito e compartilhe com os seus colegas de equipe."
  botao: "Garanta seu kit gratuito"
---

Use este espaço para explicar, em uma ou duas frases, como usar o kit no início do ano letivo. Você pode apagar esta seção.
