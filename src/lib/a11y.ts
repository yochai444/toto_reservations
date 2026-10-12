
export const A11Y_MAX = { text: 3, contrast: 1, grayscale: 1, spacing: 1, links: 1, font: 1, motion: 1, cursor: 1 } as const;

export type A11yPref = keyof typeof A11Y_MAX;
export type A11yPrefs = Partial<Record<A11yPref, number>>;

const KEY = "toto-a11y";
const NAMES = Object.keys(A11Y_MAX) as A11yPref[];

const valid = (k: A11yPref, v: unknown): v is number => Number.isInteger(v) && (v as number) > 0 && (v as number) <= A11Y_MAX[k];

export const loadA11y = (): A11yPrefs => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return Object.fromEntries(NAMES.filter((k) => valid(k, saved[k])).map((k) => [k, saved[k]]));
  } catch {
    return {};
  }
};

export const saveA11y = (prefs: A11yPrefs) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {}
};

export const applyA11y = (prefs: A11yPrefs) => {
  const root = document.documentElement;
  for (const k of NAMES) {
    const v = prefs[k];
    if (valid(k, v)) root.setAttribute(`data-a11y-${k}`, String(v));
    else root.removeAttribute(`data-a11y-${k}`);
  }
};

export const a11yInitScript = `(function(){try{var p=JSON.parse(localStorage.getItem("${KEY}")||"{}"),m=${JSON.stringify(A11Y_MAX)},r=document.documentElement;for(var k in m){var v=p[k];if(v===(v|0)&&v>0&&v<=m[k])r.setAttribute("data-a11y-"+k,String(v))}}catch(e){}})()`;
