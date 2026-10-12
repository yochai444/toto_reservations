import type { Metadata, Viewport } from "next";
import { Assistant, Fredoka } from "next/font/google";
import { a11yInitScript } from "@/lib/a11y";
import { ThemeRegistry } from "@/theme/registry";

const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["hebrew", "latin"], weight: ["500", "600", "700"] });
const assistant = Assistant({ variable: "--font-assistant", subsets: ["hebrew", "latin"], weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: "טוטו קייטרינג · מגשי אירוח חלביים", template: "%s · טוטו קייטרינג" },
  description: "מגשי אירוח, סלטים, מאפים וקינוחים חלביים לכל אירוע. כשר למהדרין. מזמינים באתר ונחזור אליכם בוואטסאפ. עכו וכל אזור הצפון.",
  robots: process.env.SITE_INDEXING === "on" ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#e4519a", viewportFit: "cover" };

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="he" dir="rtl" data-scroll-behavior="smooth" className={`${fredoka.variable} ${assistant.variable}`} suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: a11yInitScript }} />
    </head>
    <body>
      <ThemeRegistry>{children}</ThemeRegistry>
    </body>
  </html>
);

export default RootLayout;
