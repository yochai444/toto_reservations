import "server-only";
import axios from "axios";
import { customerMessage, customerTemplateParams, type PricedOrder } from "@/lib/order";

const YCLOUD_SEND = "https://api.ycloud.com/v2/whatsapp/messages/sendDirectly";

type TemplateParam = { type: "text"; text: string };

const sendTemplate = async (to: string, template: string, params: string[]) => {
  const res = await axios.post<{ status?: string }>(
    YCLOUD_SEND,
    {
      from: process.env.WHATSAPP_FROM,
      to,
      type: "template",
      template: {
        name: template,
        language: { code: "he" },
        components: [{ type: "body", parameters: params.map<TemplateParam>((text) => ({ type: "text", text: clean(text) })) }],
      },
    },
    { headers: { "X-API-Key": process.env.YCLOUD_API_KEY! }, timeout: 15_000, validateStatus: () => true },
  );
  if (res.status >= 300 || res.data?.status === "failed") {
    throw new Error(`WhatsApp ${template} failed: ${res.status} ${JSON.stringify(res.data)}`);
  }
};

/** Templates reject newlines, tabs and 4+ consecutive spaces in parameters. */
const clean = (s: string) => s.replace(/[\n\t]+/g, " ").replace(/ {4,}/g, "   ").slice(0, 1000);

const toIntl = (local: string) => `+972${local.replace(/^0/, "")}`;

export const sendCustomerConfirmation = async (order: PricedOrder) => {
  const phone = order.customer.phone;

  if (!process.env.YCLOUD_API_KEY || !process.env.WHATSAPP_FROM) {
    console.info(`[whatsapp:dry-run] to customer ${phone}
${customerMessage(order)}
`);
    return { dryRun: true as const };
  }

  await sendTemplate(toIntl(phone), process.env.WHATSAPP_TEMPLATE_CUSTOMER ?? "order_received", customerTemplateParams(order));
  return { dryRun: false as const };
};
