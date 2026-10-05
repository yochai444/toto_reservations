import "server-only";
import { sendOrderEmail } from "@/lib/email";
import type { PricedOrder } from "@/lib/order";
import { sendCustomerConfirmation } from "@/lib/whatsapp";

/**
 * Delivers a new order: email to the owner (must succeed, or the order fails and the customer
 * is asked to retry), then a WhatsApp confirmation to the customer (a courtesy: a failure is only logged).
 */
export async function notifyOrder(order: PricedOrder) {
  await sendOrderEmail(order);
  try {
    await sendCustomerConfirmation(order);
  } catch (err) {
    console.error(err);
  }
}
