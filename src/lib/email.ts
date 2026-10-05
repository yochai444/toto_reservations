import "server-only";
import { formatHebrewDate } from "@/lib/dates";
import { ownerMessage, type PricedOrder } from "@/lib/order";
import { formatILS } from "@/lib/pricing";

/**
 * New-order email to the owner, sent with Resend (https://resend.com).
 *
 * Without RESEND_API_KEY the email is only logged (local development).
 * Until a domain is verified in Resend, the sender must be onboarding@resend.dev and the
 * recipient must be the email address the Resend account was created with.
 */
const esc = (s: string) => s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

/** 05X1234567 → 9725X1234567 */
const toIntl = (local: string) => `972${local.replace(/^0/, "")}`;
/** 0501234567 → 050-1234567 */
const dashed = (local: string) => `${local.slice(0, 3)}-${local.slice(3)}`;

const PINK = "#c8377c";
const INK = "#3a1a2b";
const MUTED = "#7a5869";
const LINE = "#f2c6da";

function orderHtml(o: PricedOrder): string {
  const c = o.customer;
  const when = `${formatHebrewDate(c.date)}, ${c.time}`;
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;color:${MUTED};width:70px;vertical-align:top">${label}</td><td style="padding:6px 0;font-weight:700">${value}</td></tr>`;
  const lines = o.lines
    .map(
      (l) => `<tr>
        <td style="padding:10px 0;border-top:1px solid ${LINE};vertical-align:top;white-space:nowrap;font-weight:700">${l.qty} ×</td>
        <td style="padding:10px 8px;border-top:1px solid ${LINE}">${esc(l.name)}${
          l.picks.length ? `<div style="color:${MUTED};font-size:14px">${esc(l.picks.join(", "))}</div>` : ""
        }</td>
        <td style="padding:10px 0;border-top:1px solid ${LINE};text-align:left;white-space:nowrap">${formatILS(l.total)}</td>
      </tr>`,
    )
    .join("");
  const button = (href: string, label: string, bg: string) =>
    `<a href="${href}" style="display:inline-block;margin:4px 0 4px 8px;padding:10px 18px;border-radius:999px;background:${bg};color:#fff;font-weight:700;text-decoration:none">${label}</a>`;

  return `<!doctype html>
<html lang="he" dir="rtl"><body style="margin:0;background:#fff6fa;font-family:Arial,Helvetica,sans-serif;color:${INK}">
<div dir="rtl" style="max-width:560px;margin:0 auto;padding:20px 12px">
  <div style="background:#e4519a;color:#fff;border-radius:18px 18px 0 0;padding:18px 22px;font-size:22px;font-weight:700">👑 הזמנה חדשה מהאתר</div>
  <div style="background:#fff;border-radius:0 0 18px 18px;padding:18px 22px">
    <table role="presentation" style="width:100%;border-collapse:collapse;font-size:16px">
      ${row("שם", esc(c.name))}
      ${row("טלפון", `<a href="tel:${c.phone}" style="color:${PINK}" dir="ltr">${dashed(c.phone)}</a>`)}
      ${row("מתי", esc(when))}
      ${row("לאן", esc(c.place))}
    </table>
    <div style="margin:14px 0 4px">
      ${button(`https://wa.me/${toIntl(c.phone)}`, "וואטסאפ ללקוח", "#1f9d55")}
      ${button(`tel:${c.phone}`, "התקשרות", PINK)}
    </div>
    <table role="presentation" style="width:100%;border-collapse:collapse;font-size:16px;margin-top:14px">
      ${lines}
      <tr>
        <td colspan="2" style="padding:12px 0;border-top:2px solid ${LINE};font-weight:700">סה״כ משוער · ${o.trays} מגשים</td>
        <td style="padding:12px 0;border-top:2px solid ${LINE};text-align:left;white-space:nowrap;font-weight:700;font-size:20px;color:${PINK}">${formatILS(o.total)}</td>
      </tr>
    </table>
    <p style="margin:14px 0 0;color:${MUTED};font-size:13px">המחירים חושבו בשרת לפי התפריט. המחיר הסופי, המשלוח והתשלום נסגרים מול הלקוח.</p>
  </div>
</div>
</body></html>`;
}

export async function sendOrderEmail(order: PricedOrder) {
  const c = order.customer;
  const to = process.env.OWNER_EMAIL;
  const subject = `הזמנה חדשה · ${c.name} · ${formatHebrewDate(c.date)} ${c.time} · ${formatILS(order.total)}`;

  if (!process.env.RESEND_API_KEY || !to) {
    console.info(`[email:dry-run] to ${to || "(OWNER_EMAIL not set)"}\nSubject: ${subject}\n${ownerMessage(order)}\n`);
    return { dryRun: true as const };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ORDER_EMAIL_FROM || "TOTO Orders <onboarding@resend.dev>",
      to: to.split(",").map((s) => s.trim()),
      subject,
      html: orderHtml(order),
      text: ownerMessage(order),
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Order email failed: ${res.status} ${await res.text()}`);
  return { dryRun: false as const };
}
