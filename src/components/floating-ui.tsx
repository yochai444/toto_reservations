"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { WhatsappIcon } from "@/components/icons";
import { useStore } from "@/components/store";
import { formatILS } from "@/lib/pricing";
import { SITE } from "@/lib/site";

/** Bottom cart bar (phones: full width; desktop: corner pill), WhatsApp button and toast. */
export function FloatingUI() {
  const { totalQty, total, setDrawerOpen, toast } = useStore();
  const pathname = usePathname();
  const showBar = totalQty > 0 && pathname !== "/checkout";

  return (
    <>
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-45 bg-linear-to-t from-cream from-70% to-transparent px-(--gutter) pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] min-[900px]:inset-x-auto min-[900px]:end-6 min-[900px]:bottom-6 min-[900px]:w-[360px] min-[900px]:bg-none min-[900px]:p-0">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex w-full items-center justify-between gap-3 rounded-full bg-pink-btn px-[22px] py-3.5 text-[17px] font-extrabold text-white shadow-pop"
          >
            <span>
              לסיום ההזמנה{" "}
              <span className="rounded-full bg-white px-2.5 py-px text-sm text-pink-ink tabular-nums">{totalQty === 1 ? "מגש אחד" : `${totalQty} מגשים`}</span>
            </span>
            <span className="tabular-nums">{formatILS(total)}</span>
          </button>
        </div>
      )}

      <a
        href={SITE.whatsappLink}
        target="_blank"
        rel="noopener"
        aria-label="שליחת הודעה לטוטו בווצאפ"
        className={`fixed end-4 z-44 grid size-[54px] place-items-center rounded-full bg-wa text-white shadow-lg ${
          showBar ? "bottom-[calc(86px+env(safe-area-inset-bottom,0px))] min-[900px]:bottom-24" : "bottom-[calc(16px+env(safe-area-inset-bottom,0px))]"
        }`}
      >
        <WhatsappIcon className="size-7" />
      </a>

      {toast && (
        <div
          role="status"
          className="fixed top-[calc(var(--hdr)+env(safe-area-inset-top,0px)+12px)] left-1/2 z-80 flex max-w-[calc(100%-32px)] -translate-x-1/2 animate-up items-center gap-2 rounded-full bg-berry px-[18px] py-2.5 font-bold text-white shadow-xl"
        >
          <Image src="/img/crown.png" alt="" width={168} height={193} className="h-[18px] w-auto brightness-0 invert" />
          {toast}
        </div>
      )}
    </>
  );
}
