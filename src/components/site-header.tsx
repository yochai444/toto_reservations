"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BagIcon, SearchIcon } from "@/components/icons";
import { SocialLinks } from "@/components/social-links";
import { useStore } from "@/components/store";

const NAV = [
  { href: "/", label: "בית", id: "home" },
  { href: "/menu", label: "התפריט", id: "menu" },
  { href: "/#how", label: "איך מזמינים", id: "how" },
  { href: "/#kosher", label: "כשרות", id: "kosher" },
  { href: "/#contact", label: "צור קשר", id: "contact" },
];
const HOME_SECTIONS = ["how", "kosher", "contact"];

/**
 * Which nav item to highlight. On the home page it follows the section under the header
 * ("איך מזמינים", "כשרות", "צור קשר"), "בית" near the top, and nothing in between.
 */
function useActiveNav(pathname: string) {
  const [section, setSection] = useState<string | null>("home");

  useEffect(() => {
    if (pathname !== "/") return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = (document.querySelector("header")?.getBoundingClientRect().bottom ?? 76) + 100;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const inView = HOME_SECTIONS.find((id) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        return r && r.top <= line && r.bottom > line;
      });
      setSection(atBottom ? "contact" : (inView ?? (window.scrollY < 200 ? "home" : null)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  if (pathname === "/menu") return "menu";
  return pathname === "/" ? section : null;
}

export function SiteHeader() {
  const { totalQty, setDrawerOpen, setSearchOpen } = useStore();
  const pathname = usePathname();
  const activeNav = useActiveNav(pathname);

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="grid h-(--hdr) grid-cols-[auto_1fr] items-center gap-2 px-(--gutter) min-[900px]:grid-cols-[1fr_auto_1fr] min-[900px]:gap-4">
        <div className="flex items-center gap-1.5 justify-self-start sm:gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="טוטו קייטרינג, לדף הבית">
            <Image src="/img/logo.png" alt="TOTO" width={900} height={540} priority className="h-10 w-auto min-[900px]:h-12" />
            <small className="hidden border-s-2 border-line ps-2.5 font-display text-[13px] leading-tight font-medium text-pink-ink sm:block">
              קייטרינג
              <br />
              חלבי
            </small>
          </Link>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="חיפוש מנה"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-blush text-pink-ink hover:bg-line sm:size-[42px]"
          >
            <SearchIcon className="size-5" />
          </button>
        </div>

        <nav className="hidden gap-1 justify-self-center min-[900px]:flex" aria-label="ניווט ראשי">
          {NAV.map((n) => {
            const active = n.id === activeNav;
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? (HOME_SECTIONS.includes(n.id) ? "location" : "page") : undefined}
                className={`rounded-full px-3.5 py-2 font-semibold hover:bg-blush hover:text-pink-ink ${active ? "bg-blush text-pink-ink" : ""}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 justify-self-end sm:gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={`פתיחת הסל, ${totalQty} מגשים`}
            className="inline-flex h-[34px] items-center gap-1.5 rounded-full bg-pink-btn ps-2.5 pe-3 text-[15px] font-bold whitespace-nowrap text-white sm:h-[38px]"
          >
            <BagIcon className="size-[18px]" />
            <span className="hidden sm:inline">הסל שלי</span>
            <span className="inline-grid h-5 min-w-5 place-items-center rounded-full bg-white px-1.5 text-xs font-extrabold text-pink-ink tabular-nums">
              {totalQty}
            </span>
          </button>
          <SocialLinks className="border-s-2 border-line ps-1.5 sm:ps-2.5" />
        </div>
      </div>
    </header>
  );
}
