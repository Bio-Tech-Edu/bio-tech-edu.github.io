# Domínio biotech.pro.br: processo de migração e manutenção

O site passa a ser servido em **biotech.pro.br**. O endereço anterior, bio-tech-edu.github.io, continua existindo como endereço técnico do GitHub Pages e passa a redirecionar para o domínio novo depois que o domínio personalizado é configurado.

## 1. O que já está no repositório

| Item | Situação |
|---|---|
| Arquivo `CNAME` com `biotech.pro.br` | Pronto (fonte única do domínio) |
| `canonical`, Open Graph, sitemap, feed RSS, `robots.txt` e dados estruturados | Gerados a partir do `CNAME` pelo build (`scripts/lib/site.mjs`) |
| Verificação automática `scripts/check-domain.mjs` | Roda no `npm test` e no workflow. Falha se o `CNAME` sumir, se um arquivo ainda citar o endereço antigo ou se canonical, sitemap e robots divergirem |

Para trocar de domínio no futuro, edite **somente** o `CNAME`, atualize o `canonical` do `index.html` e rode `npm test`. O teste indica o que faltar.

## 2. Como o Pages publica este repositório (confira antes de começar)

O repositório tem dois workflows em `.github/workflows/`:

| Workflow | Função |
|---|---|
| `blog.yml` (Gerar blog e validar site) | Converte os textos, valida o site, commita os arquivos gerados e aciona o `static.yml` |
| `static.yml` | Publica o repositório inteiro no GitHub Pages por GitHub Actions |

Em *Settings → Pages → Build and deployment → Source*, confira qual modo está ativo:

| Modo | Onde fica o domínio | O arquivo `CNAME` |
|---|---|---|
| **GitHub Actions** (o `static.yml` indica este modo) | Somente em *Settings → Pages → Custom domain* | Ignorado pelo Pages, mas este projeto o usa como fonte única do domínio no build. Mantenha os dois iguais |
| **Deploy from a branch** | No arquivo `CNAME` da raiz, que o GitHub mantém ao salvar o domínio | Essencial: se for apagado, o domínio é perdido na próxima publicação |

Por que o `blog.yml` aciona o `static.yml`: commits feitos pelo `GITHUB_TOKEN` não disparam outros workflows. Sem o acionamento explícito, as páginas geradas pelo bot ficariam no repositório mas não iriam ao ar até o próximo commit manual.

## 3. Ordem recomendada de execução

Faça os passos 1 a 4 **antes** de fazer o *merge* do pull request que muda os endereços do site. Assim, nenhum `canonical` ou sitemap aponta para um endereço que ainda não abre.

### Passo 1. DNS (no painel do Registro.br ou do provedor de DNS que você usa)

| Tipo | Nome | Valor |
|---|---|---|
| A | `biotech.pro.br` (raiz) | `185.199.108.153` |
| A | `biotech.pro.br` (raiz) | `185.199.109.153` |
| A | `biotech.pro.br` (raiz) | `185.199.110.153` |
| A | `biotech.pro.br` (raiz) | `185.199.111.153` |
| AAAA (opcional) | `biotech.pro.br` (raiz) | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| CNAME | `www` | `bio-tech-edu.github.io` |

Confira os valores na documentação oficial do GitHub Pages ("Managing a custom domain for your GitHub Pages site") antes de criar os registros, porque os endereços podem ser atualizados. Se o domínio usa DNSSEC, confira se continua válido depois da alteração. A propagação pode levar de minutos a algumas horas.

### Passo 2. GitHub Pages

1. Repositório → *Settings → Pages → Custom domain*: informe `biotech.pro.br` e salve. O GitHub confere o DNS. O arquivo `CNAME` já existe e não deve ser apagado.
2. Aguarde o certificado ser emitido (pode levar de alguns minutos até cerca de 24 horas).
3. Marque **Enforce HTTPS**.

### Passo 3. Verificação do domínio na organização (recomendado)

Em *Organization settings → Pages → Add a domain*, adicione `biotech.pro.br` e crie o registro TXT que o GitHub indicar (nome iniciado por `_github-pages-challenge-`). Isso impede que outra conta use o seu domínio no GitHub Pages.

### Passo 4. Conferir antes do merge

```
nslookup biotech.pro.br
curl -I https://biotech.pro.br
curl -I https://www.biotech.pro.br
curl -I bio-tech-edu.github.io
```

Esperado: o domínio responde com HTTPS válido, `www` redireciona para a raiz e o endereço antigo redireciona para o novo. Depois, abra `https://biotech.pro.br/blog.html` e confira o carrossel.

### Passo 5. Merge e conferência no ar

Faça o *merge*. O workflow regenera os arquivos e o Pages publica. Abra `https://biotech.pro.br/sitemap.xml` e `https://biotech.pro.br/robots.txt` e confira que os endereços são do domínio novo.

## 4. Serviços externos que dependem do endereço

| Serviço | O que fazer |
|---|---|
| **Disqus** | No painel de administração do site, em *Settings → General*, troque a URL do site para `https://biotech.pro.br` e inclua `biotech.pro.br` nos domínios confiáveis (mantenha o endereço antigo durante a transição). Os comentários existentes continuam ligados às publicações, porque o site usa o identificador de cada publicação (`disqus_identifier`). Se algum comentário antigo não aparecer, use a ferramenta de migração de URLs do Disqus (URL Mapper). |
| **MailerLite** | O endereço de envio do formulário não depende do domínio do site. O domínio entra na autenticação do remetente (veja `docs/MAILERLITE-AUTOMACAO.md`). |
| **Giscus** | Não é afetado (usa o repositório, não o endereço do site). |
| **Google Search Console** | Adicione a propriedade `biotech.pro.br` (verificação por registro DNS) e envie `https://biotech.pro.br/sitemap.xml`. A ferramenta de mudança de endereço não se aplica ao endereço do GitHub Pages: o redirecionamento do próprio GitHub cumpre esse papel. |
| **Redes sociais, assinaturas de e-mail e a comunidade do WhatsApp** | Atualize os links para o domínio novo. Os endereços antigos continuam funcionando pelo redirecionamento. |
| **Sites dos REAs (outros repositórios da organização)** | Os links de acesso das landing pages passam a apontar para `https://biotech.pro.br/<repositório>/` (por exemplo, `/cinetica/`). Depois do DNS, abra cada link e confirme que o recurso carrega. Se algum repositório tiver domínio próprio, o link deve usar esse domínio. |
| **Wiki e README de outros repositórios da organização** | Troque links para o endereço antigo do site, quando houver. |

## 5. Como reverter

Se for preciso voltar ao endereço anterior:

1. Em *Settings → Pages*, remova o domínio personalizado.
2. Reverta o pull request da migração (`git revert`), o que restaura os endereços nos arquivos.
3. Rode `npm test`. Sem o arquivo `CNAME`, a verificação de domínio falha de propósito: o `CNAME` é o que protege o domínio. Depois da reversão, o build usa o endereço padrão do GitHub Pages.

## 6. Problemas comuns

| Sintoma | Causa provável |
|---|---|
| "DNS check unsuccessful" no GitHub | Registros ainda não propagaram ou há registros antigos conflitantes na raiz |
| Opção *Enforce HTTPS* desabilitada | Certificado ainda em emissão; aguarde e recarregue a página de configuração |
| O domínio some do GitHub depois de uma publicação | O arquivo `CNAME` foi apagado. O `npm test` impede isso |
| Disqus não carrega nas publicações | O domínio novo não está na lista de domínios confiáveis do Disqus |
