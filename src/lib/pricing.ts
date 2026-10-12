import type { Menu, MenuItem, OptionGroup } from "@/lib/menu-types";

export type CartLine = { key: string; itemId: string; picks: string[]; qty: number };

export const lineKey = (itemId: string, picks: string[]) => `${itemId}|${[...picks].sort().join(",")}`;

export const formatILS = (n: number) => `${n.toLocaleString("he-IL")} ₪`;

export const groupFor = (menu: Menu, item: MenuItem): OptionGroup | undefined =>
  item.optionGroupId ? menu.optionGroups.find((g) => g.id === item.optionGroupId) : undefined;

export const trayPrice = (item: MenuItem, group: OptionGroup | undefined, picks: string[]): number => {
  if (!group) return item.price;
  return group.choices.reduce((sum, c) => (c.extra && picks.includes(c.name) ? sum + c.extra : sum), item.price);
};

export const validatePicks = (item: MenuItem, group: OptionGroup | undefined, picks: string[]): string | null => {
  if (!group) return picks.length ? `למנה "${item.name}" אין אפשרויות בחירה` : null;
  if (new Set(picks).size !== picks.length) return `בחירה כפולה ב"${item.name}"`;
  if (picks.some((p) => !group.choices.some((c) => c.name === p))) return `בחירה לא קיימת ב"${item.name}"`;
  if (picks.length < group.min || picks.length > group.max) {
    return group.max === 1 ? `יש לבחור אפשרות אחת ב"${item.name}"` : `יש לבחור עד ${group.max} ב"${item.name}"`;
  }
  return null;
};
