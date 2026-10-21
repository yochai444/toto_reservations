import "server-only";
import { customerMessage, customerTemplateParams, type PricedOrder } from "@/lib/order";

const GRAPH = "https://graph.facebook.com/v23.0";

type TemplateParam = { type: "text"; text: string };

const sendTemplate = async (to: string, template: string, params: string[]) => {
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
};

/** Templates reject newlines, tabs and 4+ consecutive spaces in parameters. */
const clean = (s: string) => s.replace(/[\n\t]+/g, " ").replace(/ {4,}/g, "   ").slice(0, 1000);

const toIntl = (local: string) => `972${local.replace(/^0/, "")}`;

export const sendCustomerConfirmation = async (order: PricedOrder) => {
  const phone = order.customer.phone;

  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.info(`[whatsapp:dry-run] to customer ${phone}
${customerMessage(order)}
`);
    return { dryRun: true as const };
  }

  await sendTemplate(toIntl(phone), process.env.WHATSAPP_TEMPLATE_CUSTOMER ?? "order_received", customerTemplateParams(order));
  return { dryRun: false as const };
};
