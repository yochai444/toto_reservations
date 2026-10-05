import Link from "next/link";
import { SocialLinks } from "@/components/social-links";
import type { Category } from "@/lib/menu-types";
import { SITE } from "@/lib/site";

export function SiteFooter({ categories }: { categories: Category[] }) {
  return (
    <footer className="pattern-white bg-berry text-[#F8D7E7]">
      <div className="wrap grid gap-6 py-11 min-[860px]:grid-cols-[1.2fr_1fr_1fr] min-[860px]:items-start">
        <div>
          <div className="logo-white aspect-[900/540] w-[150px] [--logo:url(/img/logo.png)]" role="img" aria-label="TOTO" />
          <p className="mt-2.5">קייטרינג חלבי לאירועים · כשר למהדרין</p>
          <SocialLinks tone="dark" className="mt-3.5" />
        </div>
        <div>
          <h4 className="mb-2 font-display text-lg font-semibold text-white">התפריט</h4>
          <ul className="grid gap-1.5">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/menu#cat-${c.id}`} className="hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-display text-lg font-semibold text-white">יצירת קשר</h4>
          <ul className="grid gap-1.5">
            <li>{SITE.address}</li>
            <li dir="ltr" className="text-end tabular-nums">
              {SITE.phoneDisplay}
            </li>
            <li>{SITE.serviceArea}</li>
          </ul>
        </div>
        <p className="border-t border-white/15 pt-4 text-[13.5px] opacity-85 min-[860px]:col-span-3">© טוטו קייטרינג {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
