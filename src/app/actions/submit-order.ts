"use server";

import { headers } from "next/headers";
import { getMenu } from "@/lib/menu";
import { priceOrder, type CustomerField } from "@/lib/order";
import { notifyOrder } from "@/lib/whatsapp";

export type SubmitResult =
  | { ok: true; trays: number; total: number; date: string; time: string; firstName: string }
  | { ok: false; fieldErrors: Partial<Record<CustomerField, string>>; error?: string };

/**
 * Best-effort throttle per IP: each order costs WhatsApp messages, so block bursts.
 * In-memory, so it resets per server instance; good enough against casual abuse.
 */
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;

function throttled(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

export async function submitOrder(raw: unknown): Promise<SubmitResult> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (throttled(ip)) {
    return { ok: false, fieldErrors: {}, error: "נשלחו כמה הזמנות ברצף. נסו שוב בעוד כמה דקות, או כתבו לנו בווצאפ." };
  }

  const menu = await getMenu();
  const result = priceOrder(raw, menu);
  if (!result.ok) return result;

  const { order } = result;
  try {
    await notifyOrder(order);
  } catch (err) {
    console.error(err);
    return { ok: false, fieldErrors: {}, error: "לא הצלחנו לשלוח את ההזמנה כרגע. נסו שוב, או התקשרו ל-058-7160723." };
  }

  return {
    ok: true,
    trays: order.trays,
    total: order.total,
    date: order.customer.date,
    time: order.customer.time,
    firstName: order.customer.name.split(" ")[0],
  };
}
