import type { Metadata, Viewport } from "next";
import { Assistant, Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["hebrew", "latin"], weight: ["500", "600", "700"] });
const assistant = Assistant({ variable: "--font-assistant", subsets: ["hebrew", "latin"], weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: "טוטו קייטרינג · מגשי אירוח חלביים", template: "%s · טוטו קייטרינג" },
  description: "מגשי אירוח, סלטים, מאפים וקינוחים חלביים לכל אירוע. כשר למהדרין. מזמינים באתר ונחזור אליכם בווצאפ. עכו וכל אזור הצפון.",
  // Hidden from search engines until launch (real photos + WhatsApp bot). Set SITE_INDEXING=on to open it.
  robots: process.env.SITE_INDEXING === "on" ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#e4519a", viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" data-scroll-behavior="smooth" className={`${fredoka.variable} ${assistant.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
