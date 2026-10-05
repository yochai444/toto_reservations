import type { Metadata } from "next";
import Image from "next/image";
import { signOut } from "@/app/admin/actions";
import { Brand, Main, QuietButton, QuietLink, Shell, SiteLink, TopBar, TopBarIn, TopEnd, TopNav, TopNavLink } from "@/components/admin/admin-styles";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "ניהול התפריט", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return (
    <Shell>
      <TopBar>
        <TopBarIn>
          <Brand href="/admin">
            <Image src="/img/logo.png" alt="TOTO" width={900} height={540} />
            <span>ניהול</span>
          </Brand>
          <TopNav>
            <TopNavLink href="/admin">מנות</TopNavLink>
            <TopNavLink href="/admin/options">מילויים וטעמים</TopNavLink>
          </TopNav>
          <TopEnd>
            <SiteLink href="/" target="_blank">
              לאתר ↗
            </SiteLink>
            <QuietLink href="/admin/account" title={user.email}>
              סיסמה
            </QuietLink>
            <form action={signOut}>
              <QuietButton type="submit">יציאה</QuietButton>
            </form>
          </TopEnd>
        </TopBarIn>
      </TopBar>
      <Main>{children}</Main>
    </Shell>
  );
}
