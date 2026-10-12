import "server-only";
import { sendOrderEmail } from "@/lib/email";
import type { PricedOrder } from "@/lib/order";
import { sendCustomerConfirmation } from "@/lib/whatsapp";

export const notifyOrder = async (order: PricedOrder) => {
  await sendOrderEmail(order);
  try {
    await sendCustomerConfirmation(order);
  } catch (err) {
    console.error(err);
  }
};
