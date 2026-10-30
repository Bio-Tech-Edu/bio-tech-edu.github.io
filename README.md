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
| Blog | Publicações em markdown convertidas automaticamente, com busca, categorias, tags, citação ABNT e comentários |
| Licenças | Conteúdo em CC BY-SA 4.0; código-fonte em MIT |

## Arquitetura

Site estático (HTML, CSS e JavaScript puros), publicado pelo GitHub Pages. Tudo roda no navegador; não há servidor. O único passo de build é a conversão dos textos do blog (Node.js, `marked` e `gray-matter`), executada pelo GitHub Actions.

```
index.html               página inicial (fonte do cabeçalho e do rodapé de todas as páginas)
blog.html                página do blog (GERADA a partir de scripts/blog.template.html)
404.html                 página de erro (GERADA)
sitemap.xml, robots.txt  indexação em buscadores (sitemap GERADO)
data/
  projects.json          catálogo de recursos (dados separados da lógica)
posts/                   textos do blog em markdown (fonte das publicações)
blog/                    publicações geradas (HTML, posts.json, feed.xml) e config.json (editável)
assets/
  css/styles.css         tokens de tema (escuro/claro), layout e componentes globais
  css/blog.css           estilos exclusivos do blog e das publicações
  js/lib.js              utilitários comuns (namespace BT)
  js/theme.js            alternância de tema claro/escuro
  js/catalog.js          catálogo: busca, filtros e cards
  js/blog.js             blog: carrossel, busca, filtros, tags, comunidade e mídia
  js/post.js             publicação: citação ABNT
  js/comments.js         publicação: comentários (Giscus ou Disqus)
  img/                   favicon, hero (WebP), capturas (WebP), brand/ (originais) e blog/ (imagens dos posts)
scripts/
  build-blog.mjs         conversor markdown → HTML
  blog.template.html     modelo do blog.html
  check-links.mjs        verificador de links, imagens e IDs
.github/workflows/       automação (build + validação + publicação dos arquivos gerados)
docs/                    plano de sprints
```

**Regra de ouro:** não edite à mão os arquivos GERADOS (`blog.html`, `404.html`, `sitemap.xml`, `blog/*.html`, `blog/posts.json`, `blog/feed.xml`). Eles são recriados a cada build. Para mudar o cabeçalho ou o rodapé, edite o `index.html`.

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
2. Escreva o texto em markdown. Imagens ficam em `assets/img/blog/` e são citadas como `assets/img/blog/arquivo.webp`.
3. Faça o commit na `main` (ou abra um *pull request*, que roda as validações). Em cerca de um minuto, a publicação aparece em `blog.html`.

| Campo do cabeçalho | Função |
|---|---|
| `title`, `date` | Obrigatórios (data no formato AAAA-MM-DD) |
| `summary` | Texto do carrossel e dos cards |
| `area`, `atuacao`, `formato` | Categorias do menu lateral (área do conhecimento, atuação profissional, formato do texto) |
| `publico` | Professores, Estudantes universitários e/ou Estagiários |
| `tags` | Lista de tags |
| `habilidades` | Códigos BNCC trabalhados (opcional) |
| `destaque` | Número maior = mais destaque no carrossel (5 publicações) |
| `cover`, `cover_alt` | Capa opcional e seu texto alternativo |
| `atualizado` | Data da última revisão (opcional) |
| `comentarios: false` | Desativa comentários na publicação |
| `rascunho: true` | Não publica |

Cada publicação inclui sumário, tempo de leitura, bloco **Como citar** (ABNT, com data de acesso preenchida no navegador), publicações relacionadas, navegação entre textos, dados estruturados (JSON-LD) e botão para compartilhar no WhatsApp.

### Comentários

Os comentários são carregados somente após o clique do leitor (privacidade e desempenho) e configurados em `blog/config.json`, no campo `comentarios`. Enquanto o provedor não estiver configurado, a publicação mostra um aviso.

**Opção recomendada: Giscus** (gratuito, sem anúncios, usa o GitHub Discussions; o leitor precisa de conta no GitHub):

1. Em *Settings → General → Features*, ative **Discussions** no repositório.
2. Crie a categoria **Comentários** (formato *Announcement*) e instale o app https://github.com/apps/giscus no repositório.
3. Em https://giscus.app, informe o repositório e a categoria e copie `data-repo-id` e `data-category-id`.
4. Preencha `giscus.repoId` e `giscus.categoryId` em `blog/config.json` (mantenha `"provedor": "giscus"`).

**Alternativa: Disqus** (login por e-mail e redes sociais; plano gratuito com anúncios e rastreamento): crie o site em https://disqus.com, copie o *shortname* para `disqus.shortname` e use `"provedor": "disqus"`.

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

Sugestões de conteúdo, acessibilidade e código são bem-vindas por *issues* e *pull requests*. Todo *pull request* roda a validação automática (`npm test`). O roteiro de evolução está em [`docs/PLANO-DE-SPRINTS.md`](docs/PLANO-DE-SPRINTS.md).

## Licença

Conteúdo: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.pt). Código: [MIT](https://opensource.org/licenses/MIT).

© 2026 Pâmella Araújo Balcaçar
