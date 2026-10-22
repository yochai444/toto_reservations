"use client";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { alpha, styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { CategoryIcon } from "@/components/icons";
import { boxAs, Wrap } from "@/components/ui/primitives";
import type { Category } from "@/lib/menu-types";
import { brand } from "@/theme/theme";

const Sticky = styled(Box)({
  position: "sticky",
  top: "calc(env(safe-area-inset-top, 0px) + var(--hdr))",
  zIndex: 30,
  background: alpha(brand.cream, 0.78),
  backdropFilter: "blur(14px) saturate(1.3)",
  WebkitBackdropFilter: "blur(14px) saturate(1.3)",
  borderBottom: `1px solid ${brand.line}`,
});

const Bar = styled(boxAs("nav"))({
  display: "flex",
  gap: 4,
  overflowX: "auto",
  padding: "8px 0",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" },
});

const Chip = styled(Link)(({ theme }) => ({
  flex: "1 0 auto",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
  minWidth: 84,
  borderRadius: 14,
  padding: "6px 10px 8px",
  fontSize: 14,
  fontWeight: 700,
  whiteSpace: "nowrap",
  color: brand.berry,
  transition: "color .15s, background-color .15s",
  "& .MuiSvgIcon-root": { fontSize: 30, strokeWidth: 1.3, transition: "transform .2s" },
  "&:hover": { color: brand.pinkInk },
  "&:hover .MuiSvgIcon-root": { transform: "translateY(-2px) rotate(-4deg)" },
  "&[aria-current]": { color: brand.pinkInk, background: alpha(brand.pink, 0.1) },
  "&[aria-current]::after": {
    content: '""',
    position: "absolute",
    insetInline: "30%",
    bottom: 0,
    height: 3,
    borderRadius: 3,
    background: brand.pink,
  },
  [theme.breakpoints.up("md")]: {
    fontSize: 15,
    padding: "8px 12px 10px",
    "& .MuiSvgIcon-root": { fontSize: 40, strokeWidth: 1.2 },
  },
}));

export const CategoryChips = ({ categories }: { categories: Category[] }) => {
  const [active, setActive] = useState<string | undefined>(categories[0]?.id);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive((e.target as HTMLElement).dataset.sec)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-sec]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    bar.current?.querySelector(`[data-chip="${active}"]`)?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active]);

  return (
    <Sticky>
      <Wrap>
        <Bar ref={bar} aria-label="קטגוריות">
          {categories.map((c) => (
            <Chip key={c.id} href={`#cat-${c.id}`} data-chip={c.id} aria-current={active === c.id ? "true" : undefined}>
              <CategoryIcon id={c.id} />
              {c.name}
            </Chip>
          ))}
        </Bar>
      </Wrap>
    </Sticky>
  );
};
