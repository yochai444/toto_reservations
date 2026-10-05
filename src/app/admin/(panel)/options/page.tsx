import { GroupCard, GroupList, OutlineLink, PageHead } from "@/components/admin/admin-styles";
import { Notice } from "@/components/ui/form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMenu } from "@/lib/admin-menu";

export default async function OptionGroupsPage({ searchParams }: PageProps<"/admin/options">) {
  const { saved } = await searchParams;
  const { db } = await requireAdmin();
  const { optionGroups, items } = await getAdminMenu(db);

  return (
    <>
      <PageHead>
        <div>
          <h1>מילויים וטעמים</h1>
          <p>{"רשימות הבחירה שהלקוח רואה במנות כמו קרואסונים, קיש ופוקצ'ות."}</p>
        </div>
        <OutlineLink href="/admin/options/new">+ רשימה חדשה</OutlineLink>
      </PageHead>
      {saved && (
        <Notice tone="ok" sx={{ mb: 2.5, px: 2 }}>
          נשמר. השינוי כבר באתר.
        </Notice>
      )}
      <GroupList>
        {optionGroups.map((g) => {
          const used = items.filter((i) => i.option_group_id === g.id).map((i) => i.name);
          return (
            <li key={g.id}>
              <GroupCard href={`/admin/options/${g.id}`}>
                <b>
                  {g.legend} · {g.min === g.max ? `בדיוק ${g.max}` : `עד ${g.max}`}
                </b>
                <span>{g.choices.map((c) => (c.extra ? `${c.name} (+${c.extra} ₪)` : c.name)).join(" · ")}</span>
                <span className="used">{used.length ? `במנות: ${used.join(", ")}` : "לא בשימוש באף מנה"}</span>
              </GroupCard>
            </li>
          );
        })}
      </GroupList>
    </>
  );
}
