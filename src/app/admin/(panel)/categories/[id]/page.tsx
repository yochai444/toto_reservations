import { notFound } from "next/navigation";
import { PageTitle } from "@/components/admin/admin-styles";
import { CategoryForm } from "@/components/admin/category-form";
import { Notice } from "@/components/ui/form";
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
      <PageTitle>{category.name ?? "קטגוריה חדשה"}</PageTitle>
      {error === "has-items" && <Notice sx={{ mb: 2, px: 2 }}>אי אפשר למחוק קטגוריה שיש בה מנות.</Notice>}
      <CategoryForm category={category} itemCount={items.filter((i) => i.category_id === id).length} />
    </>
  );
}
