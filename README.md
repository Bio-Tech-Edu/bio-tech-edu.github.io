# Bio+Tech EduDesign

Vitrine de **recursos educacionais abertos** em ciência e tecnologia, com design educacional, rigor científico e acessibilidade digital.

**Site:** https://bio-tech-edu.github.io · **Organização:** https://github.com/Bio-Tech-Edu

## Resumo executivo

| Item | Descrição |
|---|---|
| Propósito | Reunir e divulgar recursos digitais abertos para o ensino de ciências, dados e tecnologia |
| Público | Professores, estudantes universitários e estagiários |
| Blog | Publicações em markdown convertidas automaticamente, com busca, categorias, tags e comunidade |
| Tipos de recurso | OAD (objeto de aprendizagem digital), REA (recurso educacional aberto) e RED (recurso educacional digital) |
| Alinhamento curricular | Habilidades da BNCC e da BNCC Computação indicadas em cada recurso |
| Licenças | Conteúdo em CC BY-SA 4.0; código-fonte em MIT |

## Fundamentação técnico-pedagógica

O design dos recursos se apoia em quatro eixos: **aprendizagem ativa**, **gamificação**, **simulação** e **feedback formativo**. Cada recurso do catálogo informa tipo, resumo, habilidades BNCC e acesso ao recurso e ao código.

## Acessibilidade

- Link "Pular para o conteúdo" e navegação por teclado com foco visível.
- Textos a partir de 12 px, alvos de toque de 44 px e hierarquia de títulos h1 → h2 → h3.
- Respeito a `prefers-reduced-motion` e ao tema do sistema (claro ou escuro), com alternância manual.
- Textos alternativos nas imagens (campo opcional `alt` por recurso).

## Arquitetura técnica

Site estático (HTML, CSS e JavaScript puros), publicado pelo GitHub Pages. O único passo de build é a conversão dos textos do blog (Node.js, `marked` e `gray-matter`).

```
index.html               página inicial: hero, público, tipos, catálogo, metodologia, sobre
blog.html                página do blog (gerada a partir de scripts/blog.template.html)
blog/                    publicações geradas (HTML, posts.json, feed.xml) e config.json (editável)
posts/                   textos em markdown (fonte das publicações)
assets/styles.css        tokens de tema (escuro e claro, cores da marca), layout e componentes
assets/script.js         lista `projects`, busca e filtros do catálogo
assets/blog.js           carrossel, busca, filtros, tags, comunidade e mídia do blog
assets/theme.js          alternância de tema claro e escuro
assets/blog/             imagens usadas nas publicações
scripts/build-blog.mjs   conversor markdown → HTML
.github/workflows/       automação que roda o conversor a cada push em posts/
```

## Identidade visual

Paleta extraída do logotipo e do hero: azul-marinho (`#143f6a`) como base do tema escuro, turquesa (`#2cc4c0`) e ciano (`#40c0d0`) como apoio e laranja (`#f28a1e`) para ações principais. No tema claro, as cores de texto e links usam tons mais escuros para manter contraste mínimo de 4,5:1.

## Blog

As publicações são arquivos markdown em `posts/`. A cada push na branch `main` que altere `posts/`, a automação (`.github/workflows/blog.yml`) converte os textos em páginas HTML, atualiza `blog/posts.json` e `blog/feed.xml` e publica o resultado.

**Para publicar:**

1. Copie `posts/_modelo.md` para `posts/AAAA-MM-DD-titulo.md` e preencha o cabeçalho (título, data, resumo, área, atuação, tags).
2. Escreva o texto em markdown. Imagens ficam em `assets/blog/` e são citadas como `assets/blog/arquivo.png`.
3. Faça o commit na `main`. Em cerca de um minuto, a publicação aparece em `blog.html`.

| Campo do cabeçalho | Função |
|---|---|
| `title`, `date` | Obrigatórios (data no formato AAAA-MM-DD) |
| `summary` | Texto do carrossel e dos cards |
| `area` | Área do conhecimento (menu lateral) |
| `atuacao` | Atuação profissional na educação (menu lateral) |
| `tags` | Lista de tags |
| `destaque` | Número maior = mais destaque no carrossel (5 publicações) |
| `cover`, `cover_alt` | Capa opcional e seu texto alternativo |
| `rascunho: true` | Não publica |

**Comunidade e mídia:** edite `blog/config.json` (campo `whatsapp` com o link de convite e a lista `midia`).

**Teste local:** `npm install`, `npm run build:blog` e `python3 -m http.server 8000`.

## Como adicionar um recurso ao catálogo

Inclua um objeto na lista `projects` de `assets/script.js`:

| Campo | Uso |
|---|---|
| `title`, `type` | Nome e tipo (`OAD`, `REA` ou `RED`) |
| `summary` | Uma frase sobre o que o estudante faz e aprende |
| `description` | Detalhamento pedagógico (exibido em "Detalhes pedagógicos e BNCC") |
| `bncc`, `bnccComputacao` | Listas de códigos de habilidades |
| `screenshot`, `alt` | Caminho da captura e texto alternativo descritivo |
| `link`, `repo` | Acesso ao recurso e ao código (ao menos um dos dois) |

## Desenvolvimento local

Use um servidor estático, por exemplo `python3 -m http.server 8000` (o blog carrega arquivos JSON e não funciona abrindo o HTML direto).

## Contribuição

Sugestões de conteúdo, acessibilidade e código são bem-vindas por *issues* e *pull requests* no GitHub.

## Licença

Conteúdo: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.pt). Código: [MIT](https://opensource.org/licenses/MIT).

© 2026 Pâmella Araújo Balcaçar
