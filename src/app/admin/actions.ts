"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { MENU_TAG } from "@/lib/menu";

export type FormState = { error?: string; fieldErrors?: Record<string, string> } | undefined;

/** Customers see admin edits on their next page load. */
function refreshSite() {
  revalidateTag(MENU_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}

const text = (max: number) => z.string().trim().max(max, `עד ${max} תווים`);
const optionalText = (max: number) =>
  text(max)
    .optional()
    .transform((v) => (v ? v : null));
const checkbox = z
  .string()
  .optional()
  .transform((v) => v === "on");

function fieldErrorsOf(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const i of error.issues) out[String(i.path[0])] ??= i.message;
  return out;
}

const formObject = (fd: FormData) => Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === "string"));

async function nextSort(db: Awaited<ReturnType<typeof requireAdmin>>["db"], table: "items" | "categories", categoryId?: string) {
  let q = db.from(table).select("sort").order("sort", { ascending: false }).limit(1);
  if (categoryId) q = q.eq("category_id", categoryId);
  const { data } = await q;
  return (data?.[0]?.sort ?? -1) + 1;
}

/* ---------------- dishes ---------------- */

const itemSchema = z.object({
  id: z.string().optional(),
  category_id: z.string().min(1, "נא לבחור קטגוריה"),
  name: text(120).min(2, "נא למלא שם מנה"),
  price: z.coerce.number({ message: "נא למלא מחיר" }).int("מחיר בשקלים שלמים").min(0, "מחיר לא תקין").max(100000, "מחיר לא תקין"),
  unit: optionalText(40),
  description: optionalText(300),
  option_group_id: optionalText(80),
  badge: optionalText(20),
  image: text(1000).min(1, "נא להעלות תמונה"),
  featured: checkbox,
  available: checkbox,
});

export async function saveItem(_: FormState, fd: FormData): Promise<FormState> {
  const { db } = await requireAdmin();
  const parsed = itemSchema.safeParse(formObject(fd));
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };
  const { id, ...row } = parsed.data;

  if (id) {
    const { error } = await db.from("items").update({ ...row, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return { error: `השמירה נכשלה: ${error.message}` };
  } else {
    const sort = await nextSort(db, "items", row.category_id);
    const { error } = await db.from("items").insert({ ...row, id: randomUUID(), sort });
    if (error) return { error: `השמירה נכשלה: ${error.message}` };
  }
  refreshSite();
  redirect(`/admin?saved=1#cat-${row.category_id}`);
}

export async function deleteItem(fd: FormData) {
  const { db } = await requireAdmin();
  const id = String(fd.get("id"));
  const { data } = await db.from("items").select("category_id").eq("id", id).maybeSingle();
  await db.from("items").delete().eq("id", id);
  refreshSite();
  redirect(`/admin${data ? `#cat-${data.category_id}` : ""}`);
}

export async function setItemAvailable(fd: FormData) {
  const { db } = await requireAdmin();
  await db
    .from("items")
    .update({ available: fd.get("available") === "true" })
    .eq("id", String(fd.get("id")));
  refreshSite();
}

/** Swap a dish with its neighbor inside its category (dir = -1 up, 1 down). */
export async function moveItem(fd: FormData) {
  const { db } = await requireAdmin();
  const id = String(fd.get("id"));
  const dir = Number(fd.get("dir"));
  const { data: me } = await db.from("items").select("category_id").eq("id", id).single();
  if (!me) return;
  const { data: siblings } = await db.from("items").select("id").eq("category_id", me.category_id).order("sort");
  const ids = (siblings ?? []).map((s) => s.id);
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await Promise.all(ids.map((itemId, sort) => db.from("items").update({ sort }).eq("id", itemId)));
  refreshSite();
}

/* ---------------- categories ---------------- */

const categorySchema = z.object({
  id: z.string().optional(),
  name: text(60).min(2, "נא למלא שם קטגוריה"),
  note: text(80),
  image: text(1000),
  visible: checkbox,
});

export async function saveCategory(_: FormState, fd: FormData): Promise<FormState> {
  const { db } = await requireAdmin();
  const parsed = categorySchema.safeParse(formObject(fd));
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };
  const { id, ...row } = parsed.data;

  const newId = id || `cat-${randomUUID().slice(0, 8)}`;
  const { error } = id
    ? await db.from("categories").update({ ...row, updated_at: new Date().toISOString() }).eq("id", id)
    : await db.from("categories").insert({ ...row, id: newId, sort: await nextSort(db, "categories") });
  if (error) return { error: `השמירה נכשלה: ${error.message}` };
  refreshSite();
  redirect(`/admin?saved=1#cat-${newId}`);
}

export async function deleteCategory(fd: FormData): Promise<void> {
  const { db } = await requireAdmin();
  const id = String(fd.get("id"));
  const { count } = await db.from("items").select("id", { count: "exact", head: true }).eq("category_id", id);
  if (count) redirect(`/admin/categories/${id}?error=has-items`);
  await db.from("categories").delete().eq("id", id);
  refreshSite();
  redirect("/admin");
}

export async function moveCategory(fd: FormData) {
  const { db } = await requireAdmin();
  const id = String(fd.get("id"));
  const dir = Number(fd.get("dir"));
  const { data } = await db.from("categories").select("id").order("sort");
  const ids = (data ?? []).map((c) => c.id);
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await Promise.all(ids.map((catId, sort) => db.from("categories").update({ sort }).eq("id", catId)));
  refreshSite();
}

/* ---------------- option groups (fillings / flavors) ---------------- */

const choiceSchema = z.object({
  name: text(60).min(1, "שם אפשרות ריק"),
  extra: z.number().int().min(0).max(10000).optional(),
});

const groupSchema = z
  .object({
    id: z.string().optional(),
    legend: text(60).min(2, "נא למלא כותרת"),
    cta: text(30).min(2, "נא למלא טקסט לכפתור"),
    min: z.coerce.number().int().min(0, "מינימום לא תקין").max(20),
    max: z.coerce.number().int().min(1, "מקסימום לא תקין").max(20),
    choices: z
      .string()
      .transform((s, ctx) => {
        try {
          return JSON.parse(s) as unknown;
        } catch {
          ctx.addIssue({ code: "custom", message: "רשימת אפשרויות לא תקינה" });
          return z.NEVER;
        }
      })
      .pipe(z.array(choiceSchema).min(1, "צריך לפחות אפשרות אחת")),
  })
  .refine((g) => g.min <= g.max, { message: "המינימום גדול מהמקסימום", path: ["min"] })
  .refine((g) => g.max <= g.choices.length, { message: "המקסימום גדול ממספר האפשרויות", path: ["max"] });

export async function saveOptionGroup(_: FormState, fd: FormData): Promise<FormState> {
  const { db } = await requireAdmin();
  const parsed = groupSchema.safeParse(formObject(fd));
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };
  const { id, ...row } = parsed.data;
  const { error } = id
    ? await db.from("option_groups").update({ ...row, updated_at: new Date().toISOString() }).eq("id", id)
    : await db.from("option_groups").insert({ ...row, id: `opt-${randomUUID().slice(0, 8)}` });
  if (error) return { error: `השמירה נכשלה: ${error.message}` };
  refreshSite();
  redirect("/admin/options?saved=1");
}

export async function deleteOptionGroup(fd: FormData): Promise<void> {
  const { db } = await requireAdmin();
  await db.from("option_groups").delete().eq("id", String(fd.get("id")));
  refreshSite();
  redirect("/admin/options");
}

export async function signOut() {
  const { db } = await requireAdmin();
  await db.auth.signOut();
  redirect("/admin/login");
}
