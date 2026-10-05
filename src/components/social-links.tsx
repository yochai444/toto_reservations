"use client";

import { styled } from "@mui/material/styles";
import { FacebookIcon, InstagramIcon, TiktokIcon } from "@/components/icons";
import { useStore } from "@/components/store";
import { SITE } from "@/lib/site";
import { brand } from "@/theme/theme";

const NETWORKS = [
  { key: "instagram", label: "אינסטגרם", Icon: InstagramIcon },
  { key: "facebook", label: "פייסבוק", Icon: FacebookIcon },
  { key: "tiktok", label: "טיקטוק", Icon: TiktokIcon },
] as const;

const Row = styled("div")({ display: "flex", alignItems: "center", gap: 6 });

const Net = styled("a", { shouldForwardProp: (p) => p !== "tone" })<{ tone: "light" | "dark" }>(({ theme, tone }) => ({
  display: "grid",
  width: 30,
  height: 30,
  placeItems: "center",
  borderRadius: "50%",
  "& svg": { width: 16, height: 16 },
  [theme.breakpoints.up("sm")]: { width: 36, height: 36, "& svg": { width: 19, height: 19 } },
  ...(tone === "light"
    ? { background: brand.blush, color: brand.pinkInk, "&:hover": { background: brand.pinkBtn, color: "#fff" } }
    : { background: "rgb(255 255 255 / 0.12)", color: "#fff", "&:hover": { background: brand.pink } }),
}));

export function SocialLinks({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const { showToast } = useStore();
  return (
    <Row className={className} aria-label="טוטו ברשתות">
      {NETWORKS.map(({ key, label, Icon }) => {
        const href = SITE.social[key];
        return (
          <Net
            key={key}
            tone={tone}
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
          >
            <Icon />
          </Net>
        );
      })}
    </Row>
  );
}
