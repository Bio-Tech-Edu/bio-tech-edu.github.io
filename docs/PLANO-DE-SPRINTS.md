# Plano de sprints

Entregas pequenas e incrementais, sempre compatíveis com o GitHub Pages (somente cliente: HTML, CSS e JavaScript; persistência em LocalStorage ou IndexedDB, ou APIs externas). Cada sprint termina com `npm test` verde e o site publicado.

**Legenda de esforço:** P (até 1 dia), M (2 a 3 dias), G (1 semana). **[IA]** indica tarefas em que a IA agrega mais valor por exigir análise ou geração em volume, sempre com revisão humana.

**Legenda de status:** **Concluída** (código pronto e testado), **Pendência manual** (código pronto, falta uma ação fora do repositório), **Parcial** (parte entregue) e **Planejada**.

## 1. Visão geral

| Sprint | Objetivo | Status |
|---|---|---|
| 0 | Corrigir e estabilizar a estrutura | Concluída |
| 0.1 | Build do blog resiliente | Concluída |
| 1 | Comunidade e comentários (Disqus, privacidade, termos, modelos) | Pendência manual |
| 1.1 | Landing pages dos produtos e páginas avulsas | Concluída |
| 1.2 | Domínio `biotech.pro.br` | Pendência manual |
| 1.3 | Captação de leads (MailerLite) e comunidade no WhatsApp | Pendência manual |
| 1.4 | Página inicial com serviços e glossário atualizado | Concluída |
| 2 | Acessibilidade verificável | Planejada |
| 3 | Catálogo profissional | Parcial |
| 3.1 | Modalidades de serviço no catálogo e oferta adicional (`servico_adicional`) nas landing pages | Planejada |
| 4 a 9 | Persistência local, busca, PWA, desempenho, conteúdo assistido e impacto | Planejadas |

## 2. Sprints concluídas ou em andamento

| Sprint | Entregas | Critério de aceite |
|---|---|---|
| **0** | Estrutura `assets/css`, `assets/js`, `assets/img` e `data/`; imagens em WebP; catálogo em `data/projects.json`; verificador de links e IDs; CI com validação em pull request; 404, sitemap e robots | `npm test` verde; peso das imagens reduzido |
| **0.1** | Conversor do blog que isola o erro por texto e aponta arquivo e linha; `area` e `atuacao` em lista; capas em WebP; verificação de que cada post listado tem página | Um texto com erro não impede os demais |
| **1** | Disqus (`biotechedu`) com carregamento sob clique; política de privacidade e termos (LGPD); modelos de issue e de pull request; `CONTRIBUTING.md`; wiki no menu e no rodapé | Comentário publicado e moderado em um post; página de privacidade no ar |
| **1.1** | `landings/*.md` geram `recursos/` e `lp/`; modos `gratuito`, `venda`, `proposta` e `captura`; formulário com consentimento, blocos de conteúdo, validação com erro por arquivo e linha; botão **Ver detalhes** no catálogo; guia em `docs/GUIA-LANDING-PAGES.md` | Cada produto do catálogo tem página; `npm test` exige isso |
| **1.2** | `CNAME` como fonte única do domínio; build gera canonical, Open Graph, sitemap, feed e `robots.txt` a partir dele; `scripts/check-domain.mjs`; guia `docs/DOMINIO.md` | `npm test` falha se o endereço antigo voltar a aparecer |
| **1.3** | Formulário MailerLite (`provedor: "mailerlite"`) com redirecionamento garantido ao WhatsApp, `assets/js/lead-form.js`, política de privacidade atualizada e guia `docs/MAILERLITE-AUTOMACAO.md` | Inscrição de teste aparece no MailerLite e dispara o e-mail de boas-vindas |
| **1.4** | `index.html`: "Para quem é" com gestores, professores e estudantes; glossário com serviço, mentoria, consultoria e assinatura; metodologia com os quatro pilares das landing pages; nova seção "Serviços" | Seções navegáveis pelo menu e pelas chamadas para ação |

## 3. Pendências manuais

Estes passos não podem ser feitos por commit.

### 3.1 Domínio (Sprint 1.2)

Siga `docs/DOMINIO.md`, nesta ordem, **antes** do merge que muda os endereços do site:

1. Criar os registros A e o CNAME de `www` no DNS.
2. Informar `biotech.pro.br` em *Settings → Pages* e marcar **Enforce HTTPS** depois da emissão do certificado.
3. Verificar o domínio na organização (registro TXT), recomendado.
4. Conferir que `https://biotech.pro.br` abre, que `www` e o endereço antigo redirecionam, e só então fazer o merge.
5. Atualizar Disqus (domínio confiável), Search Console (nova propriedade e sitemap) e links em redes sociais.

### 3.2 MailerLite (Sprint 1.3)

Siga `docs/MAILERLITE-AUTOMACAO.md`:

1. Autenticar `biotech.pro.br` como domínio de envio e criar um remetente próprio.
2. Confirmar o grupo do formulário e decidir sobre a confirmação por e-mail (double opt-in).
3. Criar e ativar a automação de boas-vindas.
4. **Fazer o teste real** com um e-mail seu, em janela anônima e no celular, e conferir *Subscribers* e a atividade da automação.
5. Só então divulgar a página.

### 3.3 Comentários e institucional (Sprint 1)

1. Confirmar o site `biotechedu` no Disqus, com o domínio novo nos domínios confiáveis.
2. Ativar a pré-moderação de comentários, publicar um comentário de teste, aprová-lo e apagá-lo.
3. Confirmar em *Settings → Pages* a origem `main` / `(root)` e, em *Settings → General*, que as Issues estão ativadas.
4. Revisar `paginas/privacidade.md` e `paginas/termos.md` com a assessoria jurídica, incluindo as seções sobre formulários, MailerLite e WhatsApp. Se houver encarregado de dados (DPO), indicá-lo na política.
5. Revisar os textos de garantia, de arrependimento e de fornecedor das landing pages de venda ou de proposta.

### 3.4 Conteúdo das landing pages

1. Confirmar a licença de cada produto e preencher `licenca` (o build avisa quando falta).
2. Revisar o texto de cada landing e acrescentar seções de uso em sala.

## 4. Próximas sprints

| Sprint | Objetivo | Entregas | Critérios de aceite |
|---|---|---|---|
| **2** | Acessibilidade verificável | `axe-core` ou `pa11y` no CI; revisão manual com leitor de tela (NVDA, VoiceOver); `prefers-contrast`; textos alternativos reais para as capturas do catálogo **[IA]** (gerar e revisar) (M) | 0 violações críticas no CI; todas as imagens com `alt` descritivo |
| **3** | Catálogo profissional (parcial: já existe página por produto com dados estruturados) | JSON Schema para `projects.json` validado no CI; filtros por habilidade BNCC, componente curricular e nível; citação em cada landing (G) | Filtros combináveis; esquema validado no CI |
| **3.1** | Modalidades de serviço e oferta adicional | Campo `modalidade` (recurso aberto, serviço, mentoria, consultoria, assinatura) em `projects.json`; filtro e selo nos cards; bloco `servico_adicional` renderizado nas landing pages (preço, garantia, arrependimento, fornecedor e checkout, com validação que recusa link de pagamento incompleto); suporte a `subtitle` nas publicações (M) | Cards filtráveis por modalidade; oferta adicional publicada somente com checkout real |
| **4** | Persistência local | Favoritos e "Minha sequência didática" em LocalStorage; exportar e importar JSON; versão para impressão do plano (`@media print`) (M) | Dados sobrevivem a recarregar; exportação abre em outro navegador |
| **5** | Busca unificada | Índice de busca estático gerado no build (catálogo e blog); atalhos de teclado; links com `?q=` **[IA]** (relevância e sinônimos pedagógicos) (M) | Busca única retorna recursos e posts; resposta em menos de 100 ms |
| **6** | PWA e uso offline | `manifest.webmanifest`, *service worker* (cache de ativos e JSON), tela de "sem conexão" (M) | Lighthouse PWA instalável; leitura de posts já abertos offline |
| **7** | Desempenho e qualidade | Fonte Inter auto-hospedada (WOFF2, subconjunto); CSS crítico; orçamento Lighthouse no CI; imagens de compartilhamento por post geradas no build **[IA]** (M) | Lighthouse de 95 ou mais em desempenho e acessibilidade (móvel) |
| **8** | Conteúdo técnico-pedagógico assistido | Ficha pedagógica por recurso (objetivos, habilidades, avaliação, adaptações) **[IA]** com revisão da autora; mapeamento de habilidades BNCC; série de posts (G) | Fichas revisadas publicadas; links cruzados entre posts e recursos |
| **9** | Impacto e evolução | Métricas de uso sem cookies (ex.: GoatCounter) com aviso na política; painel de indicadores; versões em inglês e espanhol **[IA]** (tradução com revisão) (G) | Relatório mensal gerado; páginas traduzidas com seletor de idioma |

## 5. Dependências e riscos

- **Publicação por dois workflows.** `blog.yml` gera as páginas e `static.yml` publica. Commits do bot não disparam outros workflows, por isso o `blog.yml` aciona o `static.yml` de forma explícita. Se o `static.yml` for renomeado ou removido, ajuste esse passo.
- **Campos ainda não suportados nas landing pages.** `servico_adicional` (mentoria paga com preço e checkout) aparece em seis landings, mas o gerador ainda não o exibe: o build avisa. O link de pagamento ainda é um marcador. Planejado para a Sprint 3.1.
- **Subtítulo de publicações.** O campo `subtitle` do novo post é ignorado pelo gerador do blog.

- **Falha silenciosa do envio ao MailerLite.** O visitante é sempre levado ao WhatsApp, mesmo se o envio falhar. Sem o teste real e o acompanhamento da lista de inscritos, a falha passa despercebida.
- **Domínio.** Se o merge ocorrer antes de o DNS e o HTTPS estarem funcionando, o `canonical` e o sitemap apontam para um endereço que não abre. Siga a ordem de `docs/DOMINIO.md`.
- **Remetente de e-mail.** Enquanto o remetente for um e-mail gratuito, a entrega das mensagens de boas-vindas tende a piorar. Autentique `biotech.pro.br`.
- **Dados pessoais no WhatsApp.** Quem entra no grupo pode ter o número visível a administradores e participantes. A política informa isso. Defina as regras do grupo e a moderação.
- **Ofertas pagas ou sob proposta.** Exigem revisão jurídica dos textos de venda, garantia e arrependimento antes de divulgar.
- **Disqus gratuito.** Pode exibir anúncios e usar dados de navegação para isso. O Giscus já está suportado pelo código como alternativa.
- **Proteção de branch.** Se a `main` for protegida, o bot do workflow não consegue publicar os arquivos gerados; permita o bot ou mude o fluxo para pull request automático.
- **Service worker (Sprint 6).** Exige cuidado com versões de cache para não manter conteúdo antigo.
