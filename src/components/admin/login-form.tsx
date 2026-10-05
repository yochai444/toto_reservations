"use client";

import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { StackForm } from "@/components/admin/ui";
import { InputField, Notice } from "@/components/ui/form";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  return (
    <StackForm
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
      <InputField label="אימייל" name="email" type="email" required autoComplete="username" inputProps={{ dir: "ltr" }} />
      <InputField label="סיסמה" name="password" type="password" required autoComplete="current-password" inputProps={{ dir: "ltr" }} />
      {error && <Notice role="alert">{error}</Notice>}
      <Button type="submit" disabled={pending}>
        {pending ? "נכנסים…" : "כניסה"}
      </Button>
    </StackForm>
  );
}
