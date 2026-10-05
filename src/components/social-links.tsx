"use client";

import { FacebookIcon, InstagramIcon, TiktokIcon } from "@/components/icons";
import { useStore } from "@/components/store";
import { SITE } from "@/lib/site";

const NETWORKS = [
  { key: "instagram", label: "אינסטגרם", Icon: InstagramIcon },
  { key: "facebook", label: "פייסבוק", Icon: FacebookIcon },
  { key: "tiktok", label: "טיקטוק", Icon: TiktokIcon },
] as const;

export function SocialLinks({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const { showToast } = useStore();
  const base =
    tone === "light"
      ? "bg-blush text-pink-ink hover:bg-pink-btn hover:text-white"
      : "bg-white/12 text-white hover:bg-pink";
  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-label="טוטו ברשתות">
      {NETWORKS.map(({ key, label, Icon }) => {
        const href = SITE.social[key];
        return (
          <a
            key={key}
            href={href || "#"}
            target={href ? "_blank" : undefined}
            rel={href ? "noopener" : undefined}
            aria-label={`טוטו ב${label}`}
            onClick={(e) => {
              if (!href) {
                e.preventDefault();
                showToast(`הקישור ל${label} יתעדכן בקרוב`);
              }
            }}
            className={`grid size-[30px] place-items-center rounded-full sm:size-9 ${base}`}
          >
            <Icon className="size-4 sm:size-[19px]" />
          </a>
        );
      })}
    </div>
  );
}
