// Alternância de tema claro/escuro (a escolha é salva no navegador).
const themeBtn = document.getElementById("theme-toggle");
function syncThemeButton() {
  const light = document.documentElement.getAttribute("data-theme") === "light";
  if (themeBtn) themeBtn.textContent = light ? "Tema escuro" : "Tema claro";
}
themeBtn?.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
  syncThemeButton();
});
syncThemeButton();
