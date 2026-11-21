// Seminar pages: series filter and LaTeX rendering. Without JavaScript all
// talks are shown and LaTeX stays as typed.

// --- Team: filter people by research group ----------------------------------
for (const group of document.querySelectorAll(".group-filter")) {
  const root = group.closest(".team");
  const sections = [...root.querySelectorAll(".team-group")].filter((s) => s.querySelector(".member"));
  const buttons = [...group.querySelectorAll("button")];
  const empty = root.querySelector(".filter-empty");
  group.hidden = false;
  for (const b of buttons) {
    b.addEventListener("click", () => {
      const filter = b.dataset.filter;
      for (const x of buttons) x.setAttribute("aria-pressed", String(x === b));
      let shown = 0;
      for (const section of sections) {
        let n = 0;
        for (const m of section.querySelectorAll(".member")) {
          const match = filter === "all" || (m.dataset.groups || "").split(" ").includes(filter);
          m.hidden = !match;
          n += match;
        }
        section.hidden = n === 0;
        shown += n;
      }
      if (empty) empty.hidden = shown > 0;
    });
  }
}

// --- Series filter ---------------------------------------------------------
for (const group of document.querySelectorAll(".series-filter:not(.group-filter)")) {
  const section = group.closest(".talk-section");
  const talks = [...section.querySelectorAll(".talk")];
  const empty = section.querySelector(".filter-empty");
  const buttons = [...group.querySelectorAll("button")];
  // Offer the filter only when the list has more than one series.
  if (new Set(talks.map((t) => t.dataset.series)).size < 2) continue;
  group.hidden = false;

  const apply = (filter) => {
    for (const b of buttons) b.setAttribute("aria-pressed", String(b.dataset.filter === filter));
    let shown = 0;
    for (const t of talks) {
      const match = filter === "all" || t.dataset.series === filter;
      t.hidden = !match;
      shown += match;
    }
    if (empty) empty.hidden = shown > 0;
  };
  for (const b of buttons) {
    b.addEventListener("click", () => {
      apply(b.dataset.filter);
      try {
        sessionStorage.setItem("ceico-series", b.dataset.filter);
      } catch {}
    });
  }
  let saved = "all";
  try {
    saved = sessionStorage.getItem("ceico-series") || "all";
  } catch {}
  if (saved !== "all") apply(saved);
}

// --- LaTeX in titles and abstracts (KaTeX, loaded only when needed) --------
const mathBlocks = [...document.querySelectorAll(".talk__title, .talk__abstract-text, .pub__title")].filter((el) =>
  /\$[^$]+\$|\\\(|\\\[/.test(el.textContent),
);

if (mathBlocks.length) {
  const load = (tag, attrs) =>
    new Promise((resolve, reject) => {
      const el = Object.assign(document.createElement(tag), attrs);
      el.onload = resolve;
      el.onerror = reject;
      document.head.append(el);
    });
  load("link", { rel: "stylesheet", href: "/assets/katex/katex.min.css" })
    .then(() => load("script", { src: "/assets/katex/katex.min.js" }))
    .then(() => load("script", { src: "/assets/katex/auto-render.min.js" }))
    .then(() => {
      for (const el of mathBlocks) {
        window.renderMathInElement(el, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "\\[", right: "\\]", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
          ],
          throwOnError: false,
        });
      }
    })
    .catch(() => {}); // LaTeX stays readable as plain text
}
