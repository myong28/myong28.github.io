/* ===========================================================================
   Site behaviour: renders writing/research lists from the data files,
   filter pills, PDF hover previews, quick-view modal, reveal animations.
   You shouldn't need to touch this file to add content.
   =========================================================================== */

(function () {
  "use strict";

  const TYPE_LABELS = {
    opinion: "Opinion",
    article: "Article",
    media: "Media feature",
    citation: "Citation",
  };

  const fmtDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    const months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return `${months[m - 1]} ${d}, ${y}`;
  };

  const thumbFor = (pdfPath) =>
    "thumbs/" + pdfPath.split("/").pop().replace(/\.pdf$/i, ".png");

  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------- PDF hover preview ---------------- */

  let previewEl = null;

  function ensurePreview() {
    if (previewEl) return previewEl;
    previewEl = document.createElement("div");
    previewEl.className = "preview-card";
    previewEl.innerHTML = '<img alt=""><div class="preview-card__label">Hover preview — click PDF to read</div>';
    document.body.appendChild(previewEl);
    return previewEl;
  }

  function attachPreview(target, thumbSrc) {
    if (!window.matchMedia("(hover: hover)").matches) return;
    target.addEventListener("mouseenter", () => {
      const el = ensurePreview();
      const img = el.querySelector("img");
      img.src = thumbSrc;
      img.onerror = () => el.classList.remove("is-visible");
      el.classList.add("is-visible");
    });
    target.addEventListener("mousemove", (e) => {
      if (!previewEl) return;
      const pad = 18;
      const w = 240;
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
      ["citation", "Citations"],
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
      const badge = `<span class="pub__badge">${TYPE_LABELS[it.type] || it.type}</span>`;
      const note = it.note ? `<div class="pub__note">${esc(it.note)}</div>` : "";
      const titleInner = it.url
        ? `<a href="${esc(it.url)}" target="_blank" rel="noopener">${esc(it.title)}</a>`
        : esc(it.title);

      row.innerHTML =
        `<div class="pub__meta">${badge}<span>${esc(it.outlet)}</span><span class="dot">·</span><span>${fmtDate(it.date)}</span></div>` +
        `<div><h3 class="pub__title">${titleInner}</h3>${note}</div>` +
        `<div class="pub__actions"></div>`;

      const actions = row.querySelector(".pub__actions");
      if (it.url) {
        const a = document.createElement("a");
        a.className = "pub__link";
        a.href = it.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = "Article ↗";
        actions.appendChild(a);
      }
      if (it.pdf) {
        const b = document.createElement("button");
        b.className = "pub__link";
        b.textContent = "PDF";
        b.addEventListener("click", () => openPdfModal(it.pdf, it.title));
        actions.appendChild(b);
        attachPreview(row, thumbFor(it.pdf));
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
      const thumb = it.pdf
        ? `<img src="${thumbFor(it.pdf)}" alt="" loading="lazy" onerror="this.remove()">`
        : "";
      card.innerHTML =
        `<div class="feature-card__thumb">${thumb}</div>` +
        `<div class="feature-card__body">` +
        `  <div class="feature-card__meta">${esc(it.outlet)} · ${fmtDate(it.date)}</div>` +
        `  <h3 class="feature-card__title"><a href="${esc(href)}" target="_blank" rel="noopener">${esc(it.title)}</a></h3>` +
        `  <span class="feature-card__cta">Read piece <span class="arrow">→</span></span>` +
        `</div>`;
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
        card.className = "research-card";
        const venue = it.venue ? `<span class="dot">·</span><span>${esc(it.venue)}</span>` : "";
        card.innerHTML =
          `<div class="research-card__meta"><span class="pub__badge">${esc(it.kind)}</span><span>${esc(it.date)}</span>${venue}</div>` +
          `<h3>${esc(it.title)}</h3>` +
          (it.authors ? `<div class="research-card__authors">${esc(it.authors)}</div>` : "") +
          (it.summary ? `<p>${esc(it.summary)}</p>` : "") +
          `<div class="research-card__links"></div>`;
        const linkWrap = card.querySelector(".research-card__links");
        (it.links || []).forEach((ln) => {
          if (ln.pdf) {
            const b = document.createElement("button");
            b.className = "pub__link";
            b.textContent = ln.label;
            b.addEventListener("click", () => openPdfModal(ln.href, it.title));
            linkWrap.appendChild(b);
            attachPreview(b, thumbFor(ln.href));
          } else {
            const a = document.createElement("a");
            a.className = "pub__link";
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
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav__links a").forEach((a) => {
      if (a.getAttribute("href") === path) a.classList.add("is-active");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    renderWriting();
    renderFeatured();
    renderResearch();
    initReveal();
  });
})();
