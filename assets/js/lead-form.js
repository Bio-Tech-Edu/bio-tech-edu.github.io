/* Formulários de captação de leads (MailerLite).
   Envia nome e e-mail em segundo plano e leva a pessoa à comunidade (WhatsApp).
   Regra principal: a pessoa NUNCA fica presa na página. Em caso de sucesso, falha de rede ou demora,
   o redirecionamento acontece. O endereço de envio e o destino vêm do HTML gerado pelo build
   (atributos data-lead-form, data-redirect e data-sending-label), a partir de landings/*.md. */
(function () {
  "use strict";

  // Pontos de ajuste e de teste: BTLead.redirect pode ser trocado em testes; timeout é em milissegundos.
  var api = {
    timeout: 8000,
    redirect: function (url) {
      window.location.assign(url);
    },
  };
  window.BTLead = api;

  var CAMPOS_LOCAIS = ["_gotcha", "consentimento", "comunicacoes"]; // não vão ao MailerLite

  function seguro(url) {
    return typeof url === "string" && /^https:\/\/\S+$/.test(url);
  }

  function iniciar(form) {
    var botao = form.querySelector('button[type="submit"]');
    var status = form.querySelector(".lead-status");
    var textoOriginal = botao ? botao.textContent : "";
    var enviando = false;

    function falar(texto) {
      if (status) status.textContent = texto;
    }
    function restaurar() {
      enviando = false;
      if (botao) {
        botao.disabled = false;
        botao.textContent = textoOriginal;
      }
      falar("");
    }

    // Ao voltar do WhatsApp pelo botão "voltar", o navegador pode restaurar a página já travada.
    window.addEventListener("pageshow", function (ev) {
      if (ev.persisted) restaurar();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (enviando) return;
      if (typeof form.checkValidity === "function" && !form.checkValidity()) {
        if (typeof form.reportValidity === "function") form.reportValidity();
        return;
      }

      // Campo-isca invisível para pessoas: se preenchido, é robô. Não envia e não redireciona.
      var isca = form.querySelector('[name="_gotcha"]');
      if (isca && isca.value) return;

      var destino = form.getAttribute("data-redirect");
      var dados = new URLSearchParams();
      new FormData(form).forEach(function (valor, nome) {
        if (CAMPOS_LOCAIS.indexOf(nome) === -1 && typeof valor === "string") dados.append(nome, valor);
      });

      enviando = true;
      if (botao) {
        botao.disabled = true;
        botao.textContent = form.getAttribute("data-sending-label") || "Garantindo sua vaga...";
      }
      falar("Enviando sua inscrição. Você será levado à comunidade em instantes.");

      var concluido = false;
      var controlador = typeof AbortController === "function" ? new AbortController() : null;
      var relogio = null;

      function concluir() {
        if (concluido) return;
        concluido = true;
        clearTimeout(relogio);
        if (seguro(destino)) {
          api.redirect(destino);
        } else {
          // Configuração incompleta: não há para onde levar a pessoa. Libera o formulário e avisa.
          restaurar();
          falar("Não foi possível abrir a comunidade agora. Tente novamente em instantes.");
        }
      }

      // Garante a saída mesmo se a rede travar: depois do limite, interrompe o envio e redireciona.
      relogio = setTimeout(function () {
        if (controlador) controlador.abort();
        concluir();
      }, api.timeout);

      try {
        if (typeof fetch !== "function") {
          concluir();
          return;
        }
        fetch(form.action, {
          method: "POST",
          body: dados, // application/x-www-form-urlencoded, o mesmo formato de um <form> HTML comum
          mode: "no-cors", // o MailerLite recebe o envio; a resposta não é legível a partir de outro domínio
          keepalive: true, // permite concluir o envio mesmo se a página for trocada logo em seguida
          signal: controlador ? controlador.signal : undefined,
        })
          .then(concluir)
          .catch(concluir);
      } catch (erro) {
        concluir();
      }
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("form[data-lead-form]"), iniciar);
})();
