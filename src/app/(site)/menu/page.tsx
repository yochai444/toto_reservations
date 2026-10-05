import type { Metadata } from "next";
import Image from "next/image";
import { CategoryChips } from "@/components/category-chips";
import { MenuCard } from "@/components/menu-card";
import { getMenu } from "@/lib/menu";

export const metadata: Metadata = { title: "התפריט" };

export default async function MenuPage() {
  const menu = await getMenu();
  return (
    <>
      <section className="pattern-white bg-pink text-white">
        <div className="wrap grid gap-2 pt-8.5 pb-7.5">
          <h1 className="text-[clamp(2.1rem,6vw,3.2rem)] font-bold text-white">התפריט של טוטו</h1>
          <p className="text-[1.08rem] font-semibold">כל המחירים למגש · חלבי, כשר למהדרין · תפריט 2026</p>
        </div>
      </section>

      <CategoryChips categories={menu.categories} />

      <div className="wrap">
        {menu.categories.map((c) => (
          <section key={c.id} id={`cat-${c.id}`} data-sec={c.id} className="menu-section pt-9.5 pb-2">
            <div className="mb-5 flex flex-wrap items-center gap-x-3.5 gap-y-2.5">
              <h2 className="flex items-center gap-2.5 text-[clamp(1.7rem,4vw,2.3rem)]">
                <Image src="/img/crown.png" alt="" width={168} height={193} className="h-7 w-auto" />
                {c.name}
              </h2>
              <span className="rounded-full bg-butter px-3.5 py-1 text-[14.5px] font-extrabold text-berry">{c.note}</span>
            </div>
            <div className="grid grid-cols-2 gap-3.5 min-[760px]:grid-cols-3 min-[760px]:gap-5.5 min-[1120px]:grid-cols-4">
              {menu.items
                .filter((i) => i.categoryId === c.id)
                .map((it) => (
                  <MenuCard key={it.id} item={it} />
                ))}
            </div>
          </section>
        ))}
        <p className="pt-10 pb-30 text-center text-muted">זה כל התפריט. משהו חסר? כתבו לנו בווצאפ ונשמח להתאים.</p>
      </div>
    </>
  );
}
