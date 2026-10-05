"use client";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { ReactNode } from "react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { brand, theme } from "@/theme/theme";

/** Faint doodle pattern (extracted from TOTO's printed menu) drawn in `color` over everything behind it. */
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
      // Bare-element reset, so plain tags carry no browser margins or chrome.
      "*, ::before, ::after": { margin: 0, padding: 0, border: "0 solid" },
      "ul, ol": { listStyle: "none" },
      "img, svg, video": { display: "block", maxWidth: "100%" },
      "img, video": { height: "auto" },
      a: { color: "inherit", textDecoration: "inherit" },
      "button, input, select, textarea": { font: "inherit", color: "inherit", background: "transparent" },
      button: { cursor: "pointer" },
      "[hidden]": { display: "none !important" },

      // Every scroll target (page change, #anchor) stops below the sticky header.
      html: { scrollBehavior: "smooth", scrollPaddingTop: "calc(var(--hdr) + env(safe-area-inset-top, 0px))" },
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
      ":focus-visible": { outline: `3px solid ${brand.butter}`, outlineOffset: 2, borderRadius: 8 },
      "@keyframes up": { from: { transform: "translateY(30px)", opacity: 0.5 }, to: { transform: "none", opacity: 1 } },
    }}
  />
);

export function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "muirtl", stylisPlugins: [prefixer, rtlPlugin] }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {globals}
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
