"use client";

import Link from "next/link";
import { useActionState } from "react";
import { deleteCategory, saveCategory } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/image-field";
import { inputClass } from "@/components/admin/styles";
import { DeleteButton, Field, FormError, SubmitButton } from "@/components/admin/ui";
import type { CategoryRow } from "@/lib/menu-rows";

export function CategoryForm({ category, itemCount }: { category: Partial<CategoryRow>; itemCount: number }) {
  const [state, action] = useActionState(saveCategory, undefined);
  const fe = state?.fieldErrors ?? {};

  return (
    <div className="grid gap-4">
      <form action={action} className="grid gap-5 rounded-[22px] bg-white p-5 shadow-card sm:p-6">
        {category.id && <input type="hidden" name="id" value={category.id} />}
        <Field label="שם הקטגוריה" error={fe.name}>
          <input name="name" defaultValue={category.name} className={inputClass} aria-invalid={!!fe.name || undefined} />
        </Field>
        <Field label="הערה ליד הכותרת" hint="לדוגמה: לפי 10 סועדים" error={fe.note}>
          <input name="note" defaultValue={category.note ?? ""} className={inputClass} />
        </Field>
        <ImageField name="image" defaultValue={category.image ?? ""} folder="categories" error={fe.image} />
        <label className="flex items-center gap-2.5 font-bold">
          <input type="checkbox" name="visible" defaultChecked={category.visible ?? true} className="size-5 accent-pink-btn" />
          מוצגת באתר
        </label>
        <FormError error={state?.error} />
        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton>{category.id ? "שמירה" : "הוספת הקטגוריה"}</SubmitButton>
          <Link href="/admin" className="font-bold text-muted underline">
            ביטול
          </Link>
        </div>
      </form>
      {category.id &&
        (itemCount === 0 ? (
          <div className="flex justify-end">
            <DeleteButton action={deleteCategory} id={category.id} label="מחיקת הקטגוריה" />
          </div>
        ) : (
          <p className="text-end text-sm text-muted">כדי למחוק קטגוריה צריך קודם להעביר או למחוק את {itemCount} המנות שבה.</p>
        ))}
    </div>
  );
}
