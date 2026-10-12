"use client";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { boxAs, Wrap } from "@/components/ui/primitives";
import type { Category } from "@/lib/menu-types";
import { brand } from "@/theme/theme";

const Sticky = styled(Box)({
  "--focus-ring": "#fff",
  position: "sticky",
  top: "calc(env(safe-area-inset-top, 0px) + var(--hdr))",
  zIndex: 30,
  background: brand.berry,
});

const Bar = styled(boxAs("nav"))({
  display: "flex",
  gap: 8,
  overflowX: "auto",
  padding: "10px 0",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" },
});

const Chip = styled(Link)({
  flexShrink: 0,
  borderRadius: 999,
  background: "rgb(255 255 255 / 0.12)",
  padding: "8px 16px",
  fontSize: 15,
  fontWeight: 700,
  whiteSpace: "nowrap",
  color: "#fff",
  "&[aria-current]": { background: brand.pink, boxShadow: "inset 0 0 0 2px #fff" },
});

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
              {c.name}
            </Chip>
          ))}
        </Bar>
      </Wrap>
    </Sticky>
  );
};
