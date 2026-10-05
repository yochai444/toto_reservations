"use client";

import Button from "@mui/material/Button";
import { useState } from "react";
import { FormCard } from "@/components/admin/ui";
import { InputField, Notice } from "@/components/ui/form";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function PasswordForm() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string }>();
  const [pending, setPending] = useState(false);

  return (
    <FormCard
      sx={{ maxWidth: 420, gap: 2 }}
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const password = String(fd.get("password"));
        if (password.length < 8) return setMsg({ ok: false, text: "הסיסמה צריכה להיות לפחות 8 תווים" });
        if (password !== fd.get("confirm")) return setMsg({ ok: false, text: "הסיסמאות לא זהות" });
        setPending(true);
        const { error } = await createBrowserSupabase().auth.updateUser({ password });
        setPending(false);
        if (error) return setMsg({ ok: false, text: `לא הצלחנו לעדכן: ${error.message}` });
        form.reset();
        setMsg({ ok: true, text: "הסיסמה עודכנה. מהכניסה הבאה משתמשים בסיסמה החדשה." });
      }}
    >
      <InputField label="סיסמה חדשה" name="password" type="password" autoComplete="new-password" inputProps={{ dir: "ltr" }} />
      <InputField label="שוב, לאימות" name="confirm" type="password" autoComplete="new-password" inputProps={{ dir: "ltr" }} />
      {msg && <Notice tone={msg.ok ? "ok" : "error"}>{msg.text}</Notice>}
      <Button type="submit" disabled={pending}>
        {pending ? "מעדכנים…" : "עדכון סיסמה"}
      </Button>
    </FormCard>
  );
}
