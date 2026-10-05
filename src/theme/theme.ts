"use client";

import { createTheme } from "@mui/material/styles";

/** TOTO brand tokens (from the logo and the printed menu). Single deliberate light look. */
export const brand = {
  pink: "#e4519a",
  pinkBtn: "#c8377c",
  pinkInk: "#b42e6e",
  blush: "#ffe2ef",
  cream: "#fff6fa",
  berry: "#4a1733",
  ink: "#3a1a2b",
  muted: "#7a5869",
  line: "#f2c6da",
  butter: "#ffd36a",
  wa: "#1f9d55",
  danger: "#b03224",
  dangerBg: "#fff1f0",
  ok: "#17643a",
  okBg: "#e8f7ee",
} as const;

const fonts = {
  display: "var(--font-fredoka), var(--font-assistant), system-ui, sans-serif",
  body: 'var(--font-assistant), system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
};

const shadows = {
  card: "0 10px 30px -12px rgb(180 46 110 / 0.35)",
  pop: `0 6px 0 -1px ${brand.berry}`,
  popSm: `0 4px 0 -1px ${brand.berry}`,
};

declare module "@mui/material/styles" {
  interface Palette {
    brand: typeof brand;
  }
  interface PaletteOptions {
    brand?: typeof brand;
  }
  interface Theme {
    toto: { fonts: typeof fonts; shadows: typeof shadows };
  }
  interface ThemeOptions {
    toto?: { fonts: typeof fonts; shadows: typeof shadows };
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    white: true;
    ghost: true;
  }
}

export const theme = createTheme({
  direction: "rtl",
  breakpoints: { values: { xs: 0, sm: 640, md: 900, lg: 1240, xl: 1536 } },
  palette: {
    mode: "light",
    brand,
    primary: { main: brand.pinkBtn, dark: brand.pinkInk, contrastText: "#fff" },
    secondary: { main: brand.butter, contrastText: brand.berry },
    error: { main: brand.danger },
    success: { main: brand.ok },
    text: { primary: brand.ink, secondary: brand.muted },
    background: { default: brand.cream, paper: "#fff" },
    divider: brand.line,
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: fonts.body,
    body1: { fontSize: 17, lineHeight: 1.55 },
    body2: { fontSize: 14, lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 800 },
  },
  toto: { fonts, shadows },
  components: {
    MuiButtonBase: { defaultProps: { disableRipple: true } },
    MuiButton: {
      defaultProps: { variant: "contained", disableElevation: true },
      styleOverrides: {
        root: {
          gap: 8,
          borderRadius: 999,
          padding: "14px 26px",
          fontSize: 17,
          lineHeight: 1.55,
          transition: "transform 0.15s ease",
          "&:hover": { transform: "translateY(-2px)" },
          "&.Mui-disabled": { transform: "none" },
        },
      },
      variants: [
        {
          props: { variant: "contained" },
          style: {
            background: brand.pinkBtn,
            color: "#fff",
            boxShadow: shadows.pop,
            "&:hover": { background: brand.pinkBtn, boxShadow: shadows.pop },
            "&.Mui-disabled": { background: "#d9a9bf", color: "#fff", boxShadow: "none" },
          },
        },
        {
          props: { variant: "contained", size: "small" },
          style: { padding: "8px 14px", fontSize: 15, lineHeight: 1.4, boxShadow: shadows.popSm, "&:hover": { boxShadow: shadows.popSm, filter: "brightness(1.05)", transform: "none" } },
        },
        {
          props: { variant: "white" },
          style: { background: "#fff", color: brand.pinkInk, boxShadow: shadows.pop, "&:hover": { background: "#fff" } },
        },
        {
          props: { variant: "ghost" },
          style: { color: "#fff", border: "2px solid rgb(255 255 255 / 0.75)", "&:hover": { background: "transparent" } },
        },
        {
          props: { variant: "outlined" },
          style: {
            padding: "8px 16px",
            fontSize: 17,
            color: brand.pinkInk,
            border: `2px solid ${brand.pinkBtn}`,
            "&:hover": { border: `2px solid ${brand.pinkBtn}`, background: "transparent" },
          },
        },
      ],
    },
    MuiBackdrop: {
      styleOverrides: { root: { variants: [{ props: { invisible: false }, style: { backgroundColor: "rgb(74 23 51 / 0.5)" } }] } },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontWeight: 800,
          color: brand.berry,
          lineHeight: 1.55,
          "&.Mui-focused, &.Mui-error": { color: brand.berry },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: 0,
          fontSize: 14,
          lineHeight: 1.45,
          textAlign: "start",
          color: brand.muted,
          "&.Mui-error": { color: brand.danger, fontWeight: 700 },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          background: brand.cream,
          fontSize: 17,
          color: brand.ink,
          "& .MuiOutlinedInput-notchedOutline": { borderWidth: 2, borderColor: brand.line },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: brand.line },
          "&.Mui-focused": { background: "#fff" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderWidth: 2, borderColor: brand.pinkBtn },
          "&.Mui-error": { background: brand.dangerBg },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": { borderColor: "#c0392b" },
        },
        input: { padding: "12px 14px", height: "auto", lineHeight: 1.55 },
        multiline: { padding: 0 },
      },
    },
    MuiCheckbox: {
      defaultProps: { color: "primary" },
      styleOverrides: { root: { padding: 4, color: brand.pinkBtn } },
    },
    MuiFormControlLabel: {
      styleOverrides: { root: { marginInline: 0, gap: 6 }, label: { fontWeight: 700 } },
    },
  },
});
