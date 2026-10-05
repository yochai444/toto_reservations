"use client";

import { useActionState } from "react";
import { deleteCategory, saveCategory } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/image-field";
import { Cancel, CheckField, DangerRow, DeleteButton, FormActions, FormCard, FormError, Stack, SubmitButton } from "@/components/admin/ui";
import { InputField } from "@/components/ui/form";
import { Muted } from "@/components/ui/primitives";
import type { CategoryRow } from "@/lib/menu-rows";

export function CategoryForm({ category, itemCount }: { category: Partial<CategoryRow>; itemCount: number }) {
  const [state, action] = useActionState(saveCategory, undefined);
  const fe = state?.fieldErrors ?? {};

  return (
    <Stack>
      <FormCard action={action}>
        {category.id && <input type="hidden" name="id" value={category.id} />}
        <InputField label="שם הקטגוריה" error={fe.name} name="name" defaultValue={category.name} />
        <InputField label="הערה ליד הכותרת" hint="לדוגמה: לפי 10 סועדים" error={fe.note} name="note" defaultValue={category.note ?? ""} />
        <ImageField name="image" defaultValue={category.image ?? ""} folder="categories" error={fe.image} />
        <CheckField name="visible" defaultChecked={category.visible ?? true} label="מוצגת באתר" />
        <FormError error={state?.error} />
        <FormActions>
          <SubmitButton>{category.id ? "שמירה" : "הוספת הקטגוריה"}</SubmitButton>
          <Cancel href="/admin" />
        </FormActions>
      </FormCard>
      {category.id &&
        (itemCount === 0 ? (
          <DangerRow>
            <DeleteButton action={deleteCategory} id={category.id} label="מחיקת הקטגוריה" />
          </DangerRow>
        ) : (
          <Muted sx={{ textAlign: "end", fontSize: 14 }}>כדי למחוק קטגוריה צריך קודם להעביר או למחוק את {itemCount} המנות שבה.</Muted>
        ))}
    </Stack>
  );
}
