"use client";

import Button, { type ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/theme/theme";
import { doodle } from "@/theme/registry";

/** Page-width container with the side gutter. */
export const Wrap = styled("div")({ maxWidth: 1240, marginInline: "auto", paddingInline: "var(--gutter)" });

/** White doodle pattern over a colored band. Children sit above it. */
export const patternWhite = {
  position: "relative" as const,
  overflow: "hidden",
  "&::before": { ...doodle("#fff", 0.14), position: "absolute" as const },
  "& > *": { position: "relative" as const },
};

export const PinkBand = styled("section")({ ...patternWhite, background: brand.pink, color: "#fff" });

export const Muted = styled("p")({ color: brand.muted });

export const Price = styled("span", { shouldForwardProp: (p) => p !== "size" })<{ size?: string }>(({ theme, size }) => ({
  fontFamily: theme.toto.fonts.display,
  fontWeight: 700,
  color: brand.pinkInk,
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
  fontSize: size,
}));

export const UnitChip = styled("span")({
  alignSelf: "flex-start",
  fontSize: 13,
  fontWeight: 700,
  color: brand.pinkInk,
  background: brand.blush,
  borderRadius: 999,
  padding: "2px 10px",
});

/** Butter-yellow pill, e.g. "בסל: 2" or a category note. */
export const ButterPill = styled("span")({
  borderRadius: 999,
  background: brand.butter,
  color: brand.berry,
  fontWeight: 800,
  fontVariantNumeric: "tabular-nums",
});

export const Num = styled("span")({ fontVariantNumeric: "tabular-nums" });

/** Hidden on screen, still read by screen readers and focusable. */
export const srOnly: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};

/** Small underlined text button ("הסרה", "ביטול"). */
export const TextButton = styled("button", { shouldForwardProp: (p) => p !== "tone" })<{ tone?: "muted" | "danger" }>(({ tone = "muted" }) => ({
  justifySelf: "start",
  fontSize: 13.5,
  color: tone === "danger" ? brand.danger : brand.muted,
  textDecoration: "underline",
}));

/** Round ✕ close button. */
export const CloseButton = styled("button", { shouldForwardProp: (p) => p !== "tone" })<{ tone?: "white" | "blush" }>(({ tone = "white" }) => ({
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  width: tone === "white" ? 40 : 36,
  height: tone === "white" ? 40 : 36,
  borderRadius: "50%",
  background: tone === "white" ? "#fff" : brand.blush,
  color: brand.berry,
  fontSize: tone === "white" ? 20 : 18,
}));

const CrownImg = styled(Image, { shouldForwardProp: (p) => p !== "white" })<{ white?: boolean }>(({ white }) => ({
  height: "auto",
  filter: white ? "brightness(0) invert(1)" : undefined,
}));

/** TOTO's crown mark. `width` is the rendered width in px; `white` turns it white for pink bands. */
export function Crown({ width = 34, white, style }: { width?: number; white?: boolean; style?: React.CSSProperties }) {
  return <CrownImg src="/img/crown.png" alt="" width={168} height={193} white={white} style={{ width, ...style }} />;
}

/** MUI Button that navigates with next/link. */
export function LinkButton({ href, ...props }: Omit<ButtonProps<typeof Link>, "component">) {
  return <Button component={Link} nativeButton={false} href={href} {...props} />;
}

/** Image filling its positioned parent, cropped to cover. */
export const CoverImage = styled(Image)({ objectFit: "cover" });

/** Card grid for dishes: 2 columns on phones, up to 4 on desktop. */
export const DishGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 14,
  [theme.breakpoints.up(760)]: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 22 },
  [theme.breakpoints.up(1120)]: { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" },
}));
