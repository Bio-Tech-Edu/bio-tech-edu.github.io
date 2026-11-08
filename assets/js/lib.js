/* Utilitários compartilhados (namespace global BT). Carregar antes dos demais scripts. */
window.BT = (function () {
  const el = (tag, props = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    kids.flat().forEach((c) => c != null && n.append(c));
    return n;
  };
  const norm = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  const MESES = ["jan.", "fev.", "mar.", "abr.", "maio", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];
  const abntDate = (d) => `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
  return { el, norm, fmtDate, abntDate };
})();
