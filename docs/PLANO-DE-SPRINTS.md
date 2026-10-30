# Plano de sprints

Entregas pequenas e incrementais, sempre compatíveis com o GitHub Pages (somente cliente: HTML, CSS e JavaScript; persistência em LocalStorage/IndexedDB ou APIs externas). Cada sprint termina com `npm test` verde e site publicado.

Legenda de esforço: P (até 1 dia), M (2 a 3 dias), G (1 semana). **[IA]** indica tarefas em que a IA agrega mais valor por exigir análise ou geração em volume, sempre com revisão humana.

| Sprint | Objetivo | Entregas | Critérios de aceite |
|---|---|---|---|
| **0 (concluída neste pacote)** | Corrigir e estabilizar | Correção do `blog.js` (elemento `wa-box` ausente derrubava o blog); estrutura `assets/css|js|img` e `data/`; imagens em WebP; catálogo em `data/projects.json`; verificador de links/IDs; CI com validação em PR; 404, sitemap e robots | `npm test` verde; blog lista posts; peso das imagens < 1 MB |
| **1** | Comunidade e comentários | Ativar Discussions + Giscus (ou Disqus); política de privacidade e termos (LGPD); modelos de *issue* e *pull request*; `CONTRIBUTING.md`; links da wiki em rodapé e menu (M) | Comentário publicado e moderado em um post; página de privacidade no ar |
| **2** | Acessibilidade verificável | `axe-core`/`pa11y` no CI; revisão manual com leitor de tela (NVDA/VoiceOver); `prefers-contrast`; textos alternativos reais para as 17 capturas **[IA]** (gerar e revisar) (M) | 0 violações críticas no CI; todas as imagens com `alt` descritivo |
| **3** | Catálogo profissional | JSON Schema para `projects.json` validado no CI; filtros por habilidade BNCC, componente curricular e nível; página estática por recurso (`recursos/<slug>.html`) com citação e JSON-LD (G) | Cada recurso com URL própria e indexável; filtros combináveis |
| **4** | Persistência local | Favoritos e "Minha sequência didática" em LocalStorage; exportar/importar JSON; versão para impressão do plano (CSS `@media print`) (M) | Dados sobrevivem a recarregar; exportação abre em outro navegador |
| **5** | Busca unificada | Índice de busca estático gerado no build (catálogo + blog); atalhos de teclado; deep links `?q=` **[IA]** (relevância e sinônimos pedagógicos) (M) | Busca única retorna recursos e posts; resposta < 100 ms |
| **6** | PWA e uso offline | `manifest.webmanifest`, *service worker* (cache de ativos e JSON), tela de "sem conexão" (M) | Lighthouse PWA instalável; leitura de posts já abertos offline |
| **7** | Desempenho e qualidade | Fonte Inter auto-hospedada (WOFF2, subconjunto); CSS crítico; orçamento Lighthouse no CI (LCP < 2,5 s); imagens de compartilhamento (og) por post gerada no build **[IA]** (M) | Lighthouse ≥ 95 em desempenho e acessibilidade (móvel) |
| **8** | Conteúdo técnico-pedagógico assistido | Ficha pedagógica por recurso (objetivos, habilidades, avaliação, adaptações) **[IA]** rascunho + revisão da autora; mapeamento de habilidades BNCC; série de posts; glossário OAD/REA/RED (G) | Fichas revisadas publicadas; links cruzados entre posts e recursos |
| **9** | Impacto e evolução | Métricas de uso sem cookies (ex.: GoatCounter); painel de indicadores; versões em inglês e espanhol **[IA]** (tradução com revisão) (G) | Relatório mensal gerado; páginas traduzidas com seletor de idioma |

## Dependências e riscos

- Sprint 1 depende de ativar o Discussions e instalar o app do Giscus (ações do administrador da organização).
- Giscus exige conta no GitHub; professores sem conta podem preferir Disqus ou outra solução. Avaliar com a comunidade antes de fixar o provedor.
- Se `main` tiver proteção de branch, o *bot* do workflow não consegue publicar os arquivos gerados: permitir o *bot* ou mudar o fluxo para *pull request* automático.
- Service worker (Sprint 6) exige cuidado com versões de cache para não manter conteúdo antigo.
