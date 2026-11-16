# Instruções de publicação: domínio, serviços e captação de leads

Base: branch `main` no commit `9299501` ("Add: publicação no blog e adição da imagem").

## 1. O que esta entrega faz

1. **Domínio `biotech.pro.br`:** o domínio passa a vir do arquivo `CNAME`. Canonical, Open Graph, sitemap, feed, `robots.txt` e textos do repositório usam o domínio novo. Uma verificação nova impede que o endereço antigo volte.
2. **Página inicial:** "Para quem é" atualizado; glossário com serviço, mentoria, consultoria e assinatura; metodologia com os quatro pilares das landing pages; nova seção "Serviços".
3. **Captação de leads (MailerLite):** o formulário da landing de consultoria envia nome e e-mail ao MailerLite e leva a pessoa à comunidade no WhatsApp.
4. **Correção:** a landing de consultoria aparecia como "Gratuito" e o formulário enviava para um convite do WhatsApp. Agora aparece como "Sob consulta" e o envio vai ao MailerLite.
5. **Documentação:** README e plano de sprints reescritos; guias de domínio e do MailerLite; guia de landing pages atualizado.
6. **Build e publicação da `main`:** o `package.json` chamava `scripts/normalize-domain.mjs`, que não existe no repositório, e por isso `npm test` falhava. O domínio agora vem do `CNAME` e o script deixa de ser necessário. O `blog.yml` passa a acionar o `static.yml` depois de commitar as páginas geradas, porque commits do bot não disparam outros workflows.
7. **Ajustes sobre os commits recentes:** os links de acesso dos REAs usam o domínio novo; a capa da nova publicação foi convertida para WebP (de 1,6 MB para 67 KB) e movida para `assets/img/blog/`.

Não foram alterados: o carrossel do blog, o JavaScript do blog e do catálogo, e as regras de CSS existentes. As únicas regras novas de CSS são `.section-lead`, `.types-group` e `.services .cta-row`, em `assets/css/styles.css`. As regras `.blog-hero` já tinham sido removidas de `assets/css/blog.css` na `main`.

## 2. Ordem de execução

**Antes do merge:** confira o modo de publicação do Pages (`docs/DOMINIO.md`, seção 2) e faça DNS, GitHub Pages e HTTPS (passos 1 a 4). O merge muda os endereços do site e só deve ocorrer quando `https://biotech.pro.br` abrir.

```
git clone https://github.com/Bio-Tech-Edu/bio-tech-edu.github.io.git
cd bio-tech-edu.github.io
git checkout main && git pull
git checkout -b dominio-servicos-leads
git am bio-tech-edu-dominio-servicos-leads.patch
npm ci
npm test
git status --short
```

O `npm test` deve terminar com cinco linhas de ✔ (landing pages, blog, links, comentários e domínio). Os avisos de `servico_adicional`, `screenshot`, `subtitle` e `licenca` são esperados (veja a seção 5). O `git status` deve estar vazio.

```
git push -u origin dominio-servicos-leads
```

Abra o pull request, aguarde o check **Gerar blog e validar site** e faça o merge.

**Depois do merge:** MailerLite (`docs/MAILERLITE-AUTOMACAO.md`) e o teste real do formulário, antes de divulgar a página.

## 3. Conferência em produção

- `https://biotech.pro.br`: nas seções "Para quem é", "Tipos de recurso e de serviço", "Metodologia" e "Serviços", os títulos e os cards aparecem alinhados, e o menu mostra "Tipos" e "Serviços".
- Menu em largura intermediária (cerca de 800 a 1000 px) e em celular: sem rolagem horizontal.
- `https://biotech.pro.br/blog.html`: carrossel, busca e filtros funcionando.
- `https://biotech.pro.br/recursos/consultoria-educacional-biotech.html`: selo "Sob consulta", formulário no topo.
- Envio de teste do formulário (janela anônima e celular): botão "Garantindo sua vaga...", abertura do WhatsApp e novo inscrito em *Subscribers* do MailerLite.
- `https://biotech.pro.br/sitemap.xml` e `robots.txt` com o domínio novo.

## 4. Como reverter

```
git checkout main && git pull
git log --oneline -8
git checkout -b reverter-dominio-servicos-leads
git revert --no-edit HEAD~N..HEAD     # N = número de commits da entrega
git push -u origin reverter-dominio-servicos-leads
```

Se o merge foi *Squash and merge*, use `git revert --no-edit HEAD`. A reversão de domínio também exige remover o domínio personalizado em *Settings → Pages* (veja `docs/DOMINIO.md`).

## 5. Avisos esperados do build

| Aviso | Significado |
|---|---|
| `campo desconhecido "servico_adicional"` (6 landings) | O gerador ainda não exibe a oferta adicional (mentoria paga). O link de pagamento é um marcador. O texto do corpo da página continua publicado |
| `campo desconhecido "screenshot"` (mapa de preferências) | O campo correto é `imagem`; a página usa a captura do catálogo |
| `campo desconhecido "subtitle"` (publicação de IA) | O gerador do blog ainda não exibe subtítulos |
| `falta "licenca"` | Confirme a licença de cada produto e preencha o campo |

## 6. Pontos não verificados

- **Aparência visual:** as páginas foram conferidas por estrutura e comportamento, sem renderização em navegador. Confira o layout em desktop, em largura intermediária e em celular, nos dois temas.
- **Envio ao MailerLite:** não foi possível testar contra o serviço real a partir do ambiente de desenvolvimento. O teste real da seção 3 é obrigatório.
- **DNS e HTTPS do domínio novo:** não foi possível consultar o DNS a partir do ambiente de desenvolvimento.
