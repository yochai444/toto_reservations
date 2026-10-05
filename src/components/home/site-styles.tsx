"use client";

// Styled pieces for the home and menu pages. The pages stay Server Components and render these.
import { styled, type Theme } from "@mui/material/styles";
import Link from "next/link";
import { ButterPill, patternWhite, PinkBand, Wrap } from "@/components/ui/primitives";
import { brand } from "@/theme/theme";

const sectionPad = (theme: Theme) => ({ [theme.breakpoints.up("md")]: { paddingBlock: 88 } });

/* ---- hero: fills the first screen below the header, never more ---- */
export const Hero = PinkBand;

export const HeroIn = styled(Wrap)(({ theme }) => ({
  display: "grid",
  alignContent: "center",
  alignItems: "center",
  minHeight: "calc(100svh - var(--hdr) - env(safe-area-inset-top, 0px))",
  paddingBlock: "clamp(14px, 2.6vh, 28px)",
  gap: "clamp(12px, 2.4vh, 24px)",
  [theme.breakpoints.up(960)]: { gridTemplateColumns: "1.05fr 1fr", paddingBlock: "clamp(16px, 3vh, 40px)", gap: 40 },
}));

export const HeroLogo = styled("div")(({ theme }) => ({
  marginBottom: "clamp(6px, 1.6vh, 18px)",
  height: "clamp(48px, 9vh, 80px)",
  aspectRatio: "900 / 710",
  maxWidth: "72%",
  background: "#fff",
  mask: "url(/img/logo-catering.png) no-repeat center / contain",
  [theme.breakpoints.up(960)]: { height: "clamp(56px, 17vh, 200px)" },
}));

export const Tags = styled("div")(({ theme }) => ({
  marginBottom: "clamp(8px, 1.8vh, 18px)",
  display: "inline-flex",
  flexWrap: "wrap",
  columnGap: 10,
  rowGap: 4,
  borderRadius: 999,
  border: "1px solid rgb(255 255 255 / 0.4)",
  background: "rgb(255 255 255 / 0.18)",
  padding: "4px 14px",
  fontSize: 12.5,
  fontWeight: 700,
  letterSpacing: "0.025em",
  [theme.breakpoints.up("sm")]: { fontSize: 14 },
}));

export const HeroTitle = styled("h1")({
  marginBottom: "clamp(6px, 1.4vh, 16px)",
  fontSize: "clamp(1.9rem, min(6.4vw, 6.6vh), 3.9rem)",
  fontWeight: 700,
  color: "#fff",
  "& em": { borderRadius: 14, background: brand.butter, padding: "0 0.18em", color: brand.berry, fontStyle: "normal", boxDecorationBreak: "clone" },
});

export const HeroSub = styled("p")({
  marginBottom: "clamp(12px, 2.4vh, 28px)",
  maxWidth: "36ch",
  fontSize: "clamp(1rem, 2.1vh, 1.2rem)",
  fontWeight: 600,
});

export const Actions = styled("div")({ display: "flex", flexWrap: "wrap", gap: 12 });

export const Collage = styled("div")(({ theme }) => ({
  position: "relative",
  width: "min(100%, 420px)",
  aspectRatio: "3 / 1.08",
  marginInline: "auto",
  "& .ph": {
    position: "absolute",
    border: "4px solid #fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 22px 40px -18px rgb(74 23 51 / 0.6)",
    background: brand.blush,
    width: "37%",
    aspectRatio: "1",
  },
  "& .ph-a": { insetInlineStart: 0, top: "10%", transform: "rotate(-6deg)" },
  "& .ph-b": { insetInlineStart: "31.5%", top: 0, transform: "rotate(4deg)", zIndex: 1 },
  "& .ph-c": { insetInlineStart: "63%", top: "12%", transform: "rotate(-3deg)" },
  "& .sticker": { display: "none" },
  [theme.breakpoints.up(960)]: {
    width: "min(100%, 560px, calc((100svh - var(--hdr) - 80px) * 1.16))",
    aspectRatio: "1 / 0.86",
    "& .ph": { borderWidth: 7, borderRadius: 22 },
    "& .ph-a": { insetInlineStart: 0, top: "4%", width: "62%", aspectRatio: "4 / 3.1", transform: "rotate(-5deg)" },
    "& .ph-b": { insetInlineStart: "auto", insetInlineEnd: 0, top: 0, width: "46%", aspectRatio: "1", transform: "rotate(6deg)", zIndex: "auto" },
    "& .ph-c": { insetInlineStart: "auto", insetInlineEnd: "10%", top: "auto", bottom: 0, width: "54%", aspectRatio: "4 / 3", transform: "rotate(-2deg)" },
    "& .sticker": { display: "flex" },
  },
}));

export const Sticker = styled(ButterPill)(({ theme }) => ({
  position: "absolute",
  insetInlineStart: "6%",
  bottom: "6%",
  transform: "rotate(-8deg)",
  alignItems: "center",
  gap: 8,
  padding: "10px 18px",
  fontFamily: theme.toto.fonts.display,
  fontSize: 15,
  fontWeight: 700,
  boxShadow: theme.toto.shadows.pop,
}));

/* ---- sections ---- */
export const Section = styled("section")(({ theme }) => ({ paddingBlock: 64, ...sectionPad(theme) }));
export const SectionTail = styled("section")(({ theme }) => ({ paddingBottom: 64, [theme.breakpoints.up("md")]: { paddingBottom: 88 } }));
export const PinkSection = styled(PinkBand)(({ theme }) => ({ paddingBlock: 64, ...sectionPad(theme) }));

export const SectionHead = styled("div")({
  marginBottom: 36,
  display: "grid",
  justifyItems: "center",
  gap: 10,
  textAlign: "center",
  "& h2": { fontSize: "clamp(1.9rem, 4vw, 2.7rem)" },
});

export const Steps = styled("ol")(({ theme }) => ({
  display: "grid",
  gap: 18,
  [theme.breakpoints.up(800)]: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 26 },
}));

export const Step = styled("li")({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  alignItems: "start",
  columnGap: 16,
  rowGap: 6,
  borderRadius: 26,
  border: `2px solid ${brand.line}`,
  background: "#fff",
  padding: "26px 24px",
  "& h3": { paddingTop: 4, fontSize: "1.35rem" },
  "& p": { color: brand.muted },
});

export const StepNum = styled("span")(({ theme }) => ({
  gridRow: "span 2",
  display: "grid",
  width: 56,
  height: 56,
  placeItems: "center",
  borderRadius: "50%",
  background: brand.pink,
  fontFamily: theme.toto.fonts.display,
  fontSize: 28,
  fontWeight: 700,
  color: "#fff",
  boxShadow: theme.toto.shadows.pop,
}));

export const Categories = styled("div")({ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 18, rowGap: 22 });

export const CategoryLink = styled(Link)(({ theme }) => ({
  display: "grid",
  width: 136,
  justifyItems: "center",
  gap: 10,
  "& .ring": {
    width: 120,
    height: 120,
    borderRadius: "50%",
    padding: 5,
    background: `conic-gradient(${brand.pink}, ${brand.butter}, ${brand.pink})`,
    transition: "transform 0.2s",
  },
  "&:hover .ring": { transform: "scale(1.05) rotate(-6deg)" },
  "& img": { width: "100%", height: "100%", borderRadius: "50%", border: "4px solid #fff", objectFit: "cover" },
  "& b": { fontFamily: theme.toto.fonts.display, fontSize: "1.12rem", fontWeight: 600, color: brand.berry },
  "& .count": { marginTop: -8, fontSize: 14, color: brand.muted },
}));

export const Center = styled("div")({ marginTop: 34, textAlign: "center" });

export const KosherGrid = styled(Wrap)(({ theme }) => ({
  display: "grid",
  alignItems: "center",
  gap: 30,
  [theme.breakpoints.up("md")]: { gridTemplateColumns: "1fr 1.25fr" },
  "& h2": { marginBottom: 12, fontSize: "clamp(1.9rem, 4vw, 2.6rem)" },
}));

export const Seals = styled("div")({ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 });

export const Seal = styled("div")({
  display: "grid",
  placeItems: "center",
  borderRadius: 18,
  border: `2px solid ${brand.line}`,
  background: "#fff",
  padding: 14,
  "& img": { maxHeight: 150, width: "auto" },
});

export const ContactGrid = styled(Wrap)(({ theme }) => ({
  display: "grid",
  gap: 18,
  [theme.breakpoints.up(860)]: { gridTemplateColumns: "1.3fr 1fr" },
}));

const panel = { borderRadius: 26, padding: "30px 26px", "& h3": { marginBottom: 10, fontSize: "1.7rem" } };

export const EventsPanel = styled("div")({
  ...patternWhite,
  ...panel,
  background: brand.pink,
  color: "#fff",
  "& h3": { ...panel["& h3"], color: "#fff" },
  "& ul": { marginTop: 16, display: "grid", gap: 10 },
  "& li": { display: "flex", alignItems: "center", gap: 10, fontWeight: 600 },
});

export const ContactPanel = styled("div")({ ...panel, border: `2px solid ${brand.line}`, background: "#fff" });

export const Phone = styled("a")(({ theme }) => ({
  marginTop: 14,
  display: "inline-block",
  fontFamily: theme.toto.fonts.display,
  fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
  fontWeight: 700,
  letterSpacing: "0.025em",
  color: brand.pinkInk,
  fontVariantNumeric: "tabular-nums",
}));

/* ---- menu page ---- */
export const MenuHead = styled(Wrap)({
  display: "grid",
  gap: 8,
  paddingTop: 34,
  paddingBottom: 30,
  "& h1": { fontSize: "clamp(2.1rem, 6vw, 3.2rem)", fontWeight: 700, color: "#fff" },
  "& p": { fontSize: "1.08rem", fontWeight: 600 },
});

// Sticky category bar (≈58px) plus a little air above each section.
export const MenuSection = styled("section")({ scrollMarginTop: 70, paddingTop: 38, paddingBottom: 8 });

export const MenuSectionHead = styled("div")({
  marginBottom: 20,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  columnGap: 14,
  rowGap: 10,
  "& h2": { display: "flex", alignItems: "center", gap: 10, fontSize: "clamp(1.7rem, 4vw, 2.3rem)" },
});

export const CategoryNote = styled(ButterPill)({ padding: "4px 14px", fontSize: 14.5 });
