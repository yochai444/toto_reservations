import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "ניהול התפריט", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1000px] items-center gap-3 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/img/logo.png" alt="TOTO" width={900} height={540} className="h-9 w-auto" />
            <span className="font-display text-lg font-semibold text-berry">ניהול</span>
          </Link>
          <nav className="ms-2 flex gap-1 text-[15px] font-bold">
            <Link href="/admin" className="rounded-full px-3 py-1.5 hover:bg-blush">
              מנות
            </Link>
            <Link href="/admin/options" className="rounded-full px-3 py-1.5 whitespace-nowrap hover:bg-blush">
              מילויים וטעמים
            </Link>
          </nav>
          <div className="ms-auto flex items-center gap-2 text-sm">
            <a href="/" target="_blank" className="hidden rounded-full bg-blush px-3 py-1.5 font-bold text-pink-ink sm:inline">
              לאתר ↗
            </a>
            <Link href="/admin/account" className="rounded-full px-2 py-1.5 font-bold text-muted underline" title={user.email}>
              סיסמה
            </Link>
            <form action={signOut}>
              <button type="submit" className="rounded-full px-2 py-1.5 font-bold text-muted underline">
                יציאה
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1000px] px-4 pt-6 pb-24">{children}</main>
    </div>
  );
}
