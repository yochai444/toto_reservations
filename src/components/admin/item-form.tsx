"use client";

import Link from "next/link";
import { useActionState } from "react";
import { deleteItem, saveItem } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/image-field";
import { inputClass } from "@/components/admin/styles";
import { DeleteButton, Field, FormError, SubmitButton } from "@/components/admin/ui";
import type { CategoryRow, ItemRow, OptionGroupRow } from "@/lib/menu-rows";

type Props = { item: Partial<ItemRow>; categories: CategoryRow[]; optionGroups: OptionGroupRow[] };

export function ItemForm({ item, categories, optionGroups }: Props) {
  const [state, action] = useActionState(saveItem, undefined);
  const fe = state?.fieldErrors ?? {};
  const isNew = !item.id;

  return (
    <div className="grid gap-4">
      <form action={action} className="grid gap-5 rounded-[22px] bg-white p-5 shadow-card sm:p-6">
        {item.id && <input type="hidden" name="id" value={item.id} />}

        <ImageField name="image" defaultValue={item.image ?? ""} folder="items" error={fe.image} />

        <Field label="שם המנה" error={fe.name}>
          <input name="name" defaultValue={item.name} className={inputClass} aria-invalid={!!fe.name || undefined} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="מחיר למגש (₪)" error={fe.price}>
            <input name="price" type="number" inputMode="numeric" min={0} step={1} defaultValue={item.price} className={inputClass} aria-invalid={!!fe.price || undefined} />
          </Field>
          <Field label="כמות במגש" hint="לדוגמה: 20 יח', 2.5 ליטר. אפשר להשאיר ריק" error={fe.unit}>
            <input name="unit" defaultValue={item.unit ?? ""} className={inputClass} />
          </Field>
        </div>

        <Field label="תיאור קצר" hint="לא חובה. מופיע מתחת לשם המנה" error={fe.description}>
          <textarea name="description" rows={2} defaultValue={item.description ?? ""} className={inputClass} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="קטגוריה" error={fe.category_id}>
            <select name="category_id" defaultValue={item.category_id} className={inputClass}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="בחירת מילויים / טעמים" hint="הלקוח יבחר מהרשימה לפני ההוספה לסל" error={fe.option_group_id}>
            <select name="option_group_id" defaultValue={item.option_group_id ?? ""} className={inputClass}>
              <option value="">בלי בחירה</option>
              {optionGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.legend}: {g.choices.map((c) => c.name).join(", ")}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="תגית על התמונה" hint="לדוגמה: מומלץ, חדש. אפשר להשאיר ריק" error={fe.badge}>
            <input name="badge" defaultValue={item.badge ?? ""} className={inputClass} />
          </Field>
          <div className="grid content-end gap-3 pb-1">
            <label className="flex items-center gap-2.5 font-bold">
              <input type="checkbox" name="available" defaultChecked={item.available ?? true} className="size-5 accent-pink-btn" />
              מוצג באתר
            </label>
            <label className="flex items-center gap-2.5 font-bold">
              <input type="checkbox" name="featured" defaultChecked={item.featured ?? false} className="size-5 accent-pink-btn" />
              ב&quot;הכי מוזמנים&quot; בעמוד הבית
            </label>
          </div>
        </div>

        <FormError error={state?.error ?? (Object.keys(fe).length ? "יש שדות שצריך לתקן" : undefined)} />

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton>{isNew ? "הוספת המנה" : "שמירה"}</SubmitButton>
          <Link href={`/admin#cat-${item.category_id ?? ""}`} className="font-bold text-muted underline">
            ביטול
          </Link>
        </div>
      </form>

      {!isNew && (
        <div className="flex justify-end">
          <DeleteButton action={deleteItem} id={item.id!} label="מחיקת המנה" />
        </div>
      )}
    </div>
  );
}
