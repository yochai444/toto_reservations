import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMenu } from "@/lib/admin-menu";
import type { CategoryRow } from "@/lib/menu-rows";

export default async function EditCategoryPage({ params, searchParams }: PageProps<"/admin/categories/[id]">) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const { db } = await requireAdmin();
  const { categories, items } = await getAdminMenu(db);

  const category: Partial<CategoryRow> | undefined = id === "new" ? {} : categories.find((c) => c.id === id);
  if (!category) notFound();

  return (
    <>
      <h1 className="mb-5 text-3xl">{category.name ?? "קטגוריה חדשה"}</h1>
      {error === "has-items" && <p className="mb-4 rounded-[14px] bg-[#FFF1F0] px-4 py-3 font-bold text-[#B03224]">אי אפשר למחוק קטגוריה שיש בה מנות.</p>}
      <CategoryForm category={category} itemCount={items.filter((i) => i.category_id === id).length} />
    </>
  );
}
