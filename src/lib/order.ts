import { z } from "zod";
import { earliestDeliveryDate, formatHebrewDate } from "@/lib/dates";
import type { Menu } from "@/lib/menu-types";
import { formatILS, groupFor, trayPrice, validatePicks } from "@/lib/pricing";

export const customerSchema = z.object({
  name: z.string().trim().min(2, "נא למלא שם מלא").max(60, "השם ארוך מדי"),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(/^05\d{8}$/, "נא למלא מספר נייד ישראלי, לדוגמה 050-1234567")),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "נא לבחור תאריך"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "נא לבחור שעה"),
  place: z.string().trim().min(3, "נא למלא כתובת או שם המקום").max(160, "הכתובת ארוכה מדי"),
});

export const orderInputSchema = z.object({
  customer: customerSchema,
  lines: z
    .array(
      z.object({
        itemId: z.string().min(1).max(80),
        picks: z.array(z.string().max(80)).max(6),
        qty: z.number().int().min(1).max(50),
      }),
    )
    .min(1, "הסל ריק")
    .max(60),
  /** Honeypot: real users never see or fill this field. */
  website: z.string().max(0).optional(),
});

export type OrderInput = z.input<typeof orderInputSchema>;
export type CustomerField = keyof z.infer<typeof customerSchema>;

export type PricedLine = { name: string; picks: string[]; qty: number; unitPrice: number; total: number };
export type PricedOrder = {
  customer: z.infer<typeof customerSchema>;
  lines: PricedLine[];
  trays: number;
  total: number;
};

export type PriceResult = { ok: true; order: PricedOrder } | { ok: false; fieldErrors: Partial<Record<CustomerField, string>>; error?: string };

/**
 * Validates the raw order against the menu and recomputes every price on the server.
 * The browser only sends item ids, picks and quantities, never prices.
 */
export function priceOrder(raw: unknown, menu: Menu, now = new Date()): PriceResult {
  const parsed = orderInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<CustomerField, string>> = {};
    let error: string | undefined;
    for (const issue of parsed.error.issues) {
      const [root, field] = issue.path;
      if (root === "customer" && typeof field === "string") fieldErrors[field as CustomerField] ??= issue.message;
      else error ??= root === "lines" ? "הסל לא תקין. רעננו את העמוד ונסו שוב." : "ההזמנה לא נשלחה. נסו שוב.";
    }
    return { ok: false, fieldErrors, error };
  }

  const { customer, lines } = parsed.data;
  if (customer.date < earliestDeliveryDate(now)) {
    return { ok: false, fieldErrors: { date: "אפשר להזמין החל ממחר" } };
  }

  const priced: PricedLine[] = [];
  for (const line of lines) {
    const item = menu.items.find((i) => i.id === line.itemId);
    if (!item) return { ok: false, fieldErrors: {}, error: "אחת המנות בסל כבר לא בתפריט. הסירו אותה ונסו שוב." };
    const group = groupFor(menu, item);
    const pickError = validatePicks(item, group, line.picks);
    if (pickError) return { ok: false, fieldErrors: {}, error: pickError };
    const unitPrice = trayPrice(item, group, line.picks);
    priced.push({ name: item.name, picks: line.picks, qty: line.qty, unitPrice, total: unitPrice * line.qty });
  }

  return {
    ok: true,
    order: {
      customer,
      lines: priced,
      trays: priced.reduce((a, l) => a + l.qty, 0),
      total: priced.reduce((a, l) => a + l.total, 0),
    },
  };
}

const lineText = (l: PricedLine) => `${l.qty} × ${l.name}${l.picks.length ? ` (${l.picks.join(", ")})` : ""} · ${formatILS(l.total)}`;

/** Plain-text order summary for the owner: the text part of the order email, and the dry-run log. */
export function ownerMessage(o: PricedOrder): string {
  const c = o.customer;
  return [
    "👑 הזמנה חדשה מהאתר",
    "",
    `שם: ${c.name}`,
    `טלפון: ${c.phone}`,
    `מתי: ${formatHebrewDate(c.date)}, ${c.time}`,
    `לאן: ${c.place}`,
    "",
    ...o.lines.map((l) => `• ${lineText(l)}`),
    "",
    `סה״כ משוער: ${formatILS(o.total)}`,
  ].join("\n");
}

export function customerMessage(o: PricedOrder, businessPhone: string): string {
  const first = o.customer.name.split(" ")[0];
  return [
    `היי ${first}, ההזמנה שלך התקבלה בטוטו קייטרינג 👑`,
    "",
    `${o.trays} מגשים ל${formatHebrewDate(o.customer.date)} בשעה ${o.customer.time}.`,
    "נחזור אליך בהקדם לאישור הפרטים ולתיאום התשלום.",
    "",
    `לשאלות: ${businessPhone}`,
  ].join("\n");
}

