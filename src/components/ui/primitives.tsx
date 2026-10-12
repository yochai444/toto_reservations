"use client";

import Box, { type BoxProps } from "@mui/material/Box";
import Button, { type ButtonProps } from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import type { ElementType } from "react";
import { brand } from "@/theme/theme";
import { doodle } from "@/theme/registry";

export const boxAs = <C extends ElementType>(component: C) => {
  const BoxAs = (props: BoxProps<C>) => <Box component={component} {...props} />;
  return BoxAs;
};

export const Wrap = styled(Box)({ maxWidth: 1240, marginInline: "auto", paddingInline: "var(--gutter)" });

export const patternWhite = {
  "--focus-ring": "#fff",
  position: "relative" as const,
  overflow: "hidden",
  "&::before": { ...doodle("#fff", 0.14), position: "absolute" as const },
  "& > *": { position: "relative" as const },
};

export const PinkBand = styled(boxAs("section"))({ ...patternWhite, background: brand.pink, color: "#fff" });

export const Muted = styled(boxAs("p"))({ color: brand.muted });

export const Price = styled(boxAs("span"), { shouldForwardProp: (p) => p !== "size" })<{ size?: string }>(({ theme, size }) => ({
  fontFamily: theme.toto.fonts.display,
  fontWeight: 700,
  color: brand.pinkInk,
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
  fontSize: size,
}));

export const UnitChip = styled(boxAs("span"))({
  alignSelf: "flex-start",
  fontSize: 13,
  fontWeight: 700,
  color: brand.pinkInk,
  background: brand.blush,
  borderRadius: 999,
  padding: "2px 10px",
});

export const ButterPill = styled(boxAs("span"))({
  borderRadius: 999,
  background: brand.butter,
  color: brand.berry,
  fontWeight: 800,
  fontVariantNumeric: "tabular-nums",
});

export const Num = styled(boxAs("span"))({ fontVariantNumeric: "tabular-nums" });

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

export const TextButton = styled(ButtonBase, { shouldForwardProp: (p) => p !== "tone" })<{ tone?: "muted" | "danger" }>(({ tone = "muted" }) => ({
  justifySelf: "start",
  fontSize: 13.5,
  color: tone === "danger" ? brand.danger : brand.muted,
  textDecoration: "underline",
}));

export const CloseButton = styled(ButtonBase, { shouldForwardProp: (p) => p !== "tone" })<{ tone?: "white" | "blush" }>(({ tone = "white" }) => ({
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

export const Crown = ({ width = 34, white, style }: { width?: number; white?: boolean; style?: React.CSSProperties }) => (
  <CrownImg src="/img/crown.png" alt="" width={168} height={193} white={white} style={{ width, ...style }} />
);

export const LinkButton = (props: ButtonProps & { href: string }) => <Button {...props} />;

export const CoverImage = styled(Image)({ objectFit: "cover" });

export const DishGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 14,
  [theme.breakpoints.up(760)]: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 22 },
  [theme.breakpoints.up(1120)]: { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" },
}));
