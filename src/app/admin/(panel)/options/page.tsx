import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMenu } from "@/lib/admin-menu";

export default async function OptionGroupsPage({ searchParams }: PageProps<"/admin/options">) {
  const { saved } = await searchParams;
  const { db } = await requireAdmin();
  const { optionGroups, items } = await getAdminMenu(db);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl">מילויים וטעמים</h1>
          <p className="text-muted">{"רשימות הבחירה שהלקוח רואה במנות כמו קרואסונים, קיש ופוקצ'ות."}</p>
        </div>
        <Link href="/admin/options/new" className="rounded-full border-2 border-pink-btn px-4 py-2 font-extrabold text-pink-ink">
          + רשימה חדשה
        </Link>
      </div>
      {saved && <p className="mb-5 rounded-[14px] bg-[#E8F7EE] px-4 py-3 font-bold text-[#17643A]">נשמר. השינוי כבר באתר.</p>}
      <ul className="grid gap-3">
        {optionGroups.map((g) => {
          const used = items.filter((i) => i.option_group_id === g.id).map((i) => i.name);
          return (
            <li key={g.id}>
              <Link href={`/admin/options/${g.id}`} className="grid gap-1 rounded-[18px] bg-white p-4 shadow-card hover:ring-2 hover:ring-line">
                <b className="text-berry">
                  {g.legend} · {g.min === g.max ? `בדיוק ${g.max}` : `עד ${g.max}`}
                </b>
                <span>{g.choices.map((c) => (c.extra ? `${c.name} (+${c.extra} ₪)` : c.name)).join(" · ")}</span>
                <span className="text-sm text-muted">{used.length ? `במנות: ${used.join(", ")}` : "לא בשימוש באף מנה"}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
