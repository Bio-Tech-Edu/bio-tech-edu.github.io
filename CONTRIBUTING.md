# Como contribuir

Obrigada pelo interesse em colaborar com o Bio+Tech EduDesign. Este projeto reúne recursos educacionais abertos para professores, estudantes universitários e estagiários, e toda contribuição deve tornar o material mais correto, acessível e útil em sala de aula.

Antes de começar, veja a [Wiki da comunidade](https://github.com/Bio-Tech-Edu/.github/wiki) e as [regras de convivência](https://bio-tech-edu.github.io/termos.html).

## Formas de contribuir

| Tipo | Como | Onde |
|---|---|---|
| Sugerir um recurso | Abra uma issue "Sugerir recurso educacional" | Issues |
| Sugerir um tema de blog | Abra uma issue "Sugerir tema para o blog" | Issues |
| Escrever uma publicação | Pull request com um arquivo em `posts/` | `posts/`, `assets/img/blog/` |
| Corrigir um texto ou recurso | Pull request com a correção | arquivo afetado |
| Melhorar acessibilidade | Relate um problema ou envie a correção | `assets/`, `index.html` |
| Corrigir o código | Pull request pequeno e focado | `assets/js/`, `assets/css/`, `scripts/` |

## Fluxo de trabalho

1. Crie uma branch a partir da `main` (ex.: `blog/tema-da-publicacao`).
2. Faça a mudança e rode `npm ci` e `npm test`. O teste converte os textos do blog e valida links, imagens, IDs e a configuração de comentários.
3. Abra um pull request usando o modelo que aparece automaticamente e aguarde o check ficar verde.
4. Uma pessoa da equipe mantenedora revisa. Ajustes podem ser pedidos antes do *merge*.

Pull requests devem ser pequenos e tratar de um assunto por vez.

## Escrever uma publicação

1. Copie `posts/_modelo.md` para `posts/AAAA-MM-DD-titulo-curto.md`.
2. Preencha o cabeçalho. Cada campo aparece **uma única vez**; campo repetido impede a publicação do texto e o erro aparece com arquivo e linha.
3. Escreva em markdown, com títulos `##` e `###` (eles formam o sumário).
4. Use imagens em `assets/img/blog/`, em WebP e com até 1200 px de largura.
5. Descreva cada imagem informativa no campo `alt` (texto alternativo). Imagens apenas decorativas podem ter `alt` vazio.

Conteúdo científico e normativo deve citar fontes. Para normas como a BNCC, indique o documento e o código da habilidade.

## Código

- Mantenha **HTML, CSS e JavaScript separados**: estrutura em `.html`, estilo em `assets/css/`, comportamento em `assets/js/`.
- Não adicione dependências novas sem discutir antes. O projeto roda em GitHub Pages, sem servidor, e o único passo de build é a conversão do blog.
- Siga as diretrizes WCAG 2.2 nível AA: foco visível, contraste, alvos de toque de 44 px, respeito a `prefers-reduced-motion` e nomes acessíveis em botões e links.
- Evite trocar um arquivo gerado à mão (`blog/*.html`, `blog.html`, `privacidade.html`, `termos.html`, `404.html`, `sitemap.xml`): ele é recriado pelo build. Para alterar o cabeçalho ou o rodapé, edite `index.html`.

## Comentários e moderação

Os comentários são feitos pelo Disqus e seguem as [regras de convivência](https://bio-tech-edu.github.io/termos.html). Para denunciar um comentário, use o recurso do próprio Disqus ou abra uma issue "Denunciar comentário" sem incluir dados pessoais.

## Licenças

Ao contribuir, você concorda que:

- textos, imagens e recursos próprios sejam publicados sob [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.pt);
- o código seja publicado sob [MIT](https://opensource.org/licenses/MIT).

Você deve ter direito de usar tudo o que enviar. Não envie material protegido por direitos autorais de terceiros sem permissão.

## Conduta

Trate as pessoas com respeito. Críticas são bem-vindas quando dirigidas ao trabalho, nunca às pessoas. Condutas de assédio ou discriminação levam à remoção da contribuição e ao bloqueio do participante.

## Dúvidas

Use a [Wiki da comunidade](https://github.com/Bio-Tech-Edu/.github/wiki) ou uma issue sem dados pessoais.
