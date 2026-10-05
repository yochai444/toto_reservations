"use client";

import { useActionState } from "react";
import { deleteItem, saveItem } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/image-field";
import { Cancel, CheckField, DangerRow, DeleteButton, FormActions, FormCard, FormError, Pair, Stack, SubmitButton } from "@/components/admin/ui";
import { InputField, SelectField } from "@/components/ui/form";
import type { CategoryRow, ItemRow, OptionGroupRow } from "@/lib/menu-rows";

type Props = { item: Partial<ItemRow>; categories: CategoryRow[]; optionGroups: OptionGroupRow[] };

export function ItemForm({ item, categories, optionGroups }: Props) {
  const [state, action] = useActionState(saveItem, undefined);
  const fe = state?.fieldErrors ?? {};
  const isNew = !item.id;

  return (
    <Stack>
      <FormCard action={action}>
        {item.id && <input type="hidden" name="id" value={item.id} />}

        <ImageField name="image" defaultValue={item.image ?? ""} folder="items" error={fe.image} />

        <InputField label="שם המנה" error={fe.name} name="name" defaultValue={item.name} />

        <Pair>
          <InputField
            label="מחיר למגש (₪)"
            error={fe.price}
            name="price"
            type="number"
            defaultValue={item.price}
            inputProps={{ inputMode: "numeric", min: 0, step: 1 }}
          />
          <InputField label="כמות במגש" hint="לדוגמה: 20 יח', 2.5 ליטר. אפשר להשאיר ריק" error={fe.unit} name="unit" defaultValue={item.unit ?? ""} />
        </Pair>

        <InputField label="תיאור קצר" hint="לא חובה. מופיע מתחת לשם המנה" error={fe.description} name="description" multiline minRows={2} defaultValue={item.description ?? ""} />

        <Pair>
          <SelectField label="קטגוריה" error={fe.category_id} name="category_id" defaultValue={item.category_id}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="בחירת מילויים / טעמים"
            hint="הלקוח יבחר מהרשימה לפני ההוספה לסל"
            error={fe.option_group_id}
            name="option_group_id"
            defaultValue={item.option_group_id ?? ""}
          >
            <option value="">בלי בחירה</option>
            {optionGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.legend}: {g.choices.map((c) => c.name).join(", ")}
              </option>
            ))}
          </SelectField>
        </Pair>

        <Pair>
          <InputField label="תגית על התמונה" hint="לדוגמה: מומלץ, חדש. אפשר להשאיר ריק" error={fe.badge} name="badge" defaultValue={item.badge ?? ""} />
          <div style={{ display: "grid", alignContent: "end", gap: 4, paddingBottom: 4 }}>
            <CheckField name="available" defaultChecked={item.available ?? true} label="מוצג באתר" />
            <CheckField name="featured" defaultChecked={item.featured ?? false} label='ב"הכי מוזמנים" בעמוד הבית' />
          </div>
        </Pair>

        <FormError error={state?.error ?? (Object.keys(fe).length ? "יש שדות שצריך לתקן" : undefined)} />

        <FormActions>
          <SubmitButton>{isNew ? "הוספת המנה" : "שמירה"}</SubmitButton>
          <Cancel href={`/admin#cat-${item.category_id ?? ""}`} />
        </FormActions>
      </FormCard>

      {!isNew && (
        <DangerRow>
          <DeleteButton action={deleteItem} id={item.id!} label="מחיקת המנה" />
        </DangerRow>
      )}
    </Stack>
  );
}
