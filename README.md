# Bio+Tech EduDesign

Vitrine de **recursos educacionais abertos** em ciência e tecnologia, com design educacional, rigor científico e acessibilidade digital.

**Site:** https://bio-tech-edu.github.io · **Organização:** https://github.com/Bio-Tech-Edu · **Wiki da comunidade:** https://github.com/Bio-Tech-Edu/.github/wiki

## Resumo executivo

| Item | Descrição |
|---|---|
| Propósito | Reunir e divulgar recursos digitais abertos para o ensino de ciências, dados e tecnologia |
| Público | Professores, estudantes universitários e estagiários |
| Tipos de recurso | OAD (objeto de aprendizagem digital), REA (recurso educacional aberto) e RED (recurso educacional digital) |
| Alinhamento curricular | Habilidades da BNCC e da BNCC Computação indicadas em cada recurso |
| Blog | Publicações em markdown convertidas automaticamente (com diagnóstico de erros por arquivo e linha), busca, categorias, tags, citação ABNT e comentários |
| Licenças | Conteúdo em CC BY-SA 4.0; código-fonte em MIT |

## Arquitetura

Site estático (HTML, CSS e JavaScript puros), publicado pelo GitHub Pages. Tudo roda no navegador; não há servidor. O único passo de build é a conversão dos textos do blog (Node.js, `marked` e `gray-matter`), executada pelo GitHub Actions.

```
index.html               página inicial (fonte do cabeçalho e do rodapé de todas as páginas)
blog.html                página do blog (GERADA a partir de scripts/blog.template.html)
privacidade.html         política de privacidade (GERADA a partir de paginas/privacidade.md)
termos.html              termos de uso e regras de comentários (GERADA a partir de paginas/termos.md)
404.html                 página de erro (GERADA)
sitemap.xml, robots.txt  indexação em buscadores (sitemap GERADO)
data/
  projects.json          catálogo de recursos (dados separados da lógica)
posts/                   textos do blog em markdown (fonte das publicações)
paginas/                 textos institucionais em markdown (fonte de privacidade.html e termos.html)
landings/                fontes em markdown das landing pages dos produtos (uma por produto, com o nome do slug)
recursos/                landing pages GERADAS dos produtos (uma por produto, a partir de landings/)
lp/                     landing pages GERADAS avulsas, fora do catálogo (propostas e kits gratuitos)
blog/                    publicações geradas (HTML, posts.json, feed.xml) e config.json (editável)
assets/
  css/styles.css         tokens de tema (escuro/claro), layout e componentes globais
  css/blog.css           estilos exclusivos do blog e das publicações
  css/landing.css        estilos exclusivos das landing pages dos produtos
  js/lib.js              utilitários comuns (namespace BT)
  js/theme.js            alternância de tema claro/escuro
  js/catalog.js          catálogo: busca, filtros e cards
  js/blog.js             blog: carrossel, busca, filtros, tags, comunidade e mídia
  js/post.js             publicação: citação ABNT
  js/comments.js         publicação: comentários (Disqus ou Giscus), carregados após o clique
  img/                   favicon, hero (WebP), capturas (WebP), brand/ (originais) e blog/ (imagens dos posts)
scripts/
  build-blog.mjs         conversor markdown → HTML (blog e páginas institucionais)
  build-landings.mjs     conversor markdown → landing pages de recursos/
  lib/site.mjs           partes comuns dos geradores (cabeçalho, rodapé, markdown, datas)
  blog.template.html     modelo do blog.html
  check-links.mjs        verificador de links, imagens, IDs e páginas obrigatórias
  check-comments.mjs     verificador da configuração de comentários
.github/workflows/       automação (build + validação + publicação dos arquivos gerados)
.github/ISSUE_TEMPLATE/  modelos de issue (problema, recurso, tema de blog, denúncia de comentário)
.github/PULL_REQUEST_TEMPLATE.md  checklist de pull request
CONTRIBUTING.md          como contribuir (conteúdo, código, licenças e conduta)
docs/                    plano de sprints e status
```

**Regra de ouro:** não edite à mão os arquivos GERADOS (`blog.html`, `privacidade.html`, `termos.html`, `404.html`, `sitemap.xml`, `blog/*.html`, `blog/posts.json`, `blog/feed.xml`). Eles são recriados a cada build. Para mudar o cabeçalho ou o rodapé, edite o `index.html`.

## Caminhos e GitHub Pages

O site é uma página de organização (`bio-tech-edu.github.io`), servida na raiz do domínio. Todos os links das páginas usam caminhos relativos; apenas o `404.html` usa caminhos iniciados em `/`, porque o GitHub Pages o serve em qualquer URL. Se o projeto for movido para um repositório de projeto (`usuario.github.io/repositorio/`), troque os caminhos do `404.html` (em `scripts/build-blog.mjs`, modo `"abs"`) pelo prefixo do repositório.

Configuração do Pages: *Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`*.

## Acessibilidade

- Link "Pular para o conteúdo" e navegação por teclado com foco visível.
- Textos a partir de 12 px, alvos de toque de 44 px, hierarquia de títulos h1 → h2 → h3.
- Contraste mínimo de 4,5:1 nos dois temas (escuro e claro), que seguem a preferência do sistema.
- Respeito a `prefers-reduced-motion`; carrossel sem rotação automática.
- Textos alternativos nas imagens (campo opcional `alt` por recurso).

## Desempenho

Imagens em WebP (capturas de 9,2 MB para 0,6 MB; hero de 816 KB para 31 KB), `loading="lazy"` nas capturas, CSS do blog carregado só nas páginas do blog e comentários de terceiros carregados somente após o clique do leitor.

## Identidade visual

Paleta extraída do logotipo e do hero: azul-marinho (`#143f6a`) como base do tema escuro, turquesa (`#2cc4c0`) e ciano (`#40c0d0`) como apoio e laranja (`#f28a1e`) para ações principais.

## Landing pages dos produtos

Cada produto do catálogo tem uma landing page em `recursos/<slug>.html`, que abre ao clicar em **Ver detalhes**. Ela é gerada a partir de `landings/<slug>.md`, em modo gratuito (apresentação) ou venda. Os modelos comentados estão em `landings/_modelo-gratuito.md` e `landings/_modelo-venda.md`. Propostas comerciais e kits gratuitos, que não são recursos do catálogo, ficam em `lp/` e seguem os modelos `landings/_modelo-proposta.md` e `landings/_modelo-captura.md`. A documentação completa está no guia, incluindo a revisão jurídica e a LGPD antes da publicação.

O passo a passo completo, com os campos, as regras e o checklist de publicação, está em [docs/GUIA-LANDING-PAGES.md](docs/GUIA-LANDING-PAGES.md).

## Como adicionar um recurso ao catálogo

Edite `data/projects.json` e inclua um objeto (a ordem da lista é a ordem do catálogo):

| Campo | Uso |
|---|---|
| `title`, `type` | Nome e tipo (`OAD`, `REA` ou `RED`) |
| `summary` | Uma frase sobre o que o estudante faz e aprende |
| `description` | Detalhamento pedagógico (exibido em "Detalhes pedagógicos e BNCC") |
| `bncc`, `bnccComputacao` | Listas de códigos de habilidades |
| `screenshot`, `alt` | Caminho da captura (use WebP em `assets/img/screenshots/`) e texto alternativo descritivo |
| `link`, `repo` | Acesso ao recurso e ao código (ao menos um dos dois) |

## Blog

As publicações são arquivos markdown em `posts/`. A cada push na `main` que altere `posts/`, a automação converte os textos em páginas HTML e publica o resultado.

1. Copie `posts/_modelo.md` para `posts/AAAA-MM-DD-titulo.md` e preencha o cabeçalho.
2. Escreva o texto em markdown. Imagens (capas e figuras) ficam em `assets/img/blog/`, em **WebP com até 1200 px de largura** (ex.: `cwebp -q 80 -resize 1200 0 capa.png -o capa.webp`, ou https://squoosh.app), e são citadas como `assets/img/blog/arquivo.webp`.
3. Faça o commit na `main` (ou abra um *pull request*, que roda as validações). Em cerca de um minuto, a publicação aparece em `blog.html`.

| Campo do cabeçalho | Função |
|---|---|
| `title`, `date` | Obrigatórios (data no formato AAAA-MM-DD) |
| `summary` | Texto do carrossel e dos cards |
| `area`, `atuacao`, `formato` | Categorias do menu lateral. `area` e `atuacao` aceitam um valor ou uma lista (`[A, B]`); o primeiro é o principal. `formato` é um valor (Artigo, Guia, Checklist...) |
| `publico` | Professores, Estudantes universitários e/ou Estagiários |
| `tags` | Lista de tags |
| `habilidades` | Códigos BNCC trabalhados (opcional) |
| `destaque` | Número maior = mais destaque no carrossel (5 publicações) |
| `cover`, `cover_alt` | Capa opcional e seu texto alternativo |
| `atualizado` | Data da última revisão (opcional) |
| `comentarios: false` | Desativa comentários na publicação |
| `rascunho: true` | Não publica |

Cada publicação inclui sumário, tempo de leitura, bloco **Como citar** (ABNT, com data de acesso preenchida no navegador), publicações relacionadas, navegação entre textos, dados estruturados (JSON-LD) e botão para compartilhar no WhatsApp.

### Solução de problemas do blog

O conversor não para por causa de um texto com problema: ele publica os demais, **não publica o texto com erro** e deixa o workflow vermelho em *Actions*, com uma anotação indicando **arquivo e linha**. Para ver o mesmo diagnóstico no seu computador, rode `npm test`.

| Mensagem | Causa e correção |
|---|---|
| `a chave "tags" aparece duas vezes` | Campo repetido no cabeçalho (comum ao colar um cabeçalho novo sem apagar o antigo). Mantenha só uma linha de cada campo. |
| `cabeçalho YAML inválido` | Aspas sem fechar, `:` solto ou recuo errado. Use aspas duplas em títulos e resumos que tenham `:` ou `#`. |
| `cabeçalho ausente` | O arquivo precisa começar com `---` e fechar o cabeçalho com outro `---`. |
| `data inválida ou ausente` | Use `AAAA-MM-DD` (ex.: `2026-10-28`). |
| `campo desconhecido "..."` (aviso) | Erro de grafia no nome do campo (ex.: `atuaçao`); o campo é ignorado. |
| `capa não encontrada` / `capa com NNN KB` (aviso) | Coloque a imagem em `assets/img/blog/` e converta para WebP. |

Dois lembretes: os arquivos gerados (`blog/*.html`, `blog/posts.json`, `blog/feed.xml`, `blog.html`, `404.html`, `sitemap.xml`) não devem ser editados nem apagados à mão, pois são recriados a cada build; e a publicação só aparece no site depois que o workflow termina (cerca de um minuto).

### Comentários

Os comentários são fornecidos pelo **Disqus** (shortname `biotechedu`), configurado em `blog/config.json`:

```json
"comentarios": {
  "provedor": "disqus",
  "disqus": { "shortname": "biotechedu" }
}
```

Por privacidade, o Disqus só é carregado depois que o leitor clica em "Carregar comentários". Antes do clique, a página mostra o aviso de consentimento com link para a [política de privacidade](https://bio-tech-edu.github.io/privacidade.html).

Se o provedor estiver vazio, a publicação mostra "Os comentários serão ativados em breve…". Se o shortname for inválido, o `npm test` falha e indica o erro.

**Configuração no painel do Disqus** (feita uma vez, pelo administrador do site no Disqus): veja o passo a passo em `docs/PLANO-DE-SPRINTS.md`, seção "Configuração manual do Sprint 1".

**Alternativa: Giscus** (usa GitHub Discussions; exige conta no GitHub): troque `"provedor"` para `"giscus"` e preencha `giscus.repoId` e `giscus.categoryId`, obtidos em https://giscus.app depois de ativar o *Discussions* do repositório.

### Comunidade e mídia

O botão da comunidade no WhatsApp e os links do menu lateral (wiki da comunidade, GitHub, contribuições) vêm de `blog/config.json` (`whatsapp`, `whatsappRotulo` e `midia`).

## Desenvolvimento local

```
npm ci                  # instala marked e gray-matter
npm test                # converte os posts e valida links, imagens e IDs
python3 -m http.server 8000
```

Abra http://localhost:8000. O site usa `fetch` para carregar JSON e, por isso, não funciona abrindo o HTML direto do disco.

## Contribuição

Leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir uma issue ou um pull request. Há modelos prontos para problemas, sugestões de recursos, temas de blog e denúncias de comentários. Todo pull request roda a validação automática (`npm test`).

Regras de convivência e de uso: [termos de uso](https://bio-tech-edu.github.io/termos.html). Tratamento de dados pessoais: [política de privacidade](https://bio-tech-edu.github.io/privacidade.html).

Roteiro de evolução: [`docs/PLANO-DE-SPRINTS.md`](docs/PLANO-DE-SPRINTS.md).

## Licença

Conteúdo: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.pt). Código: [MIT](https://opensource.org/licenses/MIT).

© 2026 Pâmella Araújo Balcaçar
