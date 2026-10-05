import "server-only";
import { unstable_cache } from "next/cache";
import { menuSeed } from "@/data/menu-seed";
import { toCategory, toItem, toOptionGroup, type CategoryRow, type ItemRow, type OptionGroupRow } from "@/lib/menu-rows";
import type { Menu } from "@/lib/menu-types";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";

export const MENU_TAG = "menu";

async function loadPublicMenu(): Promise<Menu> {
  const db = createPublicClient();
  const [cats, groups, items] = await Promise.all([
    db.from("categories").select("*").order("sort"),
    db.from("option_groups").select("*"),
    db.from("items").select("*").order("sort"),
  ]);
  const error = cats.error ?? groups.error ?? items.error;
  if (error) throw new Error(`Loading menu failed: ${error.message}`);

  const categories = (cats.data as CategoryRow[]).map(toCategory);
  const visible = new Set(categories.map((c) => c.id));
  return {
    categories,
    optionGroups: (groups.data as OptionGroupRow[]).map(toOptionGroup),
    // RLS already hides unavailable dishes from the public; also drop dishes of hidden categories.
    items: (items.data as ItemRow[]).filter((r) => visible.has(r.category_id)).map(toItem),
  };
}

const cachedMenu = unstable_cache(loadPublicMenu, ["public-menu"], { tags: [MENU_TAG], revalidate: 3600 });

/**
 * The menu as customers see it. Cached; admin edits call revalidateTag(MENU_TAG).
 * Falls back to the seed file until Supabase is configured.
 */
export async function getMenu(): Promise<Menu> {
  if (!supabaseConfigured) return menuSeed;
  return cachedMenu();
}
