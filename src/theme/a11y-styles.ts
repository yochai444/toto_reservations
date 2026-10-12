export const TEXT_ZOOM = [1, 1.15, 1.3, 1.5] as const;

const bigCursor = (fill: string, fallback: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path d="M4 2l14 12h-7l4 8-3 1.5-4-8L4 20z" fill="${fill}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 8 4, ${fallback} !important`;
};
const CLICKABLE = ["a", "button", "label", "select", "summary", '[role="button"]'].join(", ");

const HC = "html[data-a11y-contrast]";
const HC_YELLOW = "#ffd36a";
const SELECTED = ['[aria-current]:not([aria-current="false"])', '[aria-pressed="true"]', '[aria-checked="true"]', "label:has(input:checked)"];
const each = (selectors: string[], suffix = "") => selectors.map((s) => `${HC} ${s}${suffix}`).join(", ");

export const a11yStyles = {
  "html[data-a11y-text] body": { zoom: "var(--a11y-zoom)" },
  ...Object.fromEntries(TEXT_ZOOM.slice(1).map((z, i) => [`html[data-a11y-text="${i + 1}"]`, { "--a11y-zoom": String(z) }])),

  "html[data-a11y-spacing] body *": { lineHeight: "1.8 !important", letterSpacing: "0.12em !important", wordSpacing: "0.16em !important" },

  // Everything clickable gets a dashed outline, links also a thick underline. The focus ring shares `outline`, so a
  // focused element turns it back to solid (its color still comes from the focus rules).
  "html[data-a11y-links] a": { textDecoration: "underline 2px !important", textUnderlineOffset: "4px" },
  "html[data-a11y-links] a, html[data-a11y-links] button": { outline: "2px dashed currentColor", outlineOffset: 2 },
  "html[data-a11y-links] :focus-visible": { outlineStyle: "solid", outlineWidth: 3 },

  "html[data-a11y-font] body *": { fontFamily: 'Arial, "Segoe UI", system-ui, sans-serif !important' },

  "html[data-a11y-motion]": { scrollBehavior: "auto" },
  "html[data-a11y-motion] *, html[data-a11y-motion] *::before, html[data-a11y-motion] *::after": {
    transition: "none !important",
    animation: "none !important",
  },

  "html[data-a11y-cursor], html[data-a11y-cursor] *": { cursor: bigCursor("#000", "auto") },
  [`html[data-a11y-cursor] :is(${CLICKABLE}), html[data-a11y-cursor] :is(${CLICKABLE}) *`]: { cursor: bigCursor("#c8377c", "pointer") },

  // On <html>, not body: a filter on any other element would become the containing block of the fixed header,
  // cart bar and floating buttons, and they would scroll away with the page.
  "html[data-a11y-grayscale]": { filter: "grayscale(1)" },

  // High contrast: white on black everywhere, yellow links, outlined buttons, yellow selected states. The rules
  // below override this one by higher specificity or, on a tie, by coming later.
  [`${HC} body, ${HC} body *`]: {
    backgroundColor: "#000 !important",
    backgroundImage: "none !important",
    color: "#fff !important",
    borderColor: "#fff !important",
    boxShadow: "none !important",
    textShadow: "none !important",
  },
  [`${HC} body::before, ${HC} body *::before`]: { display: "none" }, // the decorative doodle
  [`${HC} a, ${HC} a *`]: { color: `${HC_YELLOW} !important` },
  [`${HC} button, ${HC} .MuiButton-root`]: { boxShadow: "inset 0 0 0 2px currentColor !important" },
  [`${each(SELECTED)}, ${each(SELECTED, " *")}`]: { backgroundColor: `${HC_YELLOW} !important`, color: "#000 !important" },
  // The logos drawn as a white mask over their background.
  [`${HC} [role="img"]`]: { backgroundColor: "#fff !important" },
  // A modal's full-screen root must stay see-through, or the black above would hide the whole page behind it.
  [`${HC} .MuiModal-root`]: { backgroundColor: "transparent !important" },
  [`${HC} .MuiBackdrop-root`]: { backgroundColor: "rgb(0 0 0 / 0.6) !important" },
  [`${HC} .MuiBackdrop-invisible`]: { backgroundColor: "transparent !important" },
  [`${HC} .MuiPaper-root`]: { outline: "2px solid #fff" },
  [`${HC} :focus-visible, ${HC} label:has(:focus-visible)`]: { outline: `3px solid ${HC_YELLOW}`, outlineOffset: 2 },
};
