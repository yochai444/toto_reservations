import { notFound } from "next/navigation";
import { OptionGroupForm } from "@/components/admin/option-group-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMenu } from "@/lib/admin-menu";
import type { OptionGroupRow } from "@/lib/menu-rows";

export default async function EditOptionGroupPage({ params }: PageProps<"/admin/options/[id]">) {
  const { id } = await params;
  const { db } = await requireAdmin();
  const { optionGroups, items } = await getAdminMenu(db);

  const group: Partial<OptionGroupRow> | undefined = id === "new" ? {} : optionGroups.find((g) => g.id === id);
  if (!group) notFound();

  return (
    <>
      <h1 className="mb-5 text-3xl">{group.legend ?? "רשימת בחירה חדשה"}</h1>
      <OptionGroupForm group={group} usedBy={items.filter((i) => i.option_group_id === id).map((i) => i.name)} />
    </>
  );
}
