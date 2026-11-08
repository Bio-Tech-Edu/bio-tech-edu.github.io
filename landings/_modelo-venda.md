---
# MODELO: venda de um produto ou serviço educacional.
# Copie para landings/<slug>.md. O nome do arquivo deve ser igual ao slug.
# Antes de publicar, confira as informações de venda e o direito de arrependimento com a assessoria jurídica.

slug: "exemplo-do-produto"            # obrigatório: deve existir em data/projects.json
title: "Nome do produto ou serviço"   # obrigatório
modo: "venda"                         # obrigatório neste modelo
resumo: "Uma ou duas frases: o que a pessoa recebe e para quem é."   # obrigatório
tipo: "RED"                           # OAD, REA ou RED (padrão: o tipo do catálogo)
publico: ["Professores de Ciências"]  # opcional
habilidades: ["EM13CNT204"]           # códigos BNCC, opcional
habilidades_computacao: []            # opcional
licenca: "Uso pessoal; reprodução proibida"   # condições de uso, recomendado

preco: "R$ 49,90"                     # obrigatório: valor exibido (texto)
preco_obs: "pagamento único, acesso vitalício"   # opcional: texto ao lado do preço
checkout: "https://plataforma.exemplo.com/produto"   # obrigatório: link de pagamento (https)
cta_texto: "Quero este material"      # texto do botão principal (opcional)

vendedor: "Nome ou razão social de quem vende"   # obrigatório (identificação do fornecedor)
vendedor_contato: "contato@exemplo.com"          # obrigatório: canal de atendimento
vendedor_documento: ""                # CNPJ (ou CPF, se exigido). Opcional: publique só o necessário

arrependimento_dias: 7                # mínimo 7 em compras online (art. 49 do CDC)
garantia: "Texto da garantia, se houver. Ex.: reembolso integral em 30 dias, sem perguntas."   # opcional

inclui:                               # o que a pessoa recebe (lista)
  - "Plano de aula completo em PDF"
  - "Planilha de atividades"
  - "Atualizações do material por 12 meses"

faq:                                  # perguntas frequentes (opcional)
  - pergunta: "Como recebo o material?"
    resposta: "Logo após a confirmação do pagamento, pelo e-mail informado na compra."
  - pergunta: "Posso usar em mais de uma turma?"
    resposta: "Sim, dentro das condições de uso descritas acima."

imagem_alt: "Descreva a capa ou a captura do produto."   # recomendado (acessibilidade)
# imagem: assets/img/screenshots/exemplo.webp          # opcional
---

## Sobre o produto

Apresente o produto em markdown: contexto, problema que resolve e resultado esperado para o professor ou estudante.

## Para quem é

Descreva o público e as situações de uso.

## Como funciona a entrega

Explique como e quando a pessoa recebe o acesso ou o material.
