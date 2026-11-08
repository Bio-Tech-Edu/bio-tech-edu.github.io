---
# MODELO: apresentação gratuita de um produto educacional.
# Copie para landings/<slug>.md. O nome do arquivo deve ser igual ao slug.
# O slug precisa existir em data/projects.json (campo "slug" do produto).

slug: "exemplo-do-produto"            # obrigatório: minúsculas, números e hífen
title: "Nome do produto educacional"   # obrigatório
modo: "gratuito"                       # gratuito (padrão) ou venda
resumo: "Uma ou duas frases: o que o estudante faz e aprende."   # obrigatório
tipo: "REA"                            # OAD, REA ou RED (padrão: o tipo do catálogo)
publico: ["Professores", "Estudantes universitários", "Estagiários"]   # opcional
habilidades: ["EM13CN01"]              # códigos BNCC, opcional
habilidades_computacao: []             # códigos BNCC Computação, opcional
acesso: "https://exemplo.com/recurso"  # link para usar o recurso (https). Opcional se houver repositorio
repositorio: "https://github.com/Bio-Tech-Edu/exemplo"   # código-fonte (https). Opcional se houver acesso
cta_texto: "Acessar o recurso"         # texto do botão principal (opcional)
licenca: "CC BY-SA 4.0"                # licença do recurso. Recomendado: o build avisa quando falta
imagem_alt: "Descreva a captura: o que aparece nela e para que serve."   # recomendado (acessibilidade)
# imagem: assets/img/screenshots/exemplo.webp   # opcional; padrão: a captura do catálogo
---

## Sobre o recurso

Escreva aqui a apresentação do produto em markdown. Títulos ## e ### formam a estrutura da página.

Você pode usar listas, links e imagens. Para imagens do repositório, use o caminho a partir da raiz, por exemplo `assets/img/blog/figura.webp`.

## Como usar em sala de aula

Descreva a sequência de uso: antes, durante e depois da atividade.

## Habilidades trabalhadas

Explique em uma ou duas frases como o recurso favorece as habilidades listadas acima.
