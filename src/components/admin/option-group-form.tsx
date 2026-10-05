"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { deleteOptionGroup, saveOptionGroup } from "@/app/admin/actions";
import { inputClass } from "@/components/admin/styles";
import { DeleteButton, Field, FormError, SubmitButton } from "@/components/admin/ui";
import type { Choice } from "@/lib/menu-types";
import type { OptionGroupRow } from "@/lib/menu-rows";

export function OptionGroupForm({ group, usedBy }: { group: Partial<OptionGroupRow>; usedBy: string[] }) {
  const [state, action] = useActionState(saveOptionGroup, undefined);
  const fe = state?.fieldErrors ?? {};
  const [choices, setChoices] = useState<Choice[]>(group.choices?.length ? group.choices : [{ name: "" }]);

  const update = (i: number, patch: Partial<Choice>) => setChoices((cs) => cs.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const cleaned = choices
    .filter((c) => c.name.trim())
    .map((c) => (c.extra ? { name: c.name.trim(), extra: c.extra } : { name: c.name.trim() }));

  return (
    <div className="grid gap-4">
      <form action={action} className="grid gap-5 rounded-[22px] bg-white p-5 shadow-card sm:p-6">
        {group.id && <input type="hidden" name="id" value={group.id} />}
        <input type="hidden" name="choices" value={JSON.stringify(cleaned)} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="כותרת בחלון הבחירה" hint="לדוגמה: בחרו מילויים" error={fe.legend}>
            <input name="legend" defaultValue={group.legend} className={inputClass} />
          </Field>
          <Field label="טקסט הכפתור בכרטיס המנה" hint="לדוגמה: בחירת מילויים" error={fe.cta}>
            <input name="cta" defaultValue={group.cta} className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Field label="מינימום בחירות" error={fe.min}>
            <input name="min" type="number" min={0} defaultValue={group.min ?? 1} className={inputClass} />
          </Field>
          <Field label="מקסימום בחירות" hint="למשל 2 מילויים למגש" error={fe.max}>
            <input name="max" type="number" min={1} defaultValue={group.max ?? 2} className={inputClass} />
          </Field>
        </div>

        <fieldset className="grid gap-2.5">
          <legend className="mb-1 font-extrabold text-berry">אפשרויות</legend>
          {choices.map((c, i) => (
            <div key={i} className="grid grid-cols-[1fr_110px_auto] items-center gap-2">
              <input value={c.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="שם האפשרות" aria-label={`אפשרות ${i + 1}`} className={inputClass} />
              <input
                type="number"
                min={0}
                value={c.extra ?? ""}
                onChange={(e) => update(i, { extra: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="תוספת ₪"
                aria-label={`תוספת מחיר לאפשרות ${i + 1}`}
                className={inputClass}
              />
              <button type="button" onClick={() => setChoices((cs) => cs.filter((_, j) => j !== i))} aria-label={`הסרת אפשרות ${i + 1}`} className="grid size-9 place-items-center rounded-full bg-blush text-berry">
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setChoices((cs) => [...cs, { name: "" }])} className="justify-self-start rounded-full border-2 border-line px-4 py-1.5 font-bold text-pink-ink">
            + אפשרות
          </button>
          <span className="text-sm text-muted">תוספת מחיר נספרת פעם אחת למגש, גם אם בחרו אותה יחד עם מילוי נוסף.</span>
          {fe.choices && <span className="text-sm font-bold text-[#B03224]">{fe.choices}</span>}
        </fieldset>

        <FormError error={state?.error} />
        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton>{group.id ? "שמירה" : "הוספה"}</SubmitButton>
          <Link href="/admin/options" className="font-bold text-muted underline">
            ביטול
          </Link>
        </div>
      </form>

      {group.id && (
        <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-muted">
          {usedBy.length > 0 && <span>בשימוש ב: {usedBy.join(", ")}. מחיקה תבטל את הבחירה במנות האלה.</span>}
          <DeleteButton action={deleteOptionGroup} id={group.id} label="מחיקה" />
        </div>
      )}
    </div>
  );
}
