# Plano de sprints

Entregas pequenas e incrementais, sempre compatíveis com o GitHub Pages (somente cliente: HTML, CSS e JavaScript; persistência em LocalStorage/IndexedDB ou APIs externas). Cada sprint termina com `npm test` verde e site publicado.

Legenda de esforço: P (até 1 dia), M (2 a 3 dias), G (1 semana). **[IA]** indica tarefas em que a IA agrega mais valor por exigir análise ou geração em volume, sempre com revisão humana.

| Sprint | Objetivo | Entregas | Critérios de aceite |
|---|---|---|---|
| **0 (concluída neste pacote)** | Corrigir e estabilizar | Correção do `blog.js` (elemento `wa-box` ausente derrubava o blog); estrutura `assets/css|js|img` e `data/`; imagens em WebP; catálogo em `data/projects.json`; verificador de links/IDs; CI com validação em PR; 404, sitemap e robots | `npm test` verde; blog lista posts; peso das imagens < 1 MB |
| **0.1 (correção do build)** | Build do blog resiliente | Conversor que isola o erro por texto e aponta arquivo e linha; `area`/`atuacao` em lista; capas em WebP; verificação de que cada post listado tem página | Um texto com erro não impede os demais; `npm test` verde |
| **1** | Comunidade e comentários | Disqus (shortname `biotechedu`) com carregamento sob clique; política de privacidade e termos (LGPD); modelos de *issue* e *pull request*; `CONTRIBUTING.md`; wiki no menu e no rodapé (M) | Comentário publicado e moderado em um post; página de privacidade no ar |
| **2** | Acessibilidade verificável | `axe-core`/`pa11y` no CI; revisão manual com leitor de tela (NVDA/VoiceOver); `prefers-contrast`; textos alternativos reais para as 17 capturas **[IA]** (gerar e revisar) (M) | 0 violações críticas no CI; todas as imagens com `alt` descritivo |
| **3** | Catálogo profissional | JSON Schema para `projects.json` validado no CI; filtros por habilidade BNCC, componente curricular e nível; página estática por recurso (`recursos/<slug>.html`) com citação e JSON-LD (G) | Cada recurso com URL própria e indexável; filtros combináveis |
| **4** | Persistência local | Favoritos e "Minha sequência didática" em LocalStorage; exportar/importar JSON; versão para impressão do plano (CSS `@media print`) (M) | Dados sobrevivem a recarregar; exportação abre em outro navegador |
| **5** | Busca unificada | Índice de busca estático gerado no build (catálogo + blog); atalhos de teclado; deep links `?q=` **[IA]** (relevância e sinônimos pedagógicos) (M) | Busca única retorna recursos e posts; resposta < 100 ms |
| **6** | PWA e uso offline | `manifest.webmanifest`, *service worker* (cache de ativos e JSON), tela de "sem conexão" (M) | Lighthouse PWA instalável; leitura de posts já abertos offline |
| **7** | Desempenho e qualidade | Fonte Inter auto-hospedada (WOFF2, subconjunto); CSS crítico; orçamento Lighthouse no CI (LCP < 2,5 s); imagens de compartilhamento (og) por post gerada no build **[IA]** (M) | Lighthouse ≥ 95 em desempenho e acessibilidade (móvel) |
| **8** | Conteúdo técnico-pedagógico assistido | Ficha pedagógica por recurso (objetivos, habilidades, avaliação, adaptações) **[IA]** rascunho + revisão da autora; mapeamento de habilidades BNCC; série de posts; glossário OAD/REA/RED (G) | Fichas revisadas publicadas; links cruzados entre posts e recursos |
| **9** | Impacto e evolução | Métricas de uso sem cookies (ex.: GoatCounter); painel de indicadores; versões em inglês e espanhol **[IA]** (tradução com revisão) (G) | Relatório mensal gerado; páginas traduzidas com seletor de idioma |

## Dependências e riscos

- Sprint 1 depende do cadastro do site no Disqus (shortname `biotechedu`) e de ajustes no painel do Disqus. Veja a seção "Configuração manual do Sprint 1".
- O plano gratuito do Disqus pode exibir anúncios. A organização decide se mantém o plano ou migra para outro provedor (o Giscus já está suportado pelo código).
- Se `main` tiver proteção de branch, o *bot* do workflow não consegue publicar os arquivos gerados: permitir o *bot* ou mudar o fluxo para *pull request* automático.
- Service worker (Sprint 6) exige cuidado com versões de cache para não manter conteúdo antigo.

## Status do Sprint 1

| Item | Status no repositório | Pendência manual |
|---|---|---|
| Comentários com Disqus (`biotechedu`), carregados após o clique | Pronto (código, config e testes) | Cadastro e ajustes no painel do Disqus (abaixo) |
| Validação da configuração de comentários | Pronto (`scripts/check-comments.mjs`, no `npm test` e no workflow) | Nenhuma |
| Política de privacidade (LGPD) | Pronto como texto (`paginas/privacidade.md`) | Revisão jurídica ou do encarregado de dados antes da publicação oficial |
| Termos de uso e regras de comentários | Pronto como texto (`paginas/termos.md`) | Revisão jurídica antes da publicação oficial |
| Modelos de issue e pull request | Pronto (`.github/`) | Ativar as issues no repositório, se estiverem desativadas |
| `CONTRIBUTING.md` | Pronto | Nenhuma |
| Wiki no menu e no rodapé | Pronto (menu principal, rodapé e menu lateral do blog) | Nenhuma |
| Comentário publicado e moderado | Não verificável no sandbox | Publicar um comentário de teste e moderá-lo (passo 4 abaixo) |
| Página de privacidade no ar | Gerada pelo build | Confirmar no site após o *merge* |

### Configuração manual do Sprint 1

Estes passos não podem ser feitos pelo repositório. Os nomes exatos de menus do Disqus podem mudar com atualizações do painel.

1. **Cadastrar o site no Disqus.** Entre em https://disqus.com/admin/ com a conta da organização e confirme que existe o site com shortname `biotechedu`. Se for outro, troque em `blog/config.json` (`comentarios.disqus.shortname`) e rode `npm test`.
2. **Dados do site.** Em *Settings → General*, informe o nome (Bio+Tech EduDesign) e a URL `https://bio-tech-edu.github.io`.
3. **Domínios permitidos.** Em *Settings → Advanced* (ou a seção equivalente de domínios confiáveis), inclua `bio-tech-edu.github.io`. Sem isso, o Disqus pode recusar o carregamento na página.
4. **Moderação.** Em *Settings → Moderation*, prefira **pré-moderar todos os comentários**, já que o público inclui estudantes. Depois, publique um comentário de teste em uma publicação, aprove-o e confirme que ele aparece. Apague o comentário de teste em seguida.
5. **Pages.** Em *Settings → Pages*, confirme *Deploy from a branch* → `main` / `(root)`.
6. **Issues.** Em *Settings → General → Features*, confirme que **Issues** está ativado (os modelos dependem disso).
7. **Revisão jurídica.** Antes da divulgação oficial, validar `paginas/privacidade.md` e `paginas/termos.md` com a assessoria jurídica da instituição à qual o projeto se vincula. Se houver encarregado de dados (DPO) institucional, indicá-lo na política.
8. **Verificação final.** Abrir uma publicação, clicar em "Carregar comentários", confirmar que o formulário aparece e que o link de privacidade funciona.

