import Image from "next/image";
import Link from "next/link";
import { moveCategory, moveItem, setItemAvailable } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMenu } from "@/lib/admin-menu";
import { formatILS } from "@/lib/pricing";

const arrowBtn = "grid size-8 place-items-center rounded-full bg-blush font-bold text-pink-ink disabled:opacity-30";

function MoveButtons({ action, id, first, last, label }: { action: (fd: FormData) => Promise<void>; id: string; first: boolean; last: boolean; label: string }) {
  return (
    <div className="flex gap-1">
      {([-1, 1] as const).map((dir) => (
        <form key={dir} action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="dir" value={dir} />
          <button type="submit" className={arrowBtn} disabled={dir === -1 ? first : last} aria-label={`${dir === -1 ? "הזזה למעלה" : "הזזה למטה"}: ${label}`}>
            {dir === -1 ? "↑" : "↓"}
          </button>
        </form>
      ))}
    </div>
  );
}

export default async function AdminMenuPage({ searchParams }: PageProps<"/admin">) {
  const { saved } = await searchParams;
  const { db } = await requireAdmin();
  const { categories, items, optionGroups } = await getAdminMenu(db);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl">התפריט</h1>
          <p className="text-muted">
            {items.length} מנות · {items.filter((i) => !i.available).length} מוסתרות · שינויים מופיעים באתר מיד
          </p>
        </div>
        <Link href="/admin/categories/new" className="rounded-full border-2 border-pink-btn px-4 py-2 font-extrabold text-pink-ink">
          + קטגוריה חדשה
        </Link>
      </div>

      {saved && <p className="mb-5 rounded-[14px] bg-[#E8F7EE] px-4 py-3 font-bold text-[#17643A]">נשמר. השינוי כבר באתר.</p>}

      <div className="grid gap-8">
        {categories.map((c, ci) => {
          const catItems = items.filter((i) => i.category_id === c.id);
          return (
            <section key={c.id} id={`cat-${c.id}`} className="scroll-mt-20 rounded-[22px] bg-white p-4 shadow-card sm:p-5">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <MoveButtons action={moveCategory} id={c.id} first={ci === 0} last={ci === categories.length - 1} label={c.name} />
                <h2 className="text-2xl">{c.name}</h2>
                {!c.visible && <span className="rounded-full bg-[#eee] px-2.5 py-0.5 text-sm font-bold text-muted">מוסתרת מהאתר</span>}
                <span className="text-sm text-muted">{c.note}</span>
                <div className="ms-auto flex gap-2">
                  <Link href={`/admin/categories/${c.id}`} className="rounded-full px-3 py-1.5 text-[15px] font-bold text-pink-ink underline">
                    עריכת קטגוריה
                  </Link>
                  <Link href={`/admin/items/new?category=${c.id}`} className="rounded-full bg-pink-btn px-4 py-1.5 text-[15px] font-extrabold text-white">
                    + מנה
                  </Link>
                </div>
              </div>

              {catItems.length === 0 ? (
                <p className="py-4 text-muted">אין עדיין מנות בקטגוריה הזו.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {catItems.map((it, i) => (
                    <li key={it.id} className={`flex flex-wrap items-center gap-3 py-2.5 ${it.available ? "" : "opacity-55"}`}>
                      <MoveButtons action={moveItem} id={it.id} first={i === 0} last={i === catItems.length - 1} label={it.name} />
                      <Image src={it.image || "/img/crown.png"} alt="" width={56} height={56} className="size-14 rounded-xl bg-blush object-cover" />
                      <Link href={`/admin/items/${it.id}`} className="min-w-0 flex-1 basis-40">
                        <b className="block leading-tight text-berry">{it.name}</b>
                        <span className="text-sm text-muted">
                          {[it.unit, it.option_group_id && optionGroups.find((g) => g.id === it.option_group_id)?.legend, it.badge].filter(Boolean).join(" · ")}
                        </span>
                      </Link>
                      <span className="price">{formatILS(it.price)}</span>
                      <form action={setItemAvailable}>
                        <input type="hidden" name="id" value={it.id} />
                        <input type="hidden" name="available" value={String(!it.available)} />
                        <button
                          type="submit"
                          className={`rounded-full px-3 py-1.5 text-sm font-extrabold ${it.available ? "bg-[#E8F7EE] text-[#17643A]" : "bg-[#eee] text-muted"}`}
                          aria-label={`${it.available ? "הסתרת" : "הצגת"} ${it.name}`}
                        >
                          {it.available ? "מוצג באתר" : "מוסתר"}
                        </button>
                      </form>
                      <Link href={`/admin/items/${it.id}`} className="rounded-full bg-blush px-3.5 py-1.5 text-sm font-extrabold text-pink-ink">
                        עריכה
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
