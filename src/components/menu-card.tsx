"use client";

import Image from "next/image";
import { useStore } from "@/components/store";
import type { MenuItem } from "@/lib/menu-types";
import { formatILS } from "@/lib/pricing";

export function Stepper({ qty, onChange, label }: { qty: number; onChange: (q: number) => void; label: string }) {
  const btn = "grid size-8 place-items-center rounded-full bg-white text-xl leading-none font-bold text-pink-ink";
  return (
    <div className="inline-flex items-center rounded-full bg-blush p-[3px]" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(qty - 1)} aria-label="הפחתה">
        −
      </button>
      <output className="min-w-[30px] text-center font-extrabold tabular-nums">{qty}</output>
      <button type="button" className={btn} onClick={() => onChange(qty + 1)} aria-label="הוספה">
        +
      </button>
    </div>
  );
}

export function MenuCard({ item }: { item: MenuItem }) {
  const { group, lines, addLine, setQty, qtyOfItem, openSheet, showToast } = useStore();
  const g = group(item);
  const inCart = qtyOfItem(item.id);
  const plainLine = !g ? lines.find((l) => l.itemId === item.id) : undefined;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-[26px] bg-white shadow-card">
      <button
        type="button"
        onClick={() => openSheet(item.id)}
        aria-label={`פרטים על ${item.name}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-blush"
      >
        <Image
          src={`/img/${item.image}.webp`}
          alt=""
          fill
          sizes="(min-width:1120px) 280px, (min-width:760px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {item.badge && (
          <span className="absolute start-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-butter px-2.5 py-0.5 text-[12.5px] font-extrabold text-berry">
            <Image src="/img/crown.png" alt="" width={168} height={193} className="h-[13px] w-auto" />
            {item.badge}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5 min-[760px]:px-[18px] min-[760px]:pt-4 min-[760px]:pb-[18px]">
        <h3 className="text-[1.06rem] leading-tight font-semibold min-[760px]:text-[1.18rem]">{item.name}</h3>
        {item.description && <p className="text-[14.5px] leading-snug text-muted">{item.description}</p>}
        {item.unit && <span className="chip-unit">{item.unit}</span>}
        {g?.choices.some((c) => c.extra) && (
          <p className="text-[14.5px] leading-snug text-muted">
            עד {g.max} מילויים · סלמון מעושן +{g.choices.find((c) => c.extra)!.extra} ₪
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2.5">
          <span className="price text-[1.3rem]">{formatILS(item.price)}</span>
          {g ? (
            <div className="flex items-center gap-1.5">
              {inCart > 0 && (
                <span className="rounded-full bg-butter px-2 py-0.5 text-[12.5px] font-extrabold text-berry tabular-nums">בסל: {inCart}</span>
              )}
              <button type="button" onClick={() => openSheet(item.id)} className="rounded-full bg-pink-btn px-3.5 py-2 text-[15px] font-extrabold text-white shadow-pop-sm">
                {g.cta}
              </button>
            </div>
          ) : plainLine ? (
            <Stepper qty={plainLine.qty} onChange={(q) => setQty(plainLine.key, q)} label={`כמות ${item.name}`} />
          ) : (
            <button
              type="button"
              onClick={() => {
                addLine(item.id, [], 1);
                showToast(`נוסף לסל: ${item.name}`);
              }}
              aria-label={`הוספת ${item.name} לסל`}
              className="rounded-full bg-pink-btn px-3.5 py-2 text-[15px] font-extrabold text-white shadow-pop-sm hover:brightness-105"
            >
              + הוספה
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
