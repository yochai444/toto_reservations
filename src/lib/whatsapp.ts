import "server-only";
import { formatHebrewDate } from "@/lib/dates";
import { customerMessage, inlineItems, ownerMessage, type PricedOrder } from "@/lib/order";
import { formatILS } from "@/lib/pricing";

/**
 * WhatsApp Cloud API (Meta). Business-initiated messages must use pre-approved templates,
 * and template parameters cannot contain line breaks.
 *
 * Without WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID the order is only logged (local development).
 */
const GRAPH = "https://graph.facebook.com/v23.0";

type TemplateParam = { type: "text"; text: string };

async function sendTemplate(to: string, template: string, params: string[]) {
  const token = process.env.WHATSAPP_TOKEN!;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const res = await fetch(`${GRAPH}/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: template,
        language: { code: "he" },
        components: [{ type: "body", parameters: params.map<TemplateParam>((text) => ({ type: "text", text: clean(text) })) }],
      },
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`WhatsApp ${template} failed: ${res.status} ${await res.text()}`);
}

/** Templates reject newlines, tabs and 4+ consecutive spaces in parameters. */
const clean = (s: string) => s.replace(/[\n\t]+/g, " ").replace(/ {4,}/g, "   ").slice(0, 1000);

/** 05X1234567 → 9725X1234567 */
const toIntl = (local: string) => `972${local.replace(/^0/, "")}`;

export async function notifyOrder(order: PricedOrder) {
  const ownerPhone = process.env.OWNER_WHATSAPP ?? "0587160723";
  const businessPhone = process.env.BUSINESS_PHONE_DISPLAY ?? "058-7160723";

  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.info(`[whatsapp:dry-run] to owner ${ownerPhone}\n${ownerMessage(order)}\n`);
    console.info(`[whatsapp:dry-run] to customer ${order.customer.phone}\n${customerMessage(order, businessPhone)}\n`);
    return { dryRun: true as const };
  }

  const c = order.customer;
  await sendTemplate(toIntl(ownerPhone), process.env.WHATSAPP_TEMPLATE_OWNER ?? "new_order", [
    c.name,
    c.phone,
    `${formatHebrewDate(c.date)}, ${c.time}`,
    c.place,
    inlineItems(order),
    formatILS(order.total),
  ]);

  // The customer confirmation is a courtesy: a failure here must not fail the order.
  try {
    await sendTemplate(toIntl(c.phone), process.env.WHATSAPP_TEMPLATE_CUSTOMER ?? "order_received", [
      c.name.split(" ")[0],
      String(order.trays),
      `${formatHebrewDate(c.date)}, ${c.time}`,
      businessPhone,
    ]);
  } catch (err) {
    console.error(err);
  }
  return { dryRun: false as const };
}
