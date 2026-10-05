import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoryRow, ItemRow, OptionGroupRow } from "@/lib/menu-rows";

/** Everything, including hidden categories and unavailable dishes (RLS lets admins see all). */
export async function getAdminMenu(db: SupabaseClient) {
  const [cats, groups, items] = await Promise.all([
    db.from("categories").select("*").order("sort"),
    db.from("option_groups").select("*").order("id"),
    db.from("items").select("*").order("sort"),
  ]);
  const error = cats.error ?? groups.error ?? items.error;
  if (error) throw new Error(error.message);
  return {
    categories: cats.data as CategoryRow[],
    optionGroups: groups.data as OptionGroupRow[],
    items: items.data as ItemRow[],
  };
}
