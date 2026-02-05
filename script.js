(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Menu mobile
  const btn = document.querySelector(".navbtn");
  const overlay = document.querySelector("[data-overlay]");
  const nav = document.getElementById("nav");
  const links = nav ? Array.from(nav.querySelectorAll('a[href^="#"]')) : [];

  const open = () => {
    document.body.classList.add("nav-open");
    btn?.setAttribute("aria-expanded", "true");
    btn?.setAttribute("aria-label", "Fechar menu");
  };
  const close = () => {
    document.body.classList.remove("nav-open");
    btn?.setAttribute("aria-expanded", "false");
    btn?.setAttribute("aria-label", "Abrir menu");
  };
  const isOpen = () => document.body.classList.contains("nav-open");

  btn?.addEventListener("click", () => (isOpen() ? close() : open()));
  overlay?.addEventListener("click", close);
  links.forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // Active state SEM mexer layout (CSS já garante borda fixa)
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const sections = Array.from(
    document.querySelectorAll("main#inicio, section[id]"),
  );

  const setActive = (id) => {
    navLinks.forEach((a) => a.classList.remove("is-active"));
    const found = navLinks.find((a) => a.getAttribute("href") === `#${id}`);
    if (found) found.classList.add("is-active");
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) setActive(visible[0].target.id);
      },
      {
        threshold: [0.25, 0.45, 0.6],
        rootMargin: "-120px 0px -55% 0px",
      },
    );

    sections.forEach((s) => io.observe(s));
  }

  // Fallback de imagens (nunca “quebra”)
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        const media = img.closest(".media") || img.parentElement;
        if (media) media.classList.add("is-fallback");
        img.remove();
      },
      { once: true },
    );
  });

  // Copiar WhatsApp
  const copyBtn = document.getElementById("copyPhone");
  copyBtn?.addEventListener("click", async () => {
    const phone = "14988321868";
    try {
      await navigator.clipboard.writeText(phone);
      const old = copyBtn.textContent;
      copyBtn.textContent = "Copiado ✓";
      setTimeout(() => (copyBtn.textContent = old), 1400);
    } catch {
      window.prompt("Copie o número:", phone);
    }
  });

  // WhatsApp flutuante some no contato
  const floatwa = document.querySelector(".floatwa");
  const contato = document.getElementById("contato");
  if (floatwa && contato && "IntersectionObserver" in window) {
    const ioFloat = new IntersectionObserver(
      ([e]) => {
        floatwa.style.opacity = e.isIntersecting ? "0" : "1";
        floatwa.style.pointerEvents = e.isIntersecting ? "none" : "auto";
      },
      { threshold: 0.35 },
    );
    ioFloat.observe(contato);
  }
})();
