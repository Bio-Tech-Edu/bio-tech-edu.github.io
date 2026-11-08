/* Comentários por publicação (Disqus ou Giscus), carregados somente após o clique do leitor.
   Configuração em blog/config.json → "comentarios". Cada chave lida aqui precisa existir no config:
   scripts/check-comments.mjs valida isso no build. */
(function () {
  const box = document.getElementById("comentarios");
  if (!box) return;
  const status = document.getElementById("comments-status");
  const btn = document.getElementById("load-comments");
  const embed = document.getElementById("comments-embed");
  const { slug, url, title } = box.dataset;
  const SHORTNAME = /^[a-z0-9][a-z0-9-]{0,49}$/i;
  const theme = () => (document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");

  function say(...nodes) {
    status.replaceChildren(...nodes);
  }
  function privacyLink() {
    const a = document.createElement("a");
    a.href = "../privacidade.html";
    a.textContent = "política de privacidade";
    return a;
  }
  function textWithPrivacy(before) {
    return [document.createTextNode(before + " Leia a "), privacyLink(), document.createTextNode(".")];
  }

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

  function loadDisqus(shortname, onFail) {
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
    s.onerror = onFail;
    document.body.append(s);
  }

  fetch("config.json")
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}))
    .then((cfg) => {
      const c = cfg.comentarios || {};
      const g = c.giscus || {};
      const d = c.disqus || {};
      const giscusOk = c.provedor === "giscus" && g.repo && g.repoId && g.categoryId;
      const disqusOk = c.provedor === "disqus" && SHORTNAME.test(String(d.shortname || ""));

      if (!giscusOk && !disqusOk) {
        say(document.createTextNode("Os comentários serão ativados em breve. Enquanto isso, participe da comunidade pela página do blog."));
        return;
      }

      const provedor = giscusOk ? "Giscus" : "Disqus";
      btn.textContent = `Carregar comentários (${provedor})`;
      say(...(giscusOk
        ? textWithPrivacy("Os comentários usam o Giscus, que exige uma conta no GitHub. Ao carregar, o conteúdo é servido por giscus.app e github.com.")
        : textWithPrivacy("Os comentários usam o Disqus, serviço de terceiros. Ao carregar, você concorda que ele defina cookies e trate seus dados de navegação e de comentário.")));
      btn.hidden = false;

      let carregando = false;
      btn.addEventListener("click", () => {
        if (carregando) return;
        carregando = true;
        btn.hidden = true;
        if (giscusOk) {
          loadGiscus(g);
          return;
        }
        loadDisqus(d.shortname, () => {
          // falha de rede ou bloqueio (ex.: bloqueador de conteúdo): permite tentar de novo
          carregando = false;
          embed.removeAttribute("id");
          embed.replaceChildren();
          say(document.createTextNode("Não foi possível carregar os comentários agora. Verifique sua conexão ou desative o bloqueador de conteúdo e tente novamente."));
          btn.hidden = false;
        });
      });
    });
})();
