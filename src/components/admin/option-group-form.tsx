"use client";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import { useActionState, useState } from "react";
import { deleteOptionGroup, saveOptionGroup } from "@/app/admin/actions";
import { Cancel, DangerRow, DeleteButton, FormActions, FormCard, FormError, Pair, Stack, SubmitButton } from "@/components/admin/ui";
import { InputField } from "@/components/ui/form";
import { boxAs, CloseButton } from "@/components/ui/primitives";
import type { Choice } from "@/lib/menu-types";
import type { OptionGroupRow } from "@/lib/menu-rows";
import { brand } from "@/theme/theme";

const Choices = styled(boxAs("fieldset"))({ display: "grid", gap: 10, "& legend": { marginBottom: 4, fontWeight: 800, color: brand.berry } });

const ChoiceRow = styled(Box)({ display: "grid", gridTemplateColumns: "1fr 110px auto", alignItems: "center", gap: 8 });

const AddChoice = styled(ButtonBase)({
  justifySelf: "start",
  borderRadius: 999,
  border: `2px solid ${brand.line}`,
  padding: "6px 16px",
  fontWeight: 700,
  color: brand.pinkInk,
});

export const OptionGroupForm = ({ group, usedBy }: { group: Partial<OptionGroupRow>; usedBy: string[] }) => {
  const [state, action] = useActionState(saveOptionGroup, undefined);
  const fe = state?.fieldErrors ?? {};
  const [choices, setChoices] = useState<Choice[]>(group.choices?.length ? group.choices : [{ name: "" }]);

  const update = (i: number, patch: Partial<Choice>) => setChoices((cs) => cs.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const cleaned = choices
    .filter((c) => c.name.trim())
    .map((c) => (c.extra ? { name: c.name.trim(), extra: c.extra } : { name: c.name.trim() }));

  return (
    <Stack>
      <FormCard action={action}>
        {group.id && <Box component="input" type="hidden" name="id" value={group.id} />}
        <Box component="input" type="hidden" name="choices" value={JSON.stringify(cleaned)} />

        <Pair>
          <InputField label="כותרת בחלון הבחירה" hint="לדוגמה: בחרו מילויים" error={fe.legend} name="legend" defaultValue={group.legend} />
          <InputField label="טקסט הכפתור בכרטיס המנה" hint="לדוגמה: בחירת מילויים" error={fe.cta} name="cta" defaultValue={group.cta} />
        </Pair>
        <Pair always>
          <InputField label="מינימום בחירות" error={fe.min} name="min" type="number" inputProps={{ min: 0 }} defaultValue={group.min ?? 1} />
          <InputField label="מקסימום בחירות" hint="למשל 2 מילויים למגש" error={fe.max} name="max" type="number" inputProps={{ min: 1 }} defaultValue={group.max ?? 2} />
        </Pair>

        <Choices>
          <Box component="legend">אפשרויות</Box>
          {choices.map((c, i) => (
            <ChoiceRow key={i}>
              <OutlinedInput value={c.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="שם האפשרות" inputProps={{ "aria-label": `אפשרות ${i + 1}` }} />
              <OutlinedInput
                type="number"
                value={c.extra ?? ""}
                onChange={(e) => update(i, { extra: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="תוספת ₪"
                inputProps={{ min: 0, "aria-label": `תוספת מחיר לאפשרות ${i + 1}` }}
              />
              <CloseButton tone="blush" type="button" onClick={() => setChoices((cs) => cs.filter((_, j) => j !== i))} aria-label={`הסרת אפשרות ${i + 1}`}>
                ✕
              </CloseButton>
            </ChoiceRow>
          ))}
          <AddChoice type="button" onClick={() => setChoices((cs) => [...cs, { name: "" }])}>
            + אפשרות
          </AddChoice>
          <FormHelperText>תוספת מחיר נספרת פעם אחת למגש, גם אם בחרו אותה יחד עם מילוי נוסף.</FormHelperText>
          {fe.choices && <FormHelperText error>{fe.choices}</FormHelperText>}
        </Choices>

        <FormError error={state?.error} />
        <FormActions>
          <SubmitButton>{group.id ? "שמירה" : "הוספה"}</SubmitButton>
          <Cancel href="/admin/options" />
        </FormActions>
      </FormCard>

      {group.id && (
        <DangerRow>
          {usedBy.length > 0 && <Box component="span">בשימוש ב: {usedBy.join(", ")}. מחיקה תבטל את הבחירה במנות האלה.</Box>}
          <DeleteButton action={deleteOptionGroup} id={group.id} label="מחיקה" />
        </DangerRow>
      )}
    </Stack>
  );
};
