# Guia: landing pages dos produtos educacionais

Este guia explica como criar e manter a página de cada produto educacional, a que abre quando o visitante clica em **Ver detalhes** no catálogo. Você escreve em markdown, como faz com o blog, e o build gera o HTML.

## 1. Visão geral

Este guia cobre dois tipos de página: as landing pages dos produtos do catálogo (seções 2 a 11) e as páginas avulsas, fora do catálogo, para propostas comerciais e kits gratuitos (seção 12). A seção 13 traz a revisão jurídica e a LGPD, que valem para as páginas com venda ou captura de dados.

Para os produtos do catálogo:

No catálogo (`index.html`), cada card tem o botão **Ver detalhes**. Ele leva à landing page do produto, em `recursos/<slug>.html`. Essa página apresenta o recurso e traz o botão de acesso (gratuito) ou de compra (venda).

Há dois modos:

| Modo | Para quê | Botão principal |
|---|---|---|
| `gratuito` (padrão) | Apresentar um recurso aberto, sem cobrança | Acessar o recurso (ou Ver no GitHub, se não houver link de acesso) |
| `venda` | Vender um produto ou serviço educacional | Quero este material, com preço, garantia e informações de compra |

## 2. Onde fica cada coisa

```
data/projects.json          catálogo: um objeto por produto. O campo "slug" liga o card à landing.
landings/                   suas fontes em markdown: uma por produto, com o nome igual ao slug
  _modelo-gratuito.md       modelo comentado para apresentação gratuita (copie, não é publicado)
  _modelo-venda.md          modelo comentado para venda (copie, não é publicado)
  termoquimica.md           exemplo de fonte já pronta
  _modelo-proposta.md       modelo de página de proposta comercial (formulário; sem pagamento)
  _modelo-captura.md        modelo de página de kit gratuito (formulário e download)
recursos/                   páginas GERADAS dos produtos do catálogo. Não edite à mão.
lp/                         páginas GERADAS das landing pages avulsas (propostas e kits). Não edite à mão.
assets/css/landing.css      estilo das landing pages (não altera as outras páginas)
scripts/build-landings.mjs  o gerador: lê landings/ e escreve recursos/
scripts/lib/site.mjs        partes comuns (cabeçalho, rodapé, markdown) usadas pelos geradores
```

Regra principal: **você edita `landings/` e `data/projects.json`. Os arquivos em `recursos/` são recriados a cada build.**

## 3. Criar a landing de um produto novo

1. **Cadastre o produto no catálogo.** Em `data/projects.json`, adicione um objeto com `slug`, `title`, `type`, `summary`, `description`, `screenshot` e, se houver, `repo` e `link`. Use o mesmo `slug` que será usado no passo 2.
2. **Copie o modelo.** Para um recurso gratuito, copie `landings/_modelo-gratuito.md` para `landings/<slug>.md`. Para venda, copie `_modelo-venda.md`.
3. **Preencha o cabeçalho** (a parte entre as linhas `---`). Os campos estão descritos na seção 4.
4. **Escreva o corpo** em markdown, abaixo do segundo `---` (seção 5).
5. **Gere e confira localmente** (seção 7).
6. **Publique** (seção 8).

O nome do arquivo deve ser exatamente igual ao `slug`. Exemplo: `slug: "cinetica"` gera `landings/cinetica.md` e a página `recursos/cinetica.html`.

## 4. Campos do cabeçalho

### Campos para os dois modos

| Campo | Obrigatório | Descrição |
|---|---|---|
| `slug` | sim | Minúsculas, números e hífen. Deve existir em `data/projects.json` e ser igual ao nome do arquivo. |
| `title` | sim | Nome do produto, exibido como título da página. |
| `resumo` | sim | Uma ou duas frases: o que o estudante faz e aprende. Aparece como subtítulo e na descrição da página. |
| `modo` | não | `gratuito` (padrão) ou `venda`. |
| `tipo` | não | `OAD`, `REA` ou `RED`. Se omitido, usa o tipo do catálogo. |
| `publico` | não | Lista de públicos, por exemplo `["Professores", "Estagiários"]`. |
| `habilidades` | não | Códigos da BNCC, por exemplo `["EM13CN01"]`. |
| `habilidades_computacao` | não | Códigos da BNCC Computação. |
| `licenca` | recomendado | Licença ou condições de uso. O build avisa quando falta. |
| `imagem_alt` | recomendado | Descrição da imagem para leitores de tela. O build avisa quando falta. |
| `imagem` | não | Caminho de outra imagem, a partir da raiz. Se omitido, usa a captura do catálogo. |
| `cta_texto` | não | Texto do botão principal. |

### Campos do modo gratuito

| Campo | Obrigatório | Descrição |
|---|---|---|
| `acesso` | um dos dois | Link para usar o recurso (começa com `https://`). |
| `repositorio` | um dos dois | Link do código-fonte no GitHub. Se houver `acesso`, aparece como botão secundário. |

### Campos do modo venda

| Campo | Obrigatório | Descrição |
|---|---|---|
| `preco` | sim | Valor como texto, por exemplo `"R$ 49,90"`. |
| `preco_obs` | não | Texto ao lado do preço, por exemplo `"pagamento único, acesso vitalício"`. |
| `checkout` | sim | Link da plataforma de pagamento (começa com `https://`). |
| `vendedor` | sim | Nome ou razão social de quem vende. |
| `vendedor_contato` | sim | Canal de atendimento: e-mail ou WhatsApp. |
| `vendedor_documento` | não | CNPJ, ou CPF se for exigido. Publique só o necessário. |
| `arrependimento_dias` | não | Padrão e mínimo: 7 dias, conforme o art. 49 do CDC. O build não aceita valor menor. |
| `garantia` | não | Texto da garantia, se houver. Só prometa o que você cumpre. |
| `inclui` | não | Lista do que a pessoa recebe. |
| `faq` | não | Lista de perguntas e respostas, com `pergunta` e `resposta` em cada item. |

Modelo do `faq`:

```yaml
faq:
  - pergunta: "Como recebo o material?"
    resposta: "Logo após a confirmação do pagamento, pelo e-mail informado na compra."
```

Os textos entre aspas são seguros. Se um valor contiver dois-pontos (`:`) ou `#`, mantenha as aspas.

## 5. Escrever o corpo da página

O corpo é markdown comum:

- `## Título` vira seção da página. Use `##` para seções e `###` para subseções. Esses títulos formam o sumário, quando houver três ou mais.
- Listas, negrito, itálico e links funcionam normalmente.
- Imagens do repositório são citadas a partir da raiz, por exemplo `![Descrição](assets/img/blog/figura.webp)`. O build ajusta o caminho.
- Links para outras páginas do site: `../blog.html`, `../index.html#projetos`, `../privacidade.html`.
- Use títulos e textos claros nos links. Evite "clique aqui".

**Boas práticas do conteúdo:**

- Não prometa resultados de aprendizagem que não foram medidos.
- Não publique depoimentos de pessoas que não existem ou que não autorizaram.
- Cite fontes ao apresentar dados científicos ou normativos (como a BNCC, com o código da habilidade).
- Não inclua dados pessoais de estudantes, nem imagens em que alguém possa ser identificado sem autorização.

## 6. O que o build verifica

O build não para por causa de um arquivo com erro: gera os demais e aponta o problema com arquivo e linha. Mensagens comuns:

| Mensagem | O que fazer |
|---|---|
| `nenhum produto com slug "x" em data/projects.json` | Cadastre o produto no catálogo ou corrija o `slug`. |
| `o slug deve ser igual ao nome do arquivo` | Renomeie o arquivo para `<slug>.md`, ou ajuste o `slug`. |
| `modo gratuito precisa de "acesso" ou "repositorio"` | Informe pelo menos um dos dois links. |
| `modo venda precisa do campo "..."` | Preencha o campo indicado (veja a seção 4). |
| `"arrependimento_dias" deve ser 7 ou mais` | Use 7 ou mais. |
| `falta "licenca"` (aviso) | Confirme a licença do recurso e preencha o campo. |
| `falta "imagem_alt"` (aviso) | Descreva a imagem em uma frase. |
| `cabeçalho inválido` | Confira aspas, dois-pontos e recuos do cabeçalho (a parte entre as linhas `---`). |

Além disso, o `npm test` verifica se cada produto do catálogo tem a sua landing page. Se faltar, o teste aponta qual slug precisa do arquivo.

## 7. Gerar e conferir localmente

```
npm ci                       # só na primeira vez
npm run build:landings       # gera recursos/ a partir de landings/
npm test                     # build completo + verificação de links, imagens, IDs e comentários
python3 -m http.server 8000  # servidor local
```

Abra http://localhost:8000/index.html, clique em **Ver detalhes** de um card e confira a página. Teste também em largura de celular e com o teclado (Tab).

Não abra o arquivo direto pelo explorador de arquivos: o site carrega dados em JSON e não funciona sem servidor.

## 8. Publicar

1. Crie uma branch: `git checkout -b landing-<slug>`.
2. Faça o commit das fontes (`landings/`, `data/projects.json`, eventualmente `assets/img/`). **Não é preciso commitar `recursos/` à mão**: o workflow gera e commita.
3. Envie a branch e abra o pull request para `main`.
4. Aguarde o check **Gerar blog e validar site** ficar verde.
5. Faça o merge. Em cerca de um minuto, o workflow regenera `recursos/` e o GitHub Pages publica.

Antes do merge, confira no pull request se os arquivos alterados são os esperados.

## 9. Checklist antes de publicar

- [ ] O `slug` é igual ao nome do arquivo e existe em `data/projects.json`.
- [ ] `resumo` tem uma ou duas frases claras.
- [ ] Há pelo menos um link de acesso ou de código, e ambos começam com `https://`.
- [ ] `licenca` está preenchida e confirmada.
- [ ] `imagem_alt` descreve a imagem.
- [ ] Os códigos BNCC foram conferidos no documento oficial.
- [ ] O `npm test` passa e o `npm run build:landings` não mostra erros.
- [ ] A página foi conferida com teclado, em celular e nos dois temas.

Para o **modo venda**, acrescente:

- [ ] Preço, forma de pagamento e o que está incluído correspondem ao que é entregue.
- [ ] Vendedor e canal de atendimento estão corretos.
- [ ] O direito de arrependimento (7 dias) e a garantia, se houver, foram conferidos.
- [ ] A plataforma de pagamento tem política de privacidade e termos próprios, citados em `termos.html` ou no próprio checkout.
- [ ] A página comercial foi revisada pela assessoria jurídica da instituição, principalmente os textos de garantia e de direito de arrependimento.

## 10. O que não mudou

- A página inicial (`index.html`) mantém a mesma estrutura, incluindo o Hero e o catálogo. Só o destino do botão do card mudou.
- O carrossel, a busca e os filtros do blog não foram alterados.
- Os produtos sem landing page continuam com o comportamento anterior, até que um `slug` seja definido para eles.

## 11. Perguntas frequentes

**Posso ter um produto em venda e outro gratuito?** Sim. O modo é definido em cada landing.

**Posso usar HTML dentro do markdown?** Pode, mas prefira markdown. HTML solto dificulta a manutenção e a acessibilidade.

**A landing de venda processa o pagamento?** Não. O botão leva à plataforma de pagamento indicada em `checkout`. O site não coleta dados de compra.

**Como remover uma landing?** Se o produto continua no catálogo, remova o campo `slug` dele em `data/projects.json` antes de apagar `landings/<slug>.md`, porque o teste exige a landing de todo produto com `slug`. Se o produto também sai do catálogo, remova o objeto inteiro. Depois, rode `npm test`.

## 12. Páginas avulsas: propostas e kits gratuitos

Use uma página avulsa quando a oferta **não é um recurso do catálogo**, por exemplo um serviço de consultoria ou um kit gratuito para captação de contatos. A página fica em `lp/<slug>.html`, sem card no catálogo.

### Como criar

1. Copie `landings/_modelo-proposta.md` (proposta comercial) ou `landings/_modelo-captura.md` (kit gratuito) para `landings/<slug>.md`. O nome do arquivo deve ser igual ao `slug`.
2. Preencha os campos do cabeçalho. Campos com `catalogo: false` não exigem produto no catálogo.
3. **Substitua todos os marcadores** entre colchetes duplos. Enquanto restar algum, o build recusa a página e aponta a linha.
4. Para o kit gratuito, coloque o arquivo em `assets/downloads/` e informe o caminho em `formulario.arquivo`. O build só gera a página se o arquivo existir.
5. Confira localmente com `npm test` e publique como nas outras páginas (seção 8).

### Modos das páginas avulsas

| Modo | Para quê | O que a página faz |
|---|---|---|
| `proposta` | Serviço ou projeto sob solicitação (ex.: Projeto Executivo) | Mostra o desafio, a solução, entregáveis, depoimentos autorizados, etapas e um formulário de proposta |
| `captura` | Material gratuito para captação de contatos | Formulário com aceite; após o envio, a pessoa é levada ao arquivo do material |

Não há pagamento nas páginas avulsas. Para venda com pagamento, use `modo: venda` em um produto do catálogo ou uma página avulsa com o checkout correspondente.

### Blocos da página

A ordem dos blocos em `blocos:` é a ordem da página. Tipos disponíveis:

| Tipo | Conteúdo |
|---|---|
| `cards` | Grade de cartões com `titulo`, `texto` e `icone` (opcional) em cada item |
| `passos` | Lista numerada com `titulo` e `texto` |
| `depoimentos` | Depoimentos com `nome`, `cargo` (opcional), `texto` e `autorizacao: true` |
| `lista` | Lista simples de itens |
| `texto` | Texto em markdown no campo `texto` |
| `formulario` | Posição do formulário dentro da página (opcional) |

Cada bloco pode ter `titulo`. Depois dos blocos, a página mostra, nesta ordem: perguntas frequentes (`faq`), o formulário (se não estiver no topo), a faixa de chamada final (`cta_final`) e os dados do fornecedor.

### Formulário

Campos do bloco `formulario`:

| Campo | Descrição |
|---|---|
| `endpoint` | **Obrigatório.** Link https do serviço que recebe os dados (ex.: um serviço de formulários). |
| `titulo`, `botao` | Título e texto do botão. |
| `posicao` | `topo` coloca o formulário ao lado do título (usado no kit gratuito). Padrão: no fim da página. |
| `campos` | Opcional. Cada campo tem `nome` (minúsculas, números e `_`), `rotulo`, `tipo` (`text`, `email`, `tel`, `number` ou `select`), `obrigatorio` e, no select, `opcoes`. Se omitido, há um conjunto padrão para cada modo. |
| `consentimento` | Texto do aceite obrigatório. Há um texto padrão, que cita a política de privacidade. |
| `comunicacoes` | Caixa opcional e separada para novidades. Use `""` para não exibir. |
| `arquivo` | Só no kit gratuito: o material. Após o envio, a pessoa é redirecionada para ele. |
| `redirecionar` | Opcional: outra página https para onde ir depois do envio. |

Cada página tem um campo oculto de origem (`origem`, com o slug) e um campo de proteção contra robôs (que o visitante não vê). O serviço de formulário precisa aceitar envios do site; siga a documentação dele para configurar o destino dos e-mails e, se for o caso, o redirecionamento.

### Depoimentos e prova social

- Use somente depoimentos **reais e autorizados por escrito**. Sem `autorizacao: true`, o build recusa a página.
- Números de atendimento (ex.: "instituições atendidas") só entram com dados verificáveis, com o ano de referência. Sem dado real, apague o campo `prova_social`.
- Não use nomes, cargos ou resultados inventados, nem mesmo como exemplo que ficou no texto.

### Marcadores e validação

O build recusa a página enquanto houver marcadores `[[ ... ]]` nos arquivos de origem. Os modelos vêm com marcadores justamente para impedir a publicação sem os dados reais. O `npm test` também verifica que nenhuma página publicada tem marcador, que todo formulário envia para https e que cada página tem um único `h1`.

## 13. Revisão jurídica e LGPD antes de publicar

As páginas de proposta, de captura e de venda envolvem dados pessoais e compromissos comerciais. Antes de publicar qualquer uma delas:

- [ ] A **política de privacidade** (`paginas/privacidade.md`) foi revisada e descreve o serviço de formulário realmente usado, incluindo o que ele faz com os dados.
- [ ] A organização responsável está identificada no fornecedor (nome, CNPJ ou CPF conforme o caso, e canal de atendimento), e não há dados pessoais desnecessários publicados.
- [ ] Os textos de **garantia**, de **direito de arrependimento** (7 dias em compras online, art. 49 do CDC) e de **prazos e entregas** correspondem ao que será entregue.
- [ ] Depoimentos e números têm autorização ou comprovação guardadas pela organização.
- [ ] O material gratuito tem licença de uso definida e pode ser distribuído.
- [ ] Se houver encarregado de dados (DPO) institucional, ele foi consultado e o contato dele está disponível na política.

Este guia não substitui a revisão de um profissional habilitado. Em caso de dúvida, consulte a assessoria jurídica da instituição à qual o projeto se vincula.

