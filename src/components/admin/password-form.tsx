"use client";

import { useState } from "react";
import { inputClass } from "@/components/admin/styles";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function PasswordForm() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string }>();
  const [pending, setPending] = useState(false);

  return (
    <form
      className="grid max-w-[420px] gap-4 rounded-[22px] bg-white p-5 shadow-card sm:p-6"
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
      <label className="grid gap-1.5">
        <span className="font-extrabold text-berry">סיסמה חדשה</span>
        <input name="password" type="password" autoComplete="new-password" dir="ltr" className={inputClass} />
      </label>
      <label className="grid gap-1.5">
        <span className="font-extrabold text-berry">שוב, לאימות</span>
        <input name="confirm" type="password" autoComplete="new-password" dir="ltr" className={inputClass} />
      </label>
      {msg && <p className={`font-bold ${msg.ok ? "text-[#17643A]" : "text-[#B03224]"}`}>{msg.text}</p>}
      <button type="submit" className="btn btn-pink" disabled={pending}>
        {pending ? "מעדכנים…" : "עדכון סיסמה"}
      </button>
    </form>
  );
}
