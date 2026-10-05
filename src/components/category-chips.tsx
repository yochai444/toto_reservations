"use client";

import { useEffect, useRef, useState } from "react";
import type { Category } from "@/lib/menu-types";

/** Sticky category bar that follows the section currently in the middle of the screen. */
export function CategoryChips({ categories }: { categories: Category[] }) {
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
    <div className="sticky top-[calc(env(safe-area-inset-top,0px)+var(--hdr))] z-30 bg-berry">
      <div className="wrap">
        <nav ref={bar} className="no-scrollbar flex gap-2 overflow-x-auto py-2.5" aria-label="קטגוריות">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#cat-${c.id}`}
              data-chip={c.id}
              aria-current={active === c.id ? "true" : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-[15px] font-bold whitespace-nowrap text-white ${
                active === c.id ? "bg-pink shadow-[inset_0_0_0_2px_#fff]" : "bg-white/12"
              }`}
            >
              {c.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
