(() => {
  const topbar = document.getElementById("topbar");
  const yearEl = document.getElementById("ano");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Ajusta a altura real do header para scroll-padding e observer (zero bug)
  const setHeaderHeight = () => {
    if (!topbar) return;
    const h = Math.ceil(topbar.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--header-h", `${h}px`);
  };

  // Menu mobile profissional
  const toggleBtn = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const overlay = document.querySelector("[data-nav-overlay]");
  const navLinks = nav ? Array.from(nav.querySelectorAll('a[href^="#"]')) : [];

  const openNav = () => {
    document.body.classList.add("nav-open");
    toggleBtn?.setAttribute("aria-expanded", "true");
    toggleBtn?.setAttribute("aria-label", "Fechar menu");
  };

  const closeNav = () => {
    document.body.classList.remove("nav-open");
    toggleBtn?.setAttribute("aria-expanded", "false");
    toggleBtn?.setAttribute("aria-label", "Abrir menu");
  };

  const isNavOpen = () => document.body.classList.contains("nav-open");

  toggleBtn?.addEventListener("click", () => {
    isNavOpen() ? closeNav() : openNav();
  });

  overlay?.addEventListener("click", closeNav);

  navLinks.forEach((a) => a.addEventListener("click", closeNav));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isNavOpen()) closeNav();
  });

  document.addEventListener("click", (e) => {
    if (!isNavOpen()) return;
    const t = e.target;
    const insideNav = nav?.contains(t);
    const insideBtn = toggleBtn?.contains(t);
    if (!insideNav && !insideBtn) closeNav();
  });

  // Active nav state com IntersectionObserver
  const sections = Array.from(
    document.querySelectorAll("main[id], section[id]"),
  );
  const navAllLinks = Array.from(
    document.querySelectorAll('.nav a[href^="#"]'),
  );

  const clearActive = () =>
    navAllLinks.forEach((a) => a.classList.remove("is-active"));
  const setActive = (id) => {
    clearActive();
    const link = navAllLinks.find((a) => a.getAttribute("href") === `#${id}`);
    if (link) link.classList.add("is-active");
  };

  const buildObserver = () => {
    if (!("IntersectionObserver" in window)) return null;
    const headerH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-h",
        ),
      ) || 74;

    return new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) setActive(visible[0].target.id);
      },
      {
        threshold: [0.25, 0.4, 0.55],
        rootMargin: `-${headerH + 10}px 0px -55% 0px`,
      },
    );
  };

  let observer = null;
  const initObserver = () => {
    observer?.disconnect?.();
    observer = buildObserver();
    if (!observer) return;
    sections.forEach((sec) => observer.observe(sec));
  };

  // Fallback de imagens (nunca quebra)
  const applyImageFallbacks = () => {
    const imgs = Array.from(document.querySelectorAll("img[data-fallback]"));
    imgs.forEach((img) => {
      img.addEventListener(
        "error",
        () => {
          const parent = img.closest(".imgbox") || img.parentElement;
          if (parent) parent.classList.add("img-fallback");
          img.remove(); // remove o ícone quebrado
        },
        { once: true },
      );
    });
  };

  // Copiar WhatsApp
  const copyBtn = document.getElementById("copyPhone");
  copyBtn?.addEventListener("click", async () => {
    const phone = "14988321868";
    try {
      await navigator.clipboard.writeText(phone);
      const old = copyBtn.textContent;
      copyBtn.textContent = "Copiado ✅";
      setTimeout(() => (copyBtn.textContent = old), 1600);
    } catch {
      // fallback: seleciona via prompt
      window.prompt("Copie o número:", phone);
    }
  });

  // WhatsApp flutuante inteligente: some ao entrar no contato
  const floatWa = document.querySelector(".float-wa");
  const contact = document.getElementById("contato");
  const smartFloat = () => {
    if (!floatWa || !contact || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        floatWa.style.opacity = e.isIntersecting ? "0" : "1";
        floatWa.style.pointerEvents = e.isIntersecting ? "none" : "auto";
      },
      { threshold: 0.35 },
    );
    io.observe(contact);
  };

  const onReady = () => {
    setHeaderHeight();
    initObserver();
    applyImageFallbacks();
    smartFloat();
  };

  window.addEventListener("resize", () => {
    setHeaderHeight();
    initObserver();
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      setHeaderHeight();
      initObserver();
    });
  }

  document.addEventListener("DOMContentLoaded", onReady);
})();
