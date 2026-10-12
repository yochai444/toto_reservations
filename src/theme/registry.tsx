"use client";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { ReactNode } from "react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { a11yStyles } from "@/theme/a11y-styles";
import { brand, theme } from "@/theme/theme";

export const doodle = (color: string, opacity: number) => ({
  content: '""',
  inset: 0,
  background: color,
  opacity,
  mask: "url(/img/pattern.png) repeat",
  maskSize: 373,
  pointerEvents: "none" as const,
});

const globals = (
  <GlobalStyles
    styles={{
      ":root": {
        "--hdr": "64px",
        "--gutter": "clamp(16px, 4vw, 40px)",
        colorScheme: "light",
        [theme.breakpoints.up("md")]: { "--hdr": "76px" },
      },
      "*, ::before, ::after": { margin: 0, padding: 0, border: "0 solid" },
      "ul, ol": { listStyle: "none" },
      "img, svg, video": { display: "block", maxWidth: "100%" },
      "img, video": { height: "auto" },
      a: { color: "inherit", textDecoration: "inherit" },
      "button, input, select, textarea": { font: "inherit", color: "inherit", background: "transparent" },
      button: { cursor: "pointer" },
      "[hidden]": { display: "none !important" },

      html: { scrollBehavior: "smooth", scrollPaddingTop: "calc(var(--hdr) * var(--a11y-zoom, 1) + env(safe-area-inset-top, 0px))" },
      "@media (prefers-reduced-motion: reduce)": {
        html: { scrollBehavior: "auto" },
        "*, *::before, *::after": { transition: "none !important", animation: "none !important" },
      },

      body: { "&::before": { ...doodle(brand.pinkInk, 0.045), position: "fixed", zIndex: -1 } },
      "h1, h2, h3": {
        fontFamily: theme.toto.fonts.display,
        fontWeight: 600,
        lineHeight: 1.15,
        textWrap: "balance",
        color: brand.berry,
        fontSize: "inherit",
      },
      ":focus-visible": { outline: `3px solid var(--focus-ring, ${brand.berry})`, outlineOffset: 2, borderRadius: 8 },
      // The skip link's target: focused by script/anchor only, so no ring around the whole page.
      "main:focus": { outline: "none" },
      "@keyframes up": { from: { transform: "translateY(30px)", opacity: 0.5 }, to: { transform: "none", opacity: 1 } },

      // Last, so its overrides win ties with the rules above.
      ...a11yStyles,
    }}
  />
);

export const ThemeRegistry = ({ children }: { children: ReactNode }) => (
  <AppRouterCacheProvider options={{ key: "muirtl", stylisPlugins: [prefixer, rtlPlugin] }}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globals}
      {children}
    </ThemeProvider>
  </AppRouterCacheProvider>
);
