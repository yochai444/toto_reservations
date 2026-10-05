"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { useOverlay, useStore } from "@/components/store";
import { formatILS } from "@/lib/pricing";

const QUICK = ["סלמון", "פוקצ'ות", "קיש", "טארט", "סלט יווני", "פסטה"];
const norm = (s: string) => s.toLowerCase().replace(/[׳'"״`]/g, "").replace(/\s+/g, " ").trim();

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useStore();
  const close = useCallback(() => setSearchOpen(false), [setSearchOpen]);
  if (!searchOpen) return null;
  return <SearchBody close={close} />;
}

function SearchBody({ close }: { close: () => void }) {
  const { menu, openSheet } = useStore();
  const [q, setQ] = useState("");
  useOverlay(true, close);

  const hits = useMemo(() => {
    const words = norm(q).split(" ").filter(Boolean);
    if (!words.length) return [];
    return menu.items
      .filter((it) => {
        const cat = menu.categories.find((c) => c.id === it.categoryId)?.name ?? "";
        const hay = norm(`${it.name} ${it.description ?? ""} ${cat}`);
        return words.every((w) => hay.includes(w));
      })
      .slice(0, 14);
  }, [q, menu]);

  return (
    <div
      className="fixed inset-0 z-60 flex items-start justify-center bg-berry/50 px-3 pt-[calc(env(safe-area-inset-top,0px)+12px)] min-[760px]:pt-[calc(var(--hdr)+16px)]"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div role="dialog" aria-modal="true" aria-label="חיפוש מנה" className="flex max-h-[80vh] w-full max-w-[640px] animate-up flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center gap-2.5 border-b-2 border-line px-3.5 py-3">
          <SearchIcon className="size-[22px] shrink-0 text-pink-ink" />
          <input
            autoFocus
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="מה מחפשים? למשל סלמון, טארט, פוקצ'ה"
            aria-label="חיפוש מנה"
            className="min-w-0 flex-1 bg-transparent px-0.5 py-2 text-[19px] outline-none"
          />
          <button type="button" onClick={close} aria-label="סגירת החיפוש" className="grid size-9 place-items-center rounded-full bg-blush text-lg text-berry">
            ✕
          </button>
        </div>

        <div className="grid gap-1 overflow-auto p-2">
          {!q.trim() ? (
            <>
              <p className="px-2 pt-2.5 pb-1 text-sm text-muted">חיפושים נפוצים</p>
              <div className="flex flex-wrap gap-2 px-1.5 pb-2.5">
                {QUICK.map((w) => (
                  <button key={w} type="button" onClick={() => setQ(w)} className="rounded-full border-2 border-line px-3.5 py-1.5 font-bold text-pink-ink">
                    {w}
                  </button>
                ))}
              </div>
            </>
          ) : hits.length ? (
            hits.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => {
                  close();
                  openSheet(it.id);
                }}
                className="grid w-full grid-cols-[56px_1fr_auto] items-center gap-3 rounded-2xl p-2 text-start hover:bg-blush focus-visible:bg-blush"
              >
                <Image src={it.image} alt="" width={56} height={56} className="size-14 rounded-xl object-cover" />
                <span>
                  <b className="block leading-tight text-berry">{it.name}</b>
                  <small className="text-muted">
                    {menu.categories.find((c) => c.id === it.categoryId)?.name}
                    {it.unit ? ` · ${it.unit}` : ""}
                  </small>
                </span>
                <span className="price">{formatILS(it.price)}</span>
              </button>
            ))
          ) : (
            <p className="px-3 py-5 text-center text-sm text-muted">לא מצאנו מנה בשם &quot;{q}&quot;. נסו מילה אחרת, או כתבו לנו בווצאפ.</p>
          )}
        </div>
      </div>
    </div>
  );
}
