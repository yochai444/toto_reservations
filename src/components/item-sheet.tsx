"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Stepper } from "@/components/menu-card";
import { useOverlay, useStore } from "@/components/store";
import { formatILS, trayPrice } from "@/lib/pricing";

/** Dish details + option picker. Mounted only while open, keyed by item, so state starts fresh. */
export function ItemSheet() {
  const { sheetItemId } = useStore();
  if (!sheetItemId) return null;
  return <SheetBody key={sheetItemId} itemId={sheetItemId} />;
}

function SheetBody({ itemId }: { itemId: string }) {
  const { item: getItem, group, addLine, openSheet, showToast } = useStore();
  const item = getItem(itemId)!;
  const g = group(item);
  const [picks, setPicks] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const close = useCallback(() => openSheet(null), [openSheet]);
  useOverlay(true, close);

  const toggle = (name: string) => {
    if (!g) return;
    if (g.max === 1) return setPicks([name]);
    setPicks((p) => (p.includes(name) ? p.filter((x) => x !== name) : p.length < g.max ? [...p, name] : p));
  };
  const ready = !g || picks.length >= g.min;
  const total = trayPrice(item, g, picks) * qty;

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center bg-berry/50 min-[760px]:items-center min-[760px]:p-6" onClick={(e) => e.target === e.currentTarget && close()}>
      <div role="dialog" aria-modal="true" aria-labelledby="sheet-title" className="max-h-[92vh] w-full max-w-[560px] animate-up overflow-auto rounded-t-[28px] bg-white min-[760px]:rounded-[28px]">
        <div className="relative aspect-video bg-blush">
          <Image src={`/img/${item.image}.webp`} alt="" fill sizes="560px" className="object-cover" />
          <button type="button" onClick={close} aria-label="סגירה" className="absolute end-3 top-3 grid size-10 place-items-center rounded-full bg-white text-xl text-berry shadow-lg">
            ✕
          </button>
        </div>

        <div className="grid gap-3.5 px-[22px] pt-5 pb-[22px]">
          <h3 id="sheet-title" className="text-[1.6rem]">
            {item.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {item.unit && <span className="chip-unit">{item.unit}</span>}
            <span className="price text-[1.3rem]">{formatILS(item.price)}</span>
            <span className="text-sm text-muted">למגש</span>
          </div>
          {item.description && <p className="text-[14.5px] text-muted">{item.description}</p>}

          {g && (
            <fieldset className="grid gap-2.5">
              <legend className="mb-1 flex w-full justify-between font-display text-lg font-semibold text-berry">
                {g.legend}
                <span className="font-body text-sm font-extrabold text-pink-ink tabular-nums">
                  {picks.length} מתוך {g.max}
                </span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {g.choices.map((c, i) => {
                  const checked = picks.includes(c.name);
                  const disabled = !checked && g.max > 1 && picks.length >= g.max;
                  return (
                    <label
                      key={c.name}
                      htmlFor={`opt-${i}`}
                      className={`relative inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 px-3.5 py-2 text-[15px] font-bold has-focus-visible:outline-3 has-focus-visible:outline-butter ${
                        checked ? "border-pink-btn bg-pink-btn text-white" : "border-line bg-white"
                      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                    >
                      <input
                        id={`opt-${i}`}
                        type={g.max === 1 ? "radio" : "checkbox"}
                        name="opt"
                        className="sr-only"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggle(c.name)}
                      />
                      {c.name}
                      {c.extra && <span className="rounded-full bg-butter px-2 text-[12.5px] text-berry tabular-nums">+{c.extra} ₪</span>}
                    </label>
                  );
                })}
              </div>
              <p className="text-sm text-muted">
                {g.max === 1 ? "בחירה אחת" : `אפשר לבחור עד ${g.max} למגש`}
                {g.choices.some((c) => c.extra) ? ". התוספת היא למגש כולו." : "."}
              </p>
            </fieldset>
          )}
        </div>

        <div className="sticky bottom-0 flex items-center gap-3 border-t border-line bg-white px-[22px] pt-3.5 pb-[calc(16px+env(safe-area-inset-bottom,0px))]">
          <Stepper qty={qty} onChange={(q) => setQty(Math.max(1, Math.min(50, q)))} label="כמות מגשים" />
          <button
            type="button"
            disabled={!ready}
            className="btn btn-pink flex-1"
            onClick={() => {
              addLine(item.id, picks, qty);
              showToast(`נוסף לסל: ${item.name}`);
              close();
            }}
          >
            הוספה לסל · <span className="tabular-nums">{formatILS(total)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
