import "server-only";
import { menuSeed } from "@/data/menu-seed";
import type { Menu } from "@/lib/menu-types";

/**
 * Single entry point for reading the menu on the server.
 * Today it returns the seed file; the Supabase phase swaps the body of this function only.
 */
export async function getMenu(): Promise<Menu> {
  return menuSeed;
}
