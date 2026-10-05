"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { Stepper } from "@/components/menu-card";
import { useOverlay, useStore } from "@/components/store";
import { formatILS } from "@/lib/pricing";

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, item, setQty, lineTotal, total } = useStore();
  const close = useCallback(() => setDrawerOpen(false), [setDrawerOpen]);
  useOverlay(drawerOpen, close);
  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex justify-start bg-berry/50" onClick={(e) => e.target === e.currentTarget && close()}>
      <aside role="dialog" aria-modal="true" aria-labelledby="drawer-title" className="flex h-full w-[min(440px,100%)] flex-col bg-cream">
        <div className="flex items-center justify-between bg-pink px-5 pt-[calc(16px+env(safe-area-inset-top,0px))] pb-3.5 text-white">
          <h3 id="drawer-title" className="text-2xl text-white">
            הסל שלי
          </h3>
          <button type="button" onClick={close} aria-label="סגירה" className="grid size-10 place-items-center rounded-full bg-white text-xl text-berry">
            ✕
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="grid flex-1 content-start justify-items-center gap-3 px-4 py-10 text-center text-muted">
            <Image src="/img/crown.png" alt="" width={168} height={193} className="w-[60px] opacity-60" />
            <b className="text-berry">הסל ריק</b>
            <p>הוסיפו מגשים מהתפריט.</p>
            <Link href="/menu" onClick={close} className="btn btn-pink">
              לתפריט
            </Link>
          </div>
        ) : (
          <>
            <div className="grid flex-1 content-start gap-3 overflow-auto px-4 py-3.5">
              {lines.map((l) => {
                const it = item(l.itemId)!;
                return (
                  <div key={l.key} className="grid grid-cols-[72px_1fr] gap-3 rounded-[18px] bg-white p-2.5 shadow-card">
                    <Image src={`/img/${it.image}.webp`} alt="" width={72} height={72} className="size-[72px] rounded-xl object-cover" />
                    <div className="grid min-w-0 gap-1">
                      <div className="leading-tight font-extrabold">{it.name}</div>
                      {l.picks.length > 0 && <div className="text-sm text-muted">{l.picks.join(" + ")}</div>}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Stepper qty={l.qty} onChange={(q) => setQty(l.key, q)} label={`כמות ${it.name}`} />
                        <span className="price text-[1.1rem]">{formatILS(lineTotal(l))}</span>
                      </div>
                      <button type="button" onClick={() => setQty(l.key, 0)} className="justify-self-start text-[13.5px] text-muted underline">
                        הסרה
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid gap-3 border-t border-line bg-white px-5 pt-4 pb-[calc(18px+env(safe-area-inset-bottom,0px))]">
              <div className="flex items-baseline justify-between text-lg font-extrabold">
                <span>סה״כ משוער</span>
                <span className="price text-[1.6rem]">{formatILS(total)}</span>
              </div>
              <p className="text-[13.5px] text-muted">המחיר הסופי, המשלוח והתשלום נסגרים מול טוטו בווצאפ.</p>
              <Link href="/checkout" onClick={close} className="btn btn-pink">
                להמשך ההזמנה
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
