# Instruções de publicação: modelos do setor educacional

Base: branch `main` no commit `d0a422d`. Este pacote traz 7 commits: as correções do blog, as landing pages dos produtos e a nova estrutura de páginas avulsas (propostas e kits gratuitos).

## 1. Arquivos

| Arquivo | Uso |
|---|---|
| `bio-tech-edu-setor-educacional.patch` | 7 commits sobre `d0a422d`. Use para publicar pelo Git. |
| `bio-tech-edu-setor-educacional.zip` | Projeto completo já atualizado, para subir pela interface do GitHub. |
| `blog.html` | Página do blog (sem alterações desde a entrega anterior). |

## 2. Aplicar e testar

```
git clone https://github.com/Bio-Tech-Edu/bio-tech-edu.github.io.git
cd bio-tech-edu.github.io
git checkout main && git pull
git checkout -b setor-educacional
git am bio-tech-edu-setor-educacional.patch
npm ci
npm test
git status --short
```

O `npm test` deve terminar com:

```
✔ 8 de 8 página(s) gerada(s) (recursos/ e lp/). 8 aviso(s).
✔ 5 de 5 publicação(ões) gerada(s); blog, páginas institucionais e sitemap atualizados.
✔ 18 páginas verificadas: links, imagens e IDs ok.
✔ comentários: provedor "disqus" configurado e chaves do script conferidas.
```

Os 8 avisos são de **licença** dos produtos do catálogo. Confirme a licença de cada um e preencha o campo `licenca` em `landings/<slug>.md`. O `git status` deve estar vazio depois do build.

## 3. O que muda para o visitante

Ao publicar, **nenhuma página nova fica pública automaticamente**. Os modelos de proposta e de kit gratuito começam com `_` e o build os ignora até que você os copie e preencha. Assim, a publicação não expõe números, depoimentos ou ofertas que ainda não foram verificados.

Muda, de imediato:

- A **política de privacidade** ganha a seção 2.1, sobre os dados enviados por formulários.
- Os **termos de uso** ganham a seção 6, sobre propostas e materiais gratuitos.
- As **landing pages dos produtos** continuam como estão.

## 4. Publicar

```
git push -u origin setor-educacional
```

Abra o pull request para `main` e confirme que o check **Gerar blog e validar site** está verde. Faça o merge. O workflow regenera as páginas e publica o GitHub Pages em cerca de um minuto.

Conferência em produção, com janela anônima ou Ctrl+F5:

- `privacidade.html`: a seção 2.1 aparece.
- `termos.html`: a seção 6 aparece.
- Catálogo: os 8 cards continuam com **Ver detalhes**.

## 5. Usar os modelos (quando a oferta estiver pronta)

1. Copie `landings/_modelo-proposta.md` ou `landings/_modelo-captura.md` para `landings/<slug>.md`.
2. Substitua **todos** os marcadores entre colchetes duplos por informação real. O build recusa a página e aponta a linha de cada marcador.
3. Para o kit gratuito, coloque o arquivo em `assets/downloads/` e confirme o nome em `formulario.arquivo`.
4. Configure o serviço de formulário e informe o endereço https em `formulario.endpoint`. Confirme no painel dele que os envios chegam ao e-mail certo.
5. Rode `npm test`. A página aparece em `lp/<slug>.html`.
6. Antes de publicar, siga a seção 13 do guia (revisão jurídica e LGPD).

O guia completo está em `docs/GUIA-LANDING-PAGES.md`.

## 6. Como reverter

Os hashes mudam ao aplicar o patch, então use a posição no histórico:

```
git checkout main && git pull
git log --oneline -8                  # confira: os 7 commits da entrega no topo
git checkout -b reverter-setor-educacional
git revert --no-edit HEAD~7..HEAD
git push -u origin reverter-setor-educacional
```

Se o merge foi **Squash and merge**, a entrega virou um commit: use `git revert --no-edit HEAD`.

## 7. Pontos não verificados e pendências

- **Aparência visual:** as páginas foram conferidas por estrutura e comportamento, sem renderizar no navegador. Confira `lp/*.html` com os modelos preenchidos em desktop, celular e nos dois temas antes de divulgar.
- **Conteúdo do documento:** os números, depoimentos e a descrição da equipe do modelo original não foram publicados, porque não há como verificá-los. Substitua por dados reais, ou apague o campo.
- **Oferta fora do catálogo:** o Projeto Executivo não é um recurso aberto. Confirme se ele deve aparecer neste site, já que o projeto é uma vitrine de recursos educacionais abertos.
- **Revisão jurídica e LGPD:** antes de qualquer página de proposta ou de captura, veja a seção 13 do guia.
- **Assets antigos:** os PNGs em `assets/blog/` continuam no repositório. Não são usados e podem sair em outra entrega.
