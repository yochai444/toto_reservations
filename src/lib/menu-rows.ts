import type { Category, Choice, Menu, MenuItem, OptionGroup } from "@/lib/menu-types";

/** Database row shapes (snake_case) and their mapping to the app's menu types. */
export type CategoryRow = { id: string; name: string; note: string; image: string; sort: number; visible: boolean };
export type OptionGroupRow = { id: string; legend: string; cta: string; min: number; max: number; choices: Choice[] };
export type ItemRow = {
  id: string;
  category_id: string;
  name: string;
  price: number;
  image: string;
  unit: string | null;
  description: string | null;
  option_group_id: string | null;
  badge: string | null;
  featured: boolean;
  available: boolean;
  sort: number;
};

export const toCategory = (r: CategoryRow): Category => ({ id: r.id, name: r.name, note: r.note, image: r.image });

export const toOptionGroup = (r: OptionGroupRow): OptionGroup => ({
  id: r.id,
  legend: r.legend,
  cta: r.cta,
  min: r.min,
  max: r.max,
  choices: (r.choices ?? []).map((c) => (c.extra ? { name: c.name, extra: c.extra } : { name: c.name })),
});

export const toItem = (r: ItemRow): MenuItem => ({
  id: r.id,
  categoryId: r.category_id,
  name: r.name,
  price: r.price,
  image: r.image,
  ...(r.unit ? { unit: r.unit } : {}),
  ...(r.description ? { description: r.description } : {}),
  ...(r.option_group_id ? { optionGroupId: r.option_group_id } : {}),
  ...(r.badge ? { badge: r.badge } : {}),
  ...(r.featured ? { featured: true } : {}),
});

/** Seed → rows, used by the setup script. */
export function seedRows(menu: Menu) {
  return {
    categories: menu.categories.map<CategoryRow>((c, i) => ({ ...c, sort: i, visible: true })),
    optionGroups: menu.optionGroups.map<OptionGroupRow>((g) => ({ ...g })),
    items: menu.items.map<ItemRow>((it, i) => ({
      id: it.id,
      category_id: it.categoryId,
      name: it.name,
      price: it.price,
      image: it.image,
      unit: it.unit ?? null,
      description: it.description ?? null,
      option_group_id: it.optionGroupId ?? null,
      badge: it.badge ?? null,
      featured: Boolean(it.featured),
      available: true,
      sort: i,
    })),
  };
}
