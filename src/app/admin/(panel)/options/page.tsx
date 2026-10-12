import Box from "@mui/material/Box";
import { GroupCard, GroupList, OutlineLink, PageHead } from "@/components/admin/admin-styles";
import { Notice } from "@/components/ui/form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMenu } from "@/lib/admin-menu";

const OptionGroupsPage = async ({ searchParams }: PageProps<"/admin/options">) => {
  const { saved } = await searchParams;
  const { db } = await requireAdmin();
  const { optionGroups, items } = await getAdminMenu(db);

  return (
    <>
      <PageHead>
        <Box>
          <Box component="h1">מילויים וטעמים</Box>
          <Box component="p">{"רשימות הבחירה שהלקוח רואה במנות כמו קרואסונים, קיש ופוקצ'ות."}</Box>
        </Box>
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
            <Box component="li" key={g.id}>
              <GroupCard href={`/admin/options/${g.id}`}>
                <Box component="b">
                  {g.legend} · {g.min === g.max ? `בדיוק ${g.max}` : `עד ${g.max}`}
                </Box>
                <Box component="span">{g.choices.map((c) => (c.extra ? `${c.name} (+${c.extra} ₪)` : c.name)).join(" · ")}</Box>
                <Box component="span" className="used">{used.length ? `במנות: ${used.join(", ")}` : "לא בשימוש באף מנה"}</Box>
              </GroupCard>
            </Box>
          );
        })}
      </GroupList>
    </>
  );
};

export default OptionGroupsPage;
