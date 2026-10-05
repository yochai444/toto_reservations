import { notFound } from "next/navigation";
import { ItemForm } from "@/components/admin/item-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMenu } from "@/lib/admin-menu";

export default async function EditItemPage({ params, searchParams }: PageProps<"/admin/items/[id]">) {
  const [{ id }, { category }] = await Promise.all([params, searchParams]);
  const { db } = await requireAdmin();
  const { categories, optionGroups, items } = await getAdminMenu(db);

  const item = id === "new" ? { category_id: typeof category === "string" ? category : categories[0]?.id } : items.find((i) => i.id === id);
  if (!item) notFound();

  return (
    <>
      <h1 className="mb-5 text-3xl">{"name" in item ? item.name : "מנה חדשה"}</h1>
      <ItemForm item={item} categories={categories} optionGroups={optionGroups} />
    </>
  );
}
