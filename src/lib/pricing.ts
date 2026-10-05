import type { Menu, MenuItem, OptionGroup } from "@/lib/menu-types";

export type CartLine = { key: string; itemId: string; picks: string[]; qty: number };

export const lineKey = (itemId: string, picks: string[]) => `${itemId}|${[...picks].sort().join(",")}`;

export const formatILS = (n: number) => `${n.toLocaleString("he-IL")} ₪`;

export function groupFor(menu: Menu, item: MenuItem): OptionGroup | undefined {
  return item.optionGroupId ? menu.optionGroups.find((g) => g.id === item.optionGroupId) : undefined;
}

/** Price of one tray including choice extras (each extra counted once per tray). */
export function trayPrice(item: MenuItem, group: OptionGroup | undefined, picks: string[]): number {
  if (!group) return item.price;
  return group.choices.reduce((sum, c) => (c.extra && picks.includes(c.name) ? sum + c.extra : sum), item.price);
}

/** Returns an error message (Hebrew) when the picks don't satisfy the item's option group. */
export function validatePicks(item: MenuItem, group: OptionGroup | undefined, picks: string[]): string | null {
  if (!group) return picks.length ? `למנה "${item.name}" אין אפשרויות בחירה` : null;
  if (new Set(picks).size !== picks.length) return `בחירה כפולה ב"${item.name}"`;
  if (picks.some((p) => !group.choices.some((c) => c.name === p))) return `בחירה לא קיימת ב"${item.name}"`;
  if (picks.length < group.min || picks.length > group.max) {
    return group.max === 1 ? `יש לבחור אפשרות אחת ב"${item.name}"` : `יש לבחור עד ${group.max} ב"${item.name}"`;
  }
  return null;
}
