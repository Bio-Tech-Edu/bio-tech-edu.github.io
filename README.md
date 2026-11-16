# Bio+Tech EduDesign

Vitrine de **recursos educacionais abertos** e de **serviços de consultoria, mentoria e formação** em ciência e tecnologia, com design educacional, rigor científico e acessibilidade digital.

**Site:** https://biotech.pro.br · **Organização:** https://github.com/Bio-Tech-Edu · **Wiki da comunidade:** https://github.com/Bio-Tech-Edu/.github/wiki

## Resumo executivo

| Item | Descrição |
|---|---|
| Propósito | Reunir e divulgar recursos digitais abertos para o ensino de ciências, dados e tecnologia, e oferecer serviços para escolas, redes e educadores |
| Público | Gestores e coordenadores, professores, estudantes universitários e estagiários |
| Recursos | OAD (objeto de aprendizagem digital), REA (recurso educacional aberto) e RED (recurso educacional digital) |
| Serviços | Serviço, mentoria, consultoria e assinatura (definidos no glossário da página inicial) |
| Alinhamento curricular | Habilidades da BNCC e da BNCC Computação indicadas em cada recurso |
| Páginas de produto | Uma landing page por produto do catálogo (`recursos/`) e páginas avulsas para propostas e kits gratuitos (`lp/`) |
| Blog | Publicações em markdown convertidas automaticamente, com busca, categorias, tags, citação ABNT e comentários |
| Comunidade | Inscrição por formulário (MailerLite), e-mail de boas-vindas e convite ao grupo do WhatsApp |
| Licenças | Conteúdo em CC BY-SA 4.0, salvo condições próprias indicadas em cada produto; código-fonte em MIT |

## Arquitetura

Site estático (HTML, CSS e JavaScript puros), publicado pelo GitHub Pages. Tudo roda no navegador; não há servidor. O único passo de build converte textos em markdown (Node.js, `marked` e `gray-matter`) e é executado pelo GitHub Actions.

```
CNAME                    domínio do site (fonte única; hoje biotech.pro.br)
index.html               página inicial (fonte do cabeçalho e do rodapé de todas as páginas)
blog.html                página do blog (GERADA a partir de scripts/blog.template.html)
privacidade.html         política de privacidade (GERADA a partir de paginas/privacidade.md)
termos.html              termos de uso (GERADA a partir de paginas/termos.md)
404.html, sitemap.xml    página de erro e mapa do site (GERADOS)
robots.txt               regras para buscadores (GERADO)
data/
  projects.json          catálogo de produtos (um objeto por produto, com "slug")
landings/                fontes em markdown das landing pages (uma por produto ou página avulsa)
  _modelo-*.md           modelos comentados: gratuito, venda, proposta e captura
recursos/                landing pages GERADAS dos produtos do catálogo
lp/                      landing pages GERADAS avulsas, fora do catálogo
posts/                   textos do blog em markdown
paginas/                 textos institucionais em markdown
blog/                    publicações geradas (HTML, posts.json, feed.xml) e config.json (editável)
assets/
  css/                   styles.css (tema e layout), blog.css (blog), landing.css (landing pages)
  js/                    lib, theme, catalog, blog, post, comments e lead-form
  img/                   favicon, hero, capturas (WebP), brand/ (originais) e blog/ (imagens dos posts)
scripts/
  lib/site.mjs           partes comuns dos geradores (domínio, cabeçalho, rodapé, markdown, datas)
  build-landings.mjs     landings/*.md → recursos/ e lp/
  build-blog.mjs         posts/ e paginas/ → blog/, páginas institucionais, sitemap e robots
  check-links.mjs        verifica links, imagens, IDs, formulários e títulos
  check-comments.mjs     verifica a configuração de comentários
  check-domain.mjs       verifica a consistência do domínio
.github/                 workflow, modelos de issue e de pull request
docs/                    guias e plano de sprints
```

**Regra de ouro:** não edite à mão os arquivos GERADOS (`blog.html`, `privacidade.html`, `termos.html`, `404.html`, `sitemap.xml`, `robots.txt`, `blog/*.html`, `blog/posts.json`, `blog/feed.xml`, `recursos/*.html` e `lp/*.html`). Eles são recriados a cada build. Para mudar o cabeçalho ou o rodapé de todas as páginas, edite o `index.html`.

## Página inicial

| Seção | Conteúdo |
|---|---|
| Hero | Apresentação e indicadores |
| Para quem é | Gestores e coordenadores, professores, estudantes universitários e estagiários |
| Tipos de recurso e de serviço | Glossário: OAD, REA, RED, serviço, mentoria, consultoria e assinatura |
| Catálogo | Cards com busca e filtros; o botão **Ver detalhes** abre a landing page do produto |
| Metodologia | Aprendizagem ativa e prática, simulação e raciocínio científico, gamificação contextualizada e feedback formativo integrado |
| Serviços | Ecossistema de soluções, etapas da consultoria e chamadas para ação |
| Sobre | Missão e origem do projeto |

## Domínio e publicação

O endereço do site vem do arquivo `CNAME`. O build usa esse valor em canonical, Open Graph, sitemap, feed e `robots.txt`, e o `npm test` falha se algum arquivo citar o endereço antigo (bio-tech-edu.github.io). O processo completo de migração (DNS, GitHub Pages, HTTPS, Disqus e Search Console) está em [`docs/DOMINIO.md`](docs/DOMINIO.md).

Dois workflows cuidam do site: `blog.yml` gera e valida as páginas, commita os arquivos gerados e aciona o `static.yml`, que publica no GitHub Pages por GitHub Actions. Detalhes e a conferência do modo de publicação estão em [`docs/DOMINIO.md`](docs/DOMINIO.md).

Todos os links das páginas usam caminhos relativos, exceto o `404.html`, que usa caminhos iniciados em `/` porque o GitHub Pages o serve em qualquer URL. Configuração do Pages: *Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`*.

## Landing pages dos produtos

Cada produto do catálogo tem uma página em `recursos/<slug>.html`, gerada a partir de `landings/<slug>.md`. Os modos são `gratuito`, `venda`, `proposta` e `captura`. Páginas que não são produtos do catálogo ficam em `lp/` (`catalogo: false`).

O guia completo, com campos, regras, modelos e checklist de publicação, está em [`docs/GUIA-LANDING-PAGES.md`](docs/GUIA-LANDING-PAGES.md).

## Captação de leads e comunidade (MailerLite)

O formulário das landing pages envia nome e e-mail ao MailerLite, em segundo plano, e leva a pessoa ao convite da comunidade no WhatsApp. A pessoa **sempre** é levada ao convite, mesmo se o envio falhar ou demorar. Por isso, teste o fluxo com um e-mail real e acompanhe a lista de inscritos. O guia de configuração e o e-mail de boas-vindas estão em [`docs/MAILERLITE-AUTOMACAO.md`](docs/MAILERLITE-AUTOMACAO.md).

## Blog

As publicações são arquivos markdown em `posts/`. A cada push na `main` que altere os textos, a automação converte e publica o resultado.

1. Copie `posts/_modelo.md` para `posts/AAAA-MM-DD-titulo.md` e preencha o cabeçalho.
2. Escreva o texto em markdown. Imagens ficam em `assets/img/blog/`, em **WebP com até 1200 px de largura**, e são citadas como `assets/img/blog/arquivo.webp`.
3. Faça o commit na `main` ou abra um *pull request*, que roda as validações.

| Campo do cabeçalho | Função |
|---|---|
| `title`, `date` | Obrigatórios (data no formato AAAA-MM-DD) |
| `summary` | Texto do carrossel e dos cards |
| `area`, `atuacao`, `formato` | Categorias do menu lateral; `area` e `atuacao` aceitam lista |
| `publico`, `tags`, `habilidades` | Público, tags e códigos da BNCC |
| `destaque` | Número maior = mais destaque no carrossel (5 publicações) |
| `cover`, `cover_alt` | Capa opcional e seu texto alternativo |
| `atualizado`, `comentarios: false`, `rascunho: true` | Data de revisão, desativar comentários e não publicar |

Cada publicação inclui sumário, tempo de leitura, bloco **Como citar** (ABNT), publicações relacionadas, navegação entre textos, dados estruturados e compartilhamento no WhatsApp.

### Solução de problemas do blog

O conversor não para por causa de um texto com problema: publica os demais, não publica o texto com erro e deixa o workflow vermelho em *Actions*, com uma anotação de **arquivo e linha**. Para ver o mesmo diagnóstico no seu computador, rode `npm test`.

| Mensagem | Causa e correção |
|---|---|
| `a chave "tags" aparece duas vezes` | Campo repetido no cabeçalho. Mantenha uma linha de cada campo. |
| `cabeçalho YAML inválido` | Aspas sem fechar, `:` solto ou recuo errado. Use aspas duplas em títulos com `:` ou `#`. |
| `cabeçalho ausente` | O arquivo deve começar com `---` e fechar o cabeçalho com outro `---`. |
| `data inválida ou ausente` | Use `AAAA-MM-DD`. |
| `campo desconhecido "..."` (aviso) | Erro de grafia no nome do campo; o campo é ignorado. |
| `capa não encontrada` ou `capa com NNN KB` (aviso) | Coloque a imagem em `assets/img/blog/` e converta para WebP. |

### Comentários

Os comentários usam o **Disqus** (shortname `biotechedu`), configurado em `blog/config.json`, e só carregam depois que o leitor clica em "Carregar comentários". Se o provedor estiver vazio, a publicação mostra "Os comentários serão ativados em breve…". O `npm test` valida a configuração. Alternativa: **Giscus**, trocando `"provedor"` para `"giscus"` e preenchendo `repoId` e `categoryId`. Depois da troca de domínio, inclua `biotech.pro.br` nos domínios confiáveis do Disqus (veja `docs/DOMINIO.md`).

### Comunidade e mídia

O botão da comunidade no WhatsApp e os links do menu lateral vêm de `blog/config.json` (`whatsapp`, `whatsappRotulo` e `midia`).

## Como adicionar um recurso ao catálogo

1. Em `data/projects.json`, inclua um objeto com `slug`, `title`, `type` (`OAD`, `REA` ou `RED`), `summary`, `description`, `screenshot` (WebP em `assets/img/screenshots/`) e, se houver, `bncc`, `bnccComputacao`, `link` e `repo`.
2. Crie `landings/<slug>.md` com um dos modelos.
3. Rode `npm test`.

## Acessibilidade

- Link "Pular para o conteúdo", navegação por teclado e foco visível.
- Textos a partir de 12 px, alvos de toque de 44 px e um `h1` por página (verificado no build).
- Contraste mínimo de 4,5:1 nos temas claro e escuro, que seguem a preferência do sistema.
- Respeito a `prefers-reduced-motion`; carrossel sem rotação automática.
- Formulários com rótulos, campos obrigatórios identificados e aviso de status para leitores de tela.

## Desempenho

Imagens em WebP, `loading="lazy"` nas capturas, CSS do blog e das landing pages carregado só onde é usado, scripts de terceiros (Disqus) carregados somente após o clique e script do formulário carregado só nas páginas que têm formulário.

## Identidade visual

Paleta extraída do logotipo e do hero: azul-marinho (`#143f6a`) como base do tema escuro, turquesa (`#2cc4c0`) e ciano (`#40c0d0`) como apoio e laranja (`#f28a1e`) para ações principais.

## Desenvolvimento local

```
npm ci                  # instala marked e gray-matter
npm test                # gera as páginas e valida links, imagens, IDs, formulários, comentários e domínio
python3 -m http.server 8000
```

Abra http://localhost:8000. O site usa `fetch` para carregar JSON e não funciona abrindo o HTML direto do disco.

## Contribuição

Leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir uma issue ou um pull request. Há modelos para problemas, sugestões de recursos, temas de blog e denúncias de comentários. Todo pull request roda a validação automática (`npm test`).

Regras de convivência e de uso: [termos de uso](https://biotech.pro.br/termos.html). Tratamento de dados pessoais: [política de privacidade](https://biotech.pro.br/privacidade.html). Roteiro de evolução: [`docs/PLANO-DE-SPRINTS.md`](docs/PLANO-DE-SPRINTS.md).

## Licença

Conteúdo: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.pt), salvo condições próprias indicadas em cada produto. Código: [MIT](https://opensource.org/licenses/MIT).

© 2026 Pâmella Araújo Balcaçar
