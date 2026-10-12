const TZ = "Asia/Jerusalem";

export const todayInIsrael = (now = new Date()): string => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(now);

export const addDays = (isoDate: string, days: number): string => {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

export const earliestDeliveryDate = (now = new Date()) => addDays(todayInIsrael(now), 1);

export const formatHebrewDate = (isoDate: string): string => new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("he-IL", {
  timeZone: "UTC",
  weekday: "long",
  day: "numeric",
  month: "numeric",
  year: "numeric",
});
