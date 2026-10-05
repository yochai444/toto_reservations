const TZ = "Asia/Jerusalem";

/** Today's date in Israel as YYYY-MM-DD, regardless of the server's timezone. */
export function todayInIsrael(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(now);
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const earliestDeliveryDate = (now = new Date()) => addDays(todayInIsrael(now), 1);

/** "יום רביעי, 14.10.2026" */
export function formatHebrewDate(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("he-IL", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}
