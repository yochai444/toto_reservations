"use client";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import { SocialLinks } from "@/components/social-links";
import { boxAs, patternWhite, Wrap } from "@/components/ui/primitives";
import type { Category } from "@/lib/menu-types";
import { SITE } from "@/lib/site";
import { brand } from "@/theme/theme";

const Root = styled(boxAs("footer"))({ ...patternWhite, background: brand.berry, color: "#f8d7e7", "& .socials": { marginTop: 14 } });

const Cols = styled(Wrap)(({ theme }) => ({
  display: "grid",
  gap: 24,
  paddingBlock: 44,
  [theme.breakpoints.up(860)]: { gridTemplateColumns: "1.2fr 1fr 1fr", alignItems: "start" },
}));

const Logo = styled(Box)({ width: 150, aspectRatio: "900 / 540", background: "#fff", mask: "url(/img/logo.png) no-repeat center / contain" });

const Title = styled(boxAs("h2"))(({ theme }) => ({ marginBottom: 8, fontFamily: theme.toto.fonts.display, fontSize: 18, fontWeight: 600, color: "#fff" }));

const List = styled(boxAs("ul"))({ display: "grid", gap: 6, "& a:hover": { textDecoration: "underline" } });

const Copy = styled(boxAs("p"))(({ theme }) => ({
  borderTop: "1px solid rgb(255 255 255 / 0.15)",
  paddingTop: 16,
  fontSize: 13.5,
  opacity: 0.85,
  [theme.breakpoints.up(860)]: { gridColumn: "span 3" },
}));

export const SiteFooter = ({ categories }: { categories: Category[] }) => (
  <Root>
    <Cols>
      <Box>
        <Logo role="img" aria-label="TOTO" />
        <Box component="p" style={{ marginTop: 10 }}>קייטרינג חלבי לאירועים · כשר למהדרין</Box>
        <SocialLinks tone="dark" className="socials" />
      </Box>
      <Box>
        <Title>התפריט</Title>
        <List>
          {categories.map((c) => (
            <Box component="li" key={c.id}>
              <Link href={`/menu#cat-${c.id}`}>{c.name}</Link>
            </Box>
          ))}
        </List>
      </Box>
      <Box>
        <Title>יצירת קשר</Title>
        <List>
          <Box component="li">{SITE.address}</Box>
          <Box component="li" dir="ltr" style={{ textAlign: "end", fontVariantNumeric: "tabular-nums" }}>
            {SITE.phoneDisplay}
          </Box>
          <Box component="li">{SITE.serviceArea}</Box>
        </List>
      </Box>
      <Copy>
        © טוטו קייטרינג {new Date().getFullYear()} ·{" "}
        <Link href="/accessibility" style={{ textDecoration: "underline" }}>
          הצהרת נגישות
        </Link>
      </Copy>
    </Cols>
  </Root>
);
