/* Comentários por publicação (Giscus ou Disqus), carregados somente após o clique do leitor.
   Configuração em blog/config.json → "comentarios". */
(function () {
  const box = document.getElementById("comentarios");
  if (!box) return;
  const status = document.getElementById("comments-status");
  const btn = document.getElementById("load-comments");
  const embed = document.getElementById("comments-embed");
  const { slug, url, title } = box.dataset;
  const theme = () => (document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");

  function loadGiscus(g) {
    embed.id = "giscus-embed";
    const s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    const attrs = {
      "data-repo": g.repo, "data-repo-id": g.repoId, "data-category": g.category || "Comentários", "data-category-id": g.categoryId,
      "data-mapping": "specific", "data-term": slug, "data-strict": "1", "data-reactions-enabled": "1", "data-emit-metadata": "0",
      "data-input-position": "top", "data-theme": theme(), "data-lang": "pt", "data-loading": "lazy",
    };
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    s.crossOrigin = "anonymous";
    s.async = true;
    embed.append(s);
    // acompanha a alternância de tema do site
    new MutationObserver(() => {
      const frame = document.querySelector("iframe.giscus-frame");
      if (frame) frame.contentWindow.postMessage({ giscus: { setConfig: { theme: theme() } } }, "https://giscus.app");
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  function loadDisqus(shortname) {
    embed.id = "disqus_thread";
    window.disqus_config = function () {
      this.page.url = url;
      this.page.identifier = slug;
      this.page.title = title;
    };
    const s = document.createElement("script");
    s.src = `https://${shortname}.disqus.com/embed.js`;
    s.setAttribute("data-timestamp", String(Date.now()));
    s.async = true;
    document.body.append(s);
  }

  fetch("config.json").then((r) => (r.ok ? r.json() : {})).catch(() => ({})).then((cfg) => {
    const c = cfg.comentarios || {};
    const g = c.giscus || {};
    const d = c.disqus || {};
    const giscusOk = c.provedor === "giscus" && g.repo && g.repoId && g.categoryId;
    const disqusOk = c.provedor === "disqus" && d.shortname;
    if (!giscusOk && !disqusOk) {
      status.textContent = "Os comentários serão ativados em breve. Enquanto isso, participe da comunidade pela página do blog.";
      return;
    }
    status.textContent = giscusOk
      ? "Os comentários usam o Giscus e exigem uma conta no GitHub. Ao carregar, o conteúdo é servido por giscus.app e github.com."
      : "Os comentários usam o Disqus, serviço de terceiros que pode registrar dados de navegação. Ao carregar, você aceita o uso de cookies do Disqus.";
    btn.hidden = false;
    btn.addEventListener("click", () => {
      btn.hidden = true;
      if (giscusOk) loadGiscus(g); else loadDisqus(d.shortname);
    }, { once: true });
  });
})();
