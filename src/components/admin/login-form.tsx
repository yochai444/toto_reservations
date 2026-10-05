"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { inputClass } from "@/components/admin/styles";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(undefined);
        const fd = new FormData(e.currentTarget);
        const { error } = await createBrowserSupabase().auth.signInWithPassword({
          email: String(fd.get("email")).trim(),
          password: String(fd.get("password")),
        });
        if (error) {
          setError(error.message.includes("Invalid") ? "אימייל או סיסמה שגויים" : error.message);
          setPending(false);
          return;
        }
        router.replace("/admin");
        router.refresh();
      }}
    >
      <label className="grid gap-1.5">
        <span className="font-extrabold text-berry">אימייל</span>
        <input name="email" type="email" required autoComplete="username" dir="ltr" className={inputClass} />
      </label>
      <label className="grid gap-1.5">
        <span className="font-extrabold text-berry">סיסמה</span>
        <input name="password" type="password" required autoComplete="current-password" dir="ltr" className={inputClass} />
      </label>
      {error && (
        <p role="alert" className="font-bold text-[#B03224]">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-pink" disabled={pending}>
        {pending ? "נכנסים…" : "כניסה"}
      </button>
    </form>
  );
}
