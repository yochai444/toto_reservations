import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";
import { supabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "כניסה לניהול", robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { denied } = await searchParams;
  return (
    <main className="grid min-h-svh place-items-center bg-pink px-4 py-10">
      <div className="w-full max-w-[400px] rounded-[26px] bg-white p-7 shadow-pop">
        <Image src="/img/logo.png" alt="TOTO" width={900} height={540} className="mx-auto mb-2 h-14 w-auto" />
        <h1 className="mb-1 text-center text-2xl">ניהול התפריט</h1>
        <p className="mb-6 text-center text-muted">כניסה לבעלי העסק</p>
        {!supabaseConfigured ? (
          <p className="rounded-xl bg-blush p-4 text-berry">מסד הנתונים עדיין לא מחובר. יש למלא את פרטי Supabase בקובץ ‎.env.local.</p>
        ) : (
          <>
            {denied && <p className="mb-4 rounded-xl bg-[#FFF1F0] p-3 font-bold text-[#B03224]">למשתמש הזה אין הרשאת ניהול.</p>}
            <LoginForm />
          </>
        )}
      </div>
    </main>
  );
}
