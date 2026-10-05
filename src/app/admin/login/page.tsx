import type { Metadata } from "next";
import { LoginCard, LoginLogo, LoginPage as Page } from "@/components/admin/admin-styles";
import { LoginForm } from "@/components/admin/login-form";
import { Notice } from "@/components/ui/form";
import { supabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "כניסה לניהול", robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { denied } = await searchParams;
  return (
    <Page>
      <LoginCard>
        <LoginLogo src="/img/logo.png" alt="TOTO" width={900} height={540} />
        <h1>ניהול התפריט</h1>
        <p className="sub">כניסה לבעלי העסק</p>
        {!supabaseConfigured ? (
          <Notice tone="info" sx={{ p: 2 }}>
            מסד הנתונים עדיין לא מחובר. יש למלא את פרטי Supabase בקובץ ‎.env.local.
          </Notice>
        ) : (
          <>
            {denied && <Notice sx={{ mb: 2 }}>למשתמש הזה אין הרשאת ניהול.</Notice>}
            <LoginForm />
          </>
        )}
      </LoginCard>
    </Page>
  );
}
