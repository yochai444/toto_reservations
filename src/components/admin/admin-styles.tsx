"use client";

// Styled pieces for the admin pages. The pages stay Server Components and render these.
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/theme/theme";

/* ---- shell ---- */
export const Shell = styled("div")({ minHeight: "100svh" });

export const TopBar = styled("header")({
  position: "sticky",
  top: 0,
  zIndex: 40,
  borderBottom: `1px solid ${brand.line}`,
  background: "rgb(255 255 255 / 0.95)",
  backdropFilter: "blur(8px)",
});

export const TopBarIn = styled("div")({
  marginInline: "auto",
  display: "flex",
  height: 64,
  maxWidth: 1000,
  alignItems: "center",
  gap: 12,
  paddingInline: 16,
});

export const Brand = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  "& img": { height: 36, width: "auto" },
  "& span": { fontFamily: theme.toto.fonts.display, fontSize: 18, fontWeight: 600, color: brand.berry },
}));

export const TopNav = styled("nav")({ marginInlineStart: 8, display: "flex", gap: 4, fontSize: 15, fontWeight: 700 });

export const TopNavLink = styled(Link)({ borderRadius: 999, padding: "6px 12px", whiteSpace: "nowrap", "&:hover": { background: brand.blush } });

export const TopEnd = styled("div")({ marginInlineStart: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: 14 });

export const SiteLink = styled("a")(({ theme }) => ({
  display: "none",
  borderRadius: 999,
  background: brand.blush,
  padding: "6px 12px",
  fontWeight: 700,
  color: brand.pinkInk,
  [theme.breakpoints.up("sm")]: { display: "inline" },
}));

const quiet = { borderRadius: 999, padding: "6px 8px", fontWeight: 700, color: brand.muted, textDecoration: "underline" };
export const QuietLink = styled(Link)(quiet);
export const QuietButton = styled("button")(quiet);

export const Main = styled("main")({ marginInline: "auto", maxWidth: 1000, padding: "24px 16px 96px" });

/* ---- login ---- */
export const LoginPage = styled("main")({ display: "grid", minHeight: "100svh", placeItems: "center", background: brand.pink, padding: "40px 16px" });

export const LoginCard = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 400,
  borderRadius: 26,
  background: "#fff",
  padding: 28,
  boxShadow: theme.toto.shadows.pop,
  "& h1": { marginBottom: 4, textAlign: "center", fontSize: 24 },
  "& > p.sub": { marginBottom: 24, textAlign: "center", color: brand.muted },
}));

export const LoginLogo = styled(Image)({ marginInline: "auto", marginBottom: 8, height: 56, width: "auto" });

/* ---- page parts ---- */
export const PageTitle = styled("h1")({ marginBottom: 20, fontSize: 30 });

export const PageHead = styled("div")({
  marginBottom: 24,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: 12,
  "& h1": { fontSize: 30 },
  "& p": { color: brand.muted },
});

export const OutlineLink = styled(Link)({
  borderRadius: 999,
  border: `2px solid ${brand.pinkBtn}`,
  padding: "8px 16px",
  fontWeight: 800,
  color: brand.pinkInk,
});

export const Categories = styled("div")({ display: "grid", gap: 32 });

export const CategoryCard = styled("section")(({ theme }) => ({
  scrollMarginTop: 80,
  borderRadius: 22,
  background: "#fff",
  padding: 16,
  boxShadow: theme.toto.shadows.card,
  [theme.breakpoints.up("sm")]: { padding: 20 },
}));

export const CategoryHead = styled("div")({
  marginBottom: 12,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 12,
  "& h2": { fontSize: 24 },
  "& .note": { fontSize: 14, color: brand.muted },
});

export const HiddenTag = styled("span")({ borderRadius: 999, background: "#eee", padding: "2px 10px", fontSize: 14, fontWeight: 700, color: brand.muted });

export const CategoryActions = styled("div")({ marginInlineStart: "auto", display: "flex", gap: 8 });

export const UnderlineLink = styled(Link)({ borderRadius: 999, padding: "6px 12px", fontSize: 15, fontWeight: 700, color: brand.pinkInk, textDecoration: "underline" });

export const PinkLink = styled(Link)({ borderRadius: 999, background: brand.pinkBtn, padding: "6px 16px", fontSize: 15, fontWeight: 800, color: "#fff" });

export const ItemList = styled("ul")({ "& > li + li": { borderTop: `1px solid ${brand.line}` } });

export const ItemRow = styled("li", { shouldForwardProp: (p) => p !== "dim" })<{ dim: boolean }>(({ dim }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 12,
  paddingBlock: 10,
  opacity: dim ? 0.55 : 1,
}));

export const ItemThumb = styled(Image)({ width: 56, height: 56, borderRadius: 12, background: brand.blush, objectFit: "cover" });

export const ItemName = styled(Link)({
  minWidth: 0,
  flex: "1 1 160px",
  "& b": { display: "block", lineHeight: 1.25, color: brand.berry },
  "& span": { fontSize: 14, color: brand.muted },
});

export const AvailableToggle = styled("button", { shouldForwardProp: (p) => p !== "on" })<{ on: boolean }>(({ on }) => ({
  borderRadius: 999,
  padding: "6px 12px",
  fontSize: 14,
  fontWeight: 800,
  background: on ? brand.okBg : "#eee",
  color: on ? brand.ok : brand.muted,
}));

export const EditLink = styled(Link)({ borderRadius: 999, background: brand.blush, padding: "6px 14px", fontSize: 14, fontWeight: 800, color: brand.pinkInk });

export const ArrowButton = styled("button")({
  display: "grid",
  width: 32,
  height: 32,
  placeItems: "center",
  borderRadius: "50%",
  background: brand.blush,
  fontWeight: 700,
  color: brand.pinkInk,
  "&:disabled": { opacity: 0.3, cursor: "default" },
});

export const GroupList = styled("ul")({ display: "grid", gap: 12 });

export const GroupCard = styled(Link)(({ theme }) => ({
  display: "grid",
  gap: 4,
  borderRadius: 18,
  background: "#fff",
  padding: 16,
  boxShadow: theme.toto.shadows.card,
  "&:hover": { boxShadow: `0 0 0 2px ${brand.line}, ${theme.toto.shadows.card}` },
  "& b": { color: brand.berry },
  "& .used": { fontSize: 14, color: brand.muted },
}));
