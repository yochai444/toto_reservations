"use client";

import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BagIcon, SearchIcon } from "@/components/icons";
import { SectionLink } from "@/components/section-link";
import { SocialLinks } from "@/components/social-links";
import { useStore } from "@/components/store";
import { brand } from "@/theme/theme";

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

/**
 * Opening or refreshing the home page always starts at the top, even if the address still has
 * a section (#kosher) or the browser wants to restore the previous scroll position.
 * Runs once per full page load: the header stays mounted across in-app navigation.
 */
function useHomeOpensAtTop(pathname: string) {
  const firstPath = useRef(pathname);
  useEffect(() => {
    if (firstPath.current !== "/") return;
    history.scrollRestoration = "manual";
    if (location.hash) history.replaceState(history.state, "", "/");

    // The browser's own jump to #section / restore can land after this effect on slow loads,
    // so reset again when loading finishes, unless the visitor has already started scrolling.
    let userMoved = false;
    const markMoved = () => (userMoved = true);
    const toTop = () => !userMoved && window.scrollTo({ top: 0, behavior: "instant" });
    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    inputs.forEach((ev) => window.addEventListener(ev, markMoved, { once: true, passive: true }));
    toTop();
    const onLoad = () => {
      toTop();
      requestAnimationFrame(toTop);
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    const late = window.setTimeout(toTop, 400);

    // Back to the browser default afterwards, so Back/Forward still return to where you were.
    const restore = window.setTimeout(() => (history.scrollRestoration = "auto"), 1500);
    return () => {
      window.clearTimeout(late);
      window.clearTimeout(restore);
      window.removeEventListener("load", onLoad);
      inputs.forEach((ev) => window.removeEventListener(ev, markMoved));
    };
  }, []);
}

const Bar = styled("header")({
  position: "sticky",
  top: "env(safe-area-inset-top, 0px)",
  zIndex: 40,
  borderBottom: `1px solid ${brand.line}`,
  background: "rgb(255 255 255 / 0.95)",
  backdropFilter: "blur(8px)",
});

const Grid = styled("div")(({ theme }) => ({
  display: "grid",
  height: "var(--hdr)",
  gridTemplateColumns: "auto 1fr",
  alignItems: "center",
  gap: 8,
  paddingInline: "var(--gutter)",
  [theme.breakpoints.up("md")]: { gridTemplateColumns: "1fr auto 1fr", gap: 16 },
}));

const Side = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 6,
  [theme.breakpoints.up("sm")]: { gap: 12 },
}));

const Home = styled(Link)({ display: "flex", flexShrink: 0, alignItems: "center", gap: 10 });

const Logo = styled(Image)(({ theme }) => ({ height: 40, width: "auto", [theme.breakpoints.up("md")]: { height: 48 } }));

const Tagline = styled("small")(({ theme }) => ({
  display: "none",
  borderInlineStart: `2px solid ${brand.line}`,
  paddingInlineStart: 10,
  fontFamily: theme.toto.fonts.display,
  fontSize: 13,
  lineHeight: 1.25,
  fontWeight: 500,
  color: brand.pinkInk,
  [theme.breakpoints.up("sm")]: { display: "block" },
}));

const SearchButton = styled("button")(({ theme }) => ({
  display: "grid",
  width: 36,
  height: 36,
  flexShrink: 0,
  placeItems: "center",
  borderRadius: "50%",
  background: brand.blush,
  color: brand.pinkInk,
  "&:hover": { background: brand.line },
  "& svg": { width: 20, height: 20 },
  [theme.breakpoints.up("sm")]: { width: 42, height: 42 },
}));

const Nav = styled("nav")(({ theme }) => ({
  display: "none",
  gap: 4,
  justifySelf: "center",
  [theme.breakpoints.up("md")]: { display: "flex" },
}));

const navItem = {
  borderRadius: 999,
  padding: "8px 14px",
  fontWeight: 600,
  "&:hover, &[aria-current]": { background: brand.blush, color: brand.pinkInk },
};
const NavLink = styled(Link)(navItem);
const NavSection = styled(SectionLink)(navItem);

const CartButton = styled("button")(({ theme }) => ({
  display: "inline-flex",
  height: 34,
  alignItems: "center",
  gap: 6,
  borderRadius: 999,
  background: brand.pinkBtn,
  paddingInline: "10px 12px",
  fontSize: 15,
  fontWeight: 700,
  whiteSpace: "nowrap",
  color: "#fff",
  "& svg": { width: 18, height: 18 },
  "& .label": { display: "none" },
  [theme.breakpoints.up("sm")]: { height: 38, "& .label": { display: "inline" } },
}));

const CartCount = styled("span")({
  display: "inline-grid",
  height: 20,
  minWidth: 20,
  placeItems: "center",
  borderRadius: 999,
  background: "#fff",
  paddingInline: 6,
  fontSize: 12,
  fontWeight: 800,
  color: brand.pinkInk,
  fontVariantNumeric: "tabular-nums",
});

const Socials = styled(SocialLinks)(({ theme }) => ({
  borderInlineStart: `2px solid ${brand.line}`,
  paddingInlineStart: 6,
  [theme.breakpoints.up("sm")]: { paddingInlineStart: 10 },
}));

export function SiteHeader() {
  const { totalQty, setDrawerOpen, setSearchOpen } = useStore();
  const pathname = usePathname();
  const activeNav = useActiveNav(pathname);
  useHomeOpensAtTop(pathname);

  return (
    <Bar>
      <Grid>
        <Side sx={{ justifySelf: "start" }}>
          <Home href="/" aria-label="טוטו קייטרינג, לדף הבית">
            <Logo src="/img/logo.png" alt="TOTO" width={900} height={540} priority />
            <Tagline>
              קייטרינג
              <br />
              חלבי
            </Tagline>
          </Home>
          <SearchButton type="button" onClick={() => setSearchOpen(true)} aria-label="חיפוש מנה">
            <SearchIcon />
          </SearchButton>
        </Side>

        <Nav aria-label="ניווט ראשי">
          {NAV.map((n) => {
            const active = n.id === activeNav;
            const isSection = HOME_SECTIONS.includes(n.id);
            const current = active ? (isSection ? ("location" as const) : ("page" as const)) : undefined;
            return isSection ? (
              <NavSection key={n.id} id={n.id} aria-current={current}>
                {n.label}
              </NavSection>
            ) : (
              <NavLink key={n.id} href={n.href} aria-current={current}>
                {n.label}
              </NavLink>
            );
          })}
        </Nav>

        <Side sx={{ justifySelf: "end", gap: { sm: 1 } }}>
          <CartButton type="button" onClick={() => setDrawerOpen(true)} aria-label={`פתיחת הסל, ${totalQty} מגשים`}>
            <BagIcon />
            <span className="label">הסל שלי</span>
            <CartCount>{totalQty}</CartCount>
          </CartButton>
          <Socials />
        </Side>
      </Grid>
    </Bar>
  );
}
