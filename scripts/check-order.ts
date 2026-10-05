// Sanity checks for server-side order pricing/validation. Run: npx tsx scripts/check-order.ts
import assert from "node:assert/strict";
import { menuSeed } from "../src/data/menu-seed";
import { ownerMessage, priceOrder } from "../src/lib/order";

const now = new Date("2026-10-05T10:00:00Z");
const customer = { name: "מיכל לוי", phone: "050-123 4567", date: "2026-10-14", time: "12:30", place: "עכו, הארבעה 27" };

const ok = priceOrder({ customer, lines: [
  { itemId: "croissants", picks: ["סלט טונה", "סלמון מעושן"], qty: 2 },
  { itemId: "beet-carpaccio", picks: [], qty: 1 },
] }, menuSeed, now);
assert.ok(ok.ok);
if (ok.ok) {
  assert.equal(ok.order.total, (180 + 45) * 2 + 145);
  assert.equal(ok.order.customer.phone, "0501234567");
  console.log(ownerMessage(ok.order));
}

const bad = (lines: unknown, c = customer) => priceOrder({ customer: c, lines }, menuSeed, now);
assert.equal(bad([{ itemId: "croissants", picks: ["חביתה", "סלט טונה", "סלט ביצים"], qty: 1 }]).ok, false, "max 2 picks");
assert.equal(bad([{ itemId: "croissants", picks: [], qty: 1 }]).ok, false, "min 1 pick");
assert.equal(bad([{ itemId: "shakshuka", picks: ["קלאסית", "פיקנטית"], qty: 1 }]).ok, false, "shakshuka exactly 1");
assert.equal(bad([{ itemId: "beet-carpaccio", picks: ["סלמון מעושן"], qty: 1 }]).ok, false, "no picks on plain item");
assert.equal(bad([{ itemId: "nope", picks: [], qty: 1 }]).ok, false, "unknown item");
assert.equal(bad([{ itemId: "tortillas", picks: ["סלמון מעושן"], qty: 1 }]).ok, false, "salmon not allowed in tortilla");
const past = bad([{ itemId: "beet-carpaccio", picks: [], qty: 1 }], { ...customer, date: "2026-10-05" });
assert.ok(!past.ok && past.fieldErrors.date, "same-day rejected");
const phone = bad([{ itemId: "beet-carpaccio", picks: [], qty: 1 }], { ...customer, phone: "123" });
assert.ok(!phone.ok && phone.fieldErrors.phone, "bad phone rejected");
console.log("\nall order checks passed");
