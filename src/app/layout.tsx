import type { Metadata, Viewport } from "next";
import { Assistant, Fredoka } from "next/font/google";
import { CartDrawer } from "@/components/cart-drawer";
import { FloatingUI } from "@/components/floating-ui";
import { ItemSheet } from "@/components/item-sheet";
import { SearchDialog } from "@/components/search-dialog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreProvider } from "@/components/store";
import { getMenu } from "@/lib/menu";
import "./globals.css";

const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["hebrew", "latin"], weight: ["500", "600", "700"] });
const assistant = Assistant({ variable: "--font-assistant", subsets: ["hebrew", "latin"], weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: "טוטו קייטרינג · מגשי אירוח חלביים", template: "%s · טוטו קייטרינג" },
  description: "מגשי אירוח, סלטים, מאפים וקינוחים חלביים לכל אירוע. כשר למהדרין. מזמינים באתר ונחזור אליכם בווצאפ. עכו וכל אזור הצפון.",
};

export const viewport: Viewport = { themeColor: "#e4519a", viewportFit: "cover" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const menu = await getMenu();
  return (
    <html lang="he" dir="rtl" className={`${fredoka.variable} ${assistant.variable} antialiased`}>
      <body>
        <StoreProvider menu={menu}>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter categories={menu.categories} />
          <FloatingUI />
          <ItemSheet />
          <CartDrawer />
          <SearchDialog />
        </StoreProvider>
      </body>
    </html>
  );
}
