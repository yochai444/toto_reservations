import "server-only";
import { formatHebrewDate } from "@/lib/dates";
import { customerMessage, type PricedOrder } from "@/lib/order";

/**
 * WhatsApp confirmation to the customer, sent from the business number (058-7160723).
 * Business-initiated messages must use pre-approved templates, and template parameters
 * cannot contain line breaks.
 *
 * Talks to the Meta Cloud API. The business number joins through coexistence via a provider
 * (planned: YCloud), so the request may need adapting to that provider once it is set up.
 * Without WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID the message is only logged (local development).
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

/** Order confirmation to the customer. Throws on failure; the caller decides whether that matters. */
export async function sendCustomerConfirmation(order: PricedOrder) {
  const businessPhone = process.env.BUSINESS_PHONE_DISPLAY ?? "058-7160723";
  const c = order.customer;

  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.info(`[whatsapp:dry-run] to customer ${c.phone}
${customerMessage(order, businessPhone)}
`);
    return { dryRun: true as const };
  }

  await sendTemplate(toIntl(c.phone), process.env.WHATSAPP_TEMPLATE_CUSTOMER ?? "order_received", [
    c.name.split(" ")[0],
    String(order.trays),
    `${formatHebrewDate(c.date)}, ${c.time}`,
    businessPhone,
  ]);
  return { dryRun: false as const };
}
