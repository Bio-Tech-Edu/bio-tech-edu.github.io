# MailerLite: captação de leads e e-mail de boas-vindas

Este guia explica como o formulário das landing pages envia os dados ao MailerLite e como configurar, no painel, o e-mail de boas-vindas com o acesso aos Recursos Educacionais Abertos (REAs). Os nomes dos menus podem mudar conforme o MailerLite atualiza o painel; confira sempre na tela.

## 1. Como o fluxo funciona

1. A pessoa preenche **nome** e **e-mail** e marca o aceite no formulário da landing (`landings/consultoria-educacional-biotech.md`).
2. O navegador envia os dados ao endereço do formulário do MailerLite, em segundo plano (`assets/js/lead-form.js`).
3. O botão mostra "Garantindo sua vaga..." e, em seguida, a pessoa é levada ao convite da comunidade no WhatsApp.
4. No MailerLite, a pessoa entra no grupo do formulário e a **automação** envia o e-mail de boas-vindas.

Regra de segurança do fluxo: a pessoa **sempre** é levada ao WhatsApp, mesmo que o envio ao MailerLite falhe ou demore mais de 8 segundos. Por isso, uma falha de envio **não aparece para o visitante**. Faça o teste real da seção 6 e acompanhe a lista de inscritos.

## 2. Configuração no repositório

No cabeçalho da landing, o bloco `formulario` fica assim:

```yaml
formulario:
  provedor: "mailerlite"
  posicao: "topo"
  endpoint: "https://assets.mailerlite.com/jsonp/<conta>/forms/<formulário>/subscribe"
  redirecionar: "https://chat.whatsapp.com/<convite>"
  titulo: "Título do formulário"
  botao: "Acessar CVIP"
  botao_enviando: "Garantindo sua vaga..."
  consentimento: "Texto do aceite."
```

Os campos enviados são `fields[name]` e `fields[email]`, mais os campos ocultos `ml-submit` e `anticsrf`, no formato do próprio formulário embutido do MailerLite. O build recusa a página se o `endpoint` não tiver o formato do MailerLite ou se faltar `redirecionar`.

## 3. Preparação no MailerLite (uma vez)

### 3.1 Autenticar o domínio de envio

O MailerLite aceita remetente de e-mail gratuito (como Gmail), mas desaconselha, porque a entrega nas caixas de entrada piora. Com o domínio novo, use um remetente próprio.

1. Em *Account settings → Domains*, adicione `biotech.pro.br` e crie no DNS os registros que o MailerLite indicar (DKIM e SPF). Se possível, publique também uma política DMARC.
2. Crie o endereço `contato@biotech.pro.br` (ou outro) em uma caixa de e-mail que você consiga acessar, para receber a verificação.
3. Em *Account settings → Company/Account details*, preencha o nome e o endereço da organização que aparecem no rodapé dos e-mails.

### 3.2 Grupo do formulário

No formulário embutido (*Forms → Embedded forms*), confirme em qual **grupo** as pessoas inscritas entram, por exemplo "CVIP - Comunidade". Se não existir, crie o grupo e associe ao formulário.

### 3.3 Confirmação por e-mail (double opt-in)

Escolha uma das opções em *Subscribe settings* (ou nas configurações do formulário):

| Opção | Efeito | Quando usar |
|---|---|---|
| **Desligada** | A pessoa entra na lista na hora e a automação envia o boas-vindas **imediatamente** | Quando a prioridade é a entrega imediata do acesso |
| **Ligada** | O MailerLite envia primeiro um e-mail de confirmação, e a automação dispara só depois do clique | Quando se quer prova de consentimento mais forte e proteção contra e-mails falsos |

Como o visitante é levado ao WhatsApp logo após o envio, a opção desligada atende ao objetivo de enviar o boas-vindas imediatamente. Com a opção ligada, personalize o e-mail de confirmação para já trazer o acesso aos REAs.

## 4. Criar a automação de boas-vindas

1. Abra *Automations* e clique em **Create workflow**. Nome sugerido: `Boas-vindas CVIP + REAs`.
2. Em **Trigger**, escolha **When subscriber joins a group** e selecione o grupo do formulário. Alternativa: **When subscriber completes a form** e selecione o formulário.
3. Clique em **Add step** → **Email**.
4. Preencha:

| Campo | Valor sugerido |
|---|---|
| Nome do remetente | Bio+Tech EduDesign |
| E-mail do remetente | `contato@biotech.pro.br` (domínio autenticado) |
| Assunto | Bem-vindo(a) à CVIP: seus REAs abertos estão aqui |
| Texto de pré-visualização | Acesse os Recursos Educacionais Abertos e entre na comunidade. |
| Responder para | `contato@biotech.pro.br` |

5. Em **Design email**, monte o conteúdo da seção 5. Não adicione passo de espera (*Delay*) antes do e-mail, para que ele saia imediatamente.
6. Em **Workflow settings**, deixe desmarcada a opção de a mesma pessoa entrar de novo no fluxo.
7. Clique em **Review** e depois em **Activate**.

## 5. Conteúdo do e-mail de boas-vindas

Use o campo de nome do MailerLite (`{$name}`) e defina um texto alternativo caso o nome esteja vazio.

> **Olá, {$name}!**
>
> Que bom ter você na Comunidade Virtual de Inovação Pedagógica (CVIP) da Bio+Tech EduDesign.
>
> **Seus acessos**
>
> 1. **Recursos Educacionais Abertos (REAs):** https://biotech.pro.br/#projetos
> 2. **Comunidade no WhatsApp:** https://chat.whatsapp.com/Fzi4OJkWyMq4qjGdjovfiZ
> 3. **Blog com guias e artigos:** https://biotech.pro.br/blog.html
>
> **Para começar:** escolha um recurso do catálogo pela habilidade da BNCC que você quer trabalhar, abra a página do recurso e confira a licença de uso indicada.
>
> Você recebeu este e-mail porque se inscreveu na nossa comunidade. Para cancelar, use o link no fim da mensagem. Política de privacidade: https://biotech.pro.br/privacidade.html
>
> Equipe Bio+Tech EduDesign

Cuidados com o conteúdo:

- Mantenha o link de cancelamento que o MailerLite coloca no rodapé.
- Revise as licenças dos recursos antes de afirmar que são gratuitos ou abertos: cada produto tem condições próprias.
- Inclua uma versão em texto simples do e-mail.

## 6. Teste real (obrigatório antes de divulgar)

1. Abra `https://biotech.pro.br/recursos/consultoria-educacional-biotech.html` em uma janela anônima.
2. Preencha com um e-mail seu que não esteja na lista e envie. Confirme que o botão muda para "Garantindo sua vaga..." e que o WhatsApp abre.
3. No MailerLite, abra *Subscribers* e confirme que o e-mail apareceu, no grupo correto, em poucos minutos.
4. Abra a aba de atividade da automação e confirme que o e-mail foi enviado.
5. Confira a caixa de entrada e o spam, o remetente e os links.
6. Repita em um celular.

Se o e-mail de teste **não** aparecer em *Subscribers*, o envio em segundo plano não foi aceito. Nesse caso, avise para investigar o formato do envio. Enquanto isso, não divulgue a página, porque o visitante continuaria sendo levado ao WhatsApp sem ser registrado.

## 7. Manutenção e LGPD

- Acompanhe a lista de inscritos e compare com as entradas no grupo do WhatsApp. Diferença grande indica falha de envio.
- Para atender a um pedido de exclusão, apague a pessoa em *Subscribers* e responda ao pedido no prazo.
- O texto do aceite fica no arquivo da landing (`formulario.consentimento`) e deve citar o MailerLite. A política de privacidade descreve o tratamento na seção 2.1.
- Não adicione o script "MailerLite Universal" nas páginas sem antes incluir um aviso de cookies e atualizar a política de privacidade: ele não é necessário para o formulário funcionar.
