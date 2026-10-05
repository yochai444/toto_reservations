"use client";

import { styled } from "@mui/material/styles";
import Link from "next/link";
import { SocialLinks } from "@/components/social-links";
import { patternWhite, Wrap } from "@/components/ui/primitives";
import type { Category } from "@/lib/menu-types";
import { SITE } from "@/lib/site";
import { brand } from "@/theme/theme";

const Root = styled("footer")({ ...patternWhite, background: brand.berry, color: "#f8d7e7", "& .socials": { marginTop: 14 } });

const Cols = styled(Wrap)(({ theme }) => ({
  display: "grid",
  gap: 24,
  paddingBlock: 44,
  [theme.breakpoints.up(860)]: { gridTemplateColumns: "1.2fr 1fr 1fr", alignItems: "start" },
}));

const Logo = styled("div")({ width: 150, aspectRatio: "900 / 540", background: "#fff", mask: "url(/img/logo.png) no-repeat center / contain" });

const Title = styled("h4")(({ theme }) => ({ marginBottom: 8, fontFamily: theme.toto.fonts.display, fontSize: 18, fontWeight: 600, color: "#fff" }));

const List = styled("ul")({ display: "grid", gap: 6, "& a:hover": { textDecoration: "underline" } });

const Copy = styled("p")(({ theme }) => ({
  borderTop: "1px solid rgb(255 255 255 / 0.15)",
  paddingTop: 16,
  fontSize: 13.5,
  opacity: 0.85,
  [theme.breakpoints.up(860)]: { gridColumn: "span 3" },
}));

export function SiteFooter({ categories }: { categories: Category[] }) {
  return (
    <Root>
      <Cols>
        <div>
          <Logo role="img" aria-label="TOTO" />
          <p style={{ marginTop: 10 }}>קייטרינג חלבי לאירועים · כשר למהדרין</p>
          <SocialLinks tone="dark" className="socials" />
        </div>
        <div>
          <Title>התפריט</Title>
          <List>
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/menu#cat-${c.id}`}>{c.name}</Link>
              </li>
            ))}
          </List>
        </div>
        <div>
          <Title>יצירת קשר</Title>
          <List>
            <li>{SITE.address}</li>
            <li dir="ltr" style={{ textAlign: "end", fontVariantNumeric: "tabular-nums" }}>
              {SITE.phoneDisplay}
            </li>
            <li>{SITE.serviceArea}</li>
          </List>
        </div>
        <Copy>© טוטו קייטרינג {new Date().getFullYear()}</Copy>
      </Cols>
    </Root>
  );
}
