/* ===========================================================================
   Site behaviour: theme toggle, renders writing/research lists from the data
   files, filter pills, hover previews, quick-view modal, reveal animations.
   You shouldn't need to touch this file to add content.
   =========================================================================== */

(function () {
  "use strict";

  const OUTLET_LOGOS = {
    "The Age and Sydney Morning Herald": "assets/img/logos/the-age.svg",
    "The Australian": "assets/img/logos/the-australian.svg",
    "The Australian Financial Review": "assets/img/logos/afr.svg",
    "Times Higher Education": "assets/img/logos/the.svg",
    "The Guardian": "assets/img/logos/guardian.svg",
    "The Conversation": "assets/img/logos/conversation.png",
    "ABC News": "assets/img/logos/abc-news.svg",
    "Pursuit (University of Melbourne)": "assets/img/logos/sq-unimelb.png",
    "Melbourne University Newsroom": "assets/img/logos/sq-unimelb.png",
    "The Scholars Podcast (John Monash Foundation)": "assets/img/logos/sq-monash.png",
    "The Policymaker (Australian Public Policy Institute)": "assets/img/logos/sq-appi.png",
    "The Productivity Commission": "assets/img/logos/sq-pc.png",
    "Australian Universities Accord Panel": "assets/img/logos/sq-govau.png",
    "Future Campus": "assets/img/logos/sq-futurecampus.png",
    "Future Forward Australia": "assets/img/logos/sq-ffa.png",
    "Higher Education Policy Institute": "assets/img/logos/sq-hepi.png",
    "DASSH": "assets/img/logos/sq-dassh.png",
  };

  const TYPE_LABELS = {
    opinion: "Opinion",
    article: "Article",
    media: "Media feature",
    citation: "Notable citation",
  };

  const fmtDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    const months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return `${months[m - 1]} ${d}, ${y}`;
  };

  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------- Thumbnail path helpers ---------------- */

  const pdfThumb = (pdfPath) =>
    "thumbs/" + pdfPath.split("/").pop().replace(/\.pdf$/i, ".png");

  // mirrors tools/fetch-share-images.py slug logic
  const webThumb = (item) => {
    let slug;
    if (item.pdf) {
      slug = item.pdf.split("/").pop().replace(/\.pdf$/i, "");
    } else if (item.url) {
      slug = item.url.replace(/\/+$/, "").split("/").pop()
        .replace(/\.html?$/, "").toLowerCase()
        .replace(/[^a-z0-9-]/g, "-").slice(0, 70) || "article";
    } else {
      return null;
    }
    return `thumbs/web/${slug}.jpg`;
  };

  /* ---------------- Theme toggle ---------------- */

  function initTheme() {
    // The pre-paint snippet in each page's <head> already set data-theme.
    const btn = document.getElementById("theme-toggle");
    const sync = () => {
      if (btn) btn.setAttribute("aria-checked", document.documentElement.dataset.theme === "dark");
    };
    sync();
    if (btn) {
      btn.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        localStorage.setItem("theme", next);
        sync();
      });
    }
    // Follow system changes unless the visitor chose explicitly
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        document.documentElement.dataset.theme = e.matches ? "dark" : "light";
        sync();
      }
    });
  }

  /* ---------------- Hover preview (buttons only) ---------------- */

  let previewEl = null;

  function ensurePreview() {
    if (previewEl) return previewEl;
    previewEl = document.createElement("div");
    previewEl.className = "preview-card";
    previewEl.innerHTML = '<img alt=""><div class="preview-card__label"></div>';
    document.body.appendChild(previewEl);
    return previewEl;
  }

  function attachPreview(target, thumbSrc, label) {
    if (!thumbSrc || !window.matchMedia("(hover: hover)").matches) return;
    let dead = false; // set if the image 404s — don't retry every hover
    target.addEventListener("mouseenter", () => {
      if (dead) return;
      const el = ensurePreview();
      const img = el.querySelector("img");
      el.querySelector(".preview-card__label").textContent = label;
      img.onerror = () => { dead = true; el.classList.remove("is-visible"); };
      img.src = thumbSrc;
      el.classList.add("is-visible");
    });
    target.addEventListener("mousemove", (e) => {
      if (!previewEl || dead) return;
      const pad = 18;
      const w = 260;
      const h = previewEl.offsetHeight || 320;
      let x = e.clientX + pad;
      let y = e.clientY - h / 2;
      if (x + w > window.innerWidth - 12) x = e.clientX - w - pad;
      y = Math.max(12, Math.min(y, window.innerHeight - h - 12));
      previewEl.style.left = x + "px";
      previewEl.style.top = y + "px";
    });
    target.addEventListener("mouseleave", () => {
      if (previewEl) previewEl.classList.remove("is-visible");
    });
  }

  /* ---------------- PDF quick-view modal ---------------- */

  function openPdfModal(src, title) {
    let modal = document.getElementById("pdf-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "pdf-modal";
      modal.className = "pdf-modal";
      modal.innerHTML =
        '<div class="pdf-modal__box">' +
        '  <div class="pdf-modal__bar">' +
        '    <div class="pdf-modal__title"></div>' +
        '    <div class="pdf-modal__bar-actions">' +
        '      <a class="pub__link" target="_blank" rel="noopener" data-role="open">Open in tab ↗</a>' +
        '      <button class="pub__link" data-role="close">Close ✕</button>' +
        "    </div>" +
        "  </div>" +
        '  <iframe title="PDF viewer"></iframe>' +
        "</div>";
      document.body.appendChild(modal);
      modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.closest('[data-role="close"]')) closePdfModal();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closePdfModal();
      });
    }
    modal.querySelector(".pdf-modal__title").textContent = title;
    modal.querySelector('[data-role="open"]').href = src;
    modal.querySelector("iframe").src = src;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closePdfModal() {
    const modal = document.getElementById("pdf-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.querySelector("iframe").src = "";
    document.body.style.overflow = "";
  }

  /* ---------------- Writing list page ---------------- */

  function renderWriting() {
    const root = document.getElementById("writing-root");
    if (!root || typeof WRITING === "undefined") return;

    const items = [...WRITING].sort((a, b) => b.date.localeCompare(a.date));
    const filters = [
      ["all", "All"],
      ["opinion", "Opinion"],
      ["article", "Articles"],
      ["media", "Media features"],
      ["citation", "Notable citations"],
    ];

    const bar = document.createElement("div");
    bar.className = "filters";
    bar.innerHTML = filters
      .map(([key, label], i) =>
        `<button class="filter-pill${i === 0 ? " is-active" : ""}" data-filter="${key}">${label}</button>`)
      .join("");
    root.appendChild(bar);

    const listWrap = document.createElement("div");
    root.appendChild(listWrap);

    function draw(filter) {
      listWrap.innerHTML = "";
      const visible = items.filter((it) => filter === "all" || it.type === filter);
      const byYear = new Map();
      visible.forEach((it) => {
        const y = it.date.slice(0, 4);
        if (!byYear.has(y)) byYear.set(y, []);
        byYear.get(y).push(it);
      });

      byYear.forEach((group, year) => {
        const section = document.createElement("section");
        section.className = "year-group reveal";
        section.innerHTML = `<div class="year-group__label">${year}</div>`;
        group.forEach((it) => section.appendChild(pubRow(it)));
        listWrap.appendChild(section);
        requestAnimationFrame(() => section.classList.add("is-in"));
      });
    }

    function pubRow(it) {
      const row = document.createElement("article");
      row.className = "pub";
      const badge = `<span class="pub__badge pub__badge--${esc(it.type)}">${TYPE_LABELS[it.type] || it.type}</span>`;
      const note = it.note ? `<div class="pub__note">${esc(it.note)}</div>` : "";
      const titleInner = it.url
        ? `<a href="${esc(it.url)}" target="_blank" rel="noopener">${esc(it.title)}</a>`
        : esc(it.title);

      const outletLogo = OUTLET_LOGOS[it.outlet]
        ? `<img class="pub__outlet-logo" src="${OUTLET_LOGOS[it.outlet]}" alt="" loading="lazy">`
        : "";
      row.innerHTML =
        `<div class="pub__meta">${badge}<span>${esc(it.outlet)}</span><span class="dot">·</span><span>${fmtDate(it.date)}</span>${outletLogo}</div>` +
        `<div><h3 class="pub__title">${titleInner}</h3>${note}</div>` +
        `<div class="pub__actions"></div>`;

      const actions = row.querySelector(".pub__actions");
      if (it.url) {
        const a = document.createElement("a");
        a.className = "pub__link";
        a.href = it.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = (it.linkLabel || "Article") + " ↗";
        attachPreview(a, webThumb(it), esc(it.outlet));
        actions.appendChild(a);
      }
      if (it.pdf) {
        const b = document.createElement("button");
        b.className = "pub__link";
        b.textContent = "PDF";
        b.addEventListener("click", () => openPdfModal(it.pdf, it.title));
        attachPreview(b, pdfThumb(it.pdf), "PDF — click to read");
        actions.appendChild(b);
      }
      return row;
    }

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-pill");
      if (!btn) return;
      bar.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("is-active"));
      btn.classList.add("is-active");
      draw(btn.dataset.filter);
    });

    draw("all");
  }

  /* ---------------- Featured cards (home) ---------------- */

  function renderFeatured() {
    const root = document.getElementById("featured-root");
    if (!root || typeof WRITING === "undefined") return;
    const picks = WRITING.filter((it) => it.featured)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 3);

    picks.forEach((it) => {
      const card = document.createElement("article");
      card.className = "feature-card reveal";
      const href = it.url || it.pdf || "#";
      card.innerHTML =
        `<div class="feature-card__thumb"></div>` +
        `<div class="feature-card__body">` +
        `  <div class="feature-card__meta">${esc(it.outlet)} · ${fmtDate(it.date)}</div>` +
        `  <h3 class="feature-card__title"><a href="${esc(href)}" target="_blank" rel="noopener">${esc(it.title)}</a></h3>` +
        `  <span class="feature-card__cta">Read piece <span class="arrow">→</span></span>` +
        `</div>`;

      // thumbnail: article share image → PDF first page → outlet logo tile
      const thumbWrap = card.querySelector(".feature-card__thumb");
      const img = document.createElement("img");
      img.className = "thumb";
      img.alt = "";
      img.loading = "lazy";
      const fallbacks = [];
      if (it.pdf) fallbacks.push(pdfThumb(it.pdf));
      fallbacks.push("assets/img/logos/the-age.svg");
      img.onerror = () => {
        const next = fallbacks.shift();
        if (!next) { img.remove(); return; }
        if (next.endsWith(".svg")) img.className = "logo-tile";
        img.src = next;
      };
      img.src = webThumb(it) || fallbacks.shift();
      thumbWrap.appendChild(img);
      root.appendChild(card);
    });
  }

  /* ---------------- Research page ---------------- */

  function renderResearch() {
    const root = document.getElementById("research-root");
    if (!root || typeof RESEARCH === "undefined") return;

    const groups = [
      ["Papers", RESEARCH.papers],
      ["Policy work", RESEARCH.policy],
      ["Talks", RESEARCH.lectures],
    ];

    groups.forEach(([heading, items]) => {
      if (!items || !items.length) return;
      const sec = document.createElement("div");
      sec.className = "reveal";
      sec.innerHTML =
        `<div class="section__head" style="margin-top:14px">` +
        `  <div class="section__eyebrow">${heading}</div>` +
        `</div>`;
      items.forEach((it) => {
        const card = document.createElement("article");
        card.className = "research-card" + (it.forthcoming ? " research-card--forthcoming" : "");
        const venue = it.venue ? `<span class="dot">·</span><span>${esc(it.venue)}</span>` : "";
        card.innerHTML =
          `<div class="research-card__meta"><span class="pub__badge">${esc(it.kind)}</span>${it.date ? `<span>${esc(it.date)}</span>` : ""}${venue}</div>` +
          `<h3>${esc(it.title)}</h3>` +
          (it.authors ? `<div class="research-card__authors">${esc(it.authors)}</div>` : "") +
          (it.summary ? `<p>${esc(it.summary)}</p>` : "") +
          (it.quotes || []).map((q) =>
            `<blockquote class="research-card__quote">\u201C${esc(q.text)}\u201D<cite>\u2014 ${esc(q.source)}</cite></blockquote>`
          ).join("") +
          `<div class="research-card__links"></div>`;
        const linkWrap = card.querySelector(".research-card__links");
        (it.links || []).forEach((ln) => {
          const cls = "pub__link" + (ln.primary ? " pub__link--primary" : "") + (ln.tool ? " pub__link--tool" : "");
          if (ln.pdf) {
            const b = document.createElement("button");
            b.className = cls;
            b.textContent = ln.label;
            b.addEventListener("click", () => openPdfModal(ln.href, it.title));
            attachPreview(b, pdfThumb(ln.href), "PDF — click to read");
            linkWrap.appendChild(b);
          } else {
            const a = document.createElement("a");
            a.className = cls;
            a.href = ln.href;
            a.target = "_blank";
            a.rel = "noopener";
            a.textContent = ln.label + " ↗";
            linkWrap.appendChild(a);
          }
        });
        sec.appendChild(card);
      });
      root.appendChild(sec);
    });
  }

  /* ---------------- Image lightbox ---------------- */

  function initLightbox() {
    const triggers = document.querySelectorAll("[data-lightbox]");
    if (!triggers.length) return;
    let box = null;
    const open = (src, alt) => {
      if (!box) {
        box = document.createElement("div");
        box.className = "img-lightbox";
        box.innerHTML = '<img alt="">';
        document.body.appendChild(box);
        box.addEventListener("click", () => box.classList.remove("is-open"));
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") box.classList.remove("is-open");
        });
      }
      const img = box.querySelector("img");
      img.src = src;
      img.alt = alt || "";
      box.classList.add("is-open");
    };
    triggers.forEach((el) => {
      const img = el.querySelector("img");
      el.addEventListener("click", () => open(img.src, img.alt));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(img.src, img.alt); }
      });
    });
  }

  /* ---------------- Reveal on scroll ---------------- */

  function initReveal() {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  /* ---------------- Active nav link ---------------- */

  function initNav() {
    const norm = (p) => (p.split("/").pop() || "").replace(/\.html$/, "") || "index";
    const path = norm(location.pathname);
    document.querySelectorAll(".nav__links a").forEach((a) => {
      if (norm(a.getAttribute("href")) === path) a.classList.add("is-active");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNav();
    initLightbox();
    renderWriting();
    renderFeatured();
    renderResearch();
    initReveal();
  });
})();
