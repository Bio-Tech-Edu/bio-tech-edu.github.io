/* Página de publicação: preenche a data de acesso da citação (ABNT) e permite copiá-la. */
(function () {
  const { abntDate } = window.BT;
  document.querySelectorAll("[data-acesso]").forEach((n) => (n.textContent = abntDate(new Date())));
  const btn = document.getElementById("copy-cite");
  const txt = document.getElementById("cite-text");
  const st = document.getElementById("cite-status");
  if (!btn || !txt || !st) return;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(txt.textContent.trim().replace(/\s+/g, " "));
      st.textContent = "Citação copiada.";
    } catch (e) {
      st.textContent = "Não foi possível copiar. Selecione o texto manualmente.";
    }
  });
})();
