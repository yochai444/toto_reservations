"use client";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Drawer from "@mui/material/Drawer";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import { useLayoutEffect, useState } from "react";
import { AccessibilityIcon } from "@/components/icons";
import { boxAs, CloseButton } from "@/components/ui/primitives";
import { type A11yPref, type A11yPrefs, applyA11y, loadA11y, saveA11y } from "@/lib/a11y";
import { TEXT_ZOOM } from "@/theme/a11y-styles";
import { brand } from "@/theme/theme";

const Fab = styled(ButtonBase, { shouldForwardProp: (p) => p !== "raised" })<{ raised: boolean }>(({ theme, raised }) => ({
  position: "fixed",
  insetInlineStart: 16,
  zIndex: 44,
  display: "grid",
  width: 54,
  height: 54,
  placeItems: "center",
  borderRadius: "50%",
  background: brand.berry,
  color: "#fff",
  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  bottom: raised ? "calc(86px + env(safe-area-inset-bottom, 0px))" : "calc(16px + env(safe-area-inset-bottom, 0px))",
  [theme.breakpoints.up("md")]: { bottom: 16 },
}));

const Panel = styled(Drawer)({
  "& .MuiDrawer-paper": { display: "flex", flexDirection: "column", width: "min(380px, 100%)", background: brand.cream },
});

const Head = styled(Box)({
  "--focus-ring": "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: brand.berry,
  padding: "calc(16px + env(safe-area-inset-top, 0px)) 20px 14px",
  color: "#fff",
  "& h2": { fontSize: 24, color: "#fff" },
});

const Body = styled(Box)({ display: "grid", flex: 1, alignContent: "start", gap: 22, overflow: "auto", padding: "18px 20px" });

const GroupTitle = styled(boxAs("h3"))({ marginBottom: 10, fontSize: 18 });

const Segments = styled(Box)({ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 });

const Segment = styled(ButtonBase)({
  borderRadius: 12,
  border: `2px solid ${brand.line}`,
  background: "#fff",
  padding: "10px 4px",
  fontWeight: 800,
  color: brand.berry,
  fontVariantNumeric: "tabular-nums",
  '&[aria-pressed="true"]': { borderColor: brand.berry, background: brand.berry, color: "#fff" },
});

const TOGGLES: { key: A11yPref; label: string; mouseOnly?: boolean }[] = [
  { key: "contrast", label: "ניגודיות גבוהה" },
  { key: "grayscale", label: "גווני אפור" },
  { key: "spacing", label: "ריווח שורות ואותיות" },
  { key: "links", label: "הדגשת קישורים" },
  { key: "font", label: "גופן קריא" },
  { key: "motion", label: "עצירת אנימציות" },
  { key: "cursor", label: "סמן עכבר גדול", mouseOnly: true },
];

const Toggles = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 8,
  "@media (hover: none)": { "& [data-mouse-only]": { display: "none" } },
});

const Toggle = styled(Segment)({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "12px",
  textAlign: "start",
  lineHeight: 1.25,
  '&[aria-checked="true"]': { borderColor: brand.berry, background: brand.berry, color: "#fff" },
});

const Check = styled(boxAs("span"))({
  display: "grid",
  flexShrink: 0,
  width: 20,
  height: 20,
  placeItems: "center",
  borderRadius: 6,
  border: "2px solid currentColor",
  fontSize: 13,
});

const Foot = styled(Box)({
  display: "grid",
  justifyItems: "center",
  gap: 10,
  borderTop: `1px solid ${brand.line}`,
  background: "#fff",
  padding: "14px 20px calc(16px + env(safe-area-inset-bottom, 0px))",
});

const Reset = styled(ButtonBase)({
  width: "100%",
  borderRadius: 999,
  border: `2px solid ${brand.berry}`,
  padding: "10px 16px",
  fontWeight: 800,
  color: brand.berry,
});

const StatementLink = styled(Link)({ fontSize: 15, fontWeight: 700, color: brand.berry, textDecoration: "underline" });

export const A11yMenu = ({ raised }: { raised: boolean }) => {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<A11yPrefs>(() => (typeof window === "undefined" ? {} : loadA11y()));

  // Keeps <html> in sync. In dev, Strict Mode's remount strips the attributes the head script set; this restores them.
  useLayoutEffect(() => applyA11y(prefs), [prefs]);

  const update = (next: A11yPrefs) => {
    setPrefs(next);
    saveA11y(next);
  };
  const set = (k: A11yPref, v: number) => update({ ...prefs, [k]: v });

  return (
    <>
      <Fab type="button" raised={raised} onClick={() => setOpen(true)} aria-label="תפריט נגישות" aria-haspopup="dialog" aria-expanded={open}>
        <AccessibilityIcon style={{ width: 30, height: 30 }} />
      </Fab>
      <Panel
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { role: "dialog", "aria-modal": true, "aria-labelledby": "a11y-title" }, backdrop: { invisible: true } }}
      >
        <Head>
          <Box component="h2" id="a11y-title">נגישות</Box>
          <CloseButton type="button" onClick={() => setOpen(false)} aria-label="סגירה">
            ✕
          </CloseButton>
        </Head>

        <Body>
          <Box component="section">
            <GroupTitle id="a11y-text">גודל טקסט</GroupTitle>
            <Segments role="group" aria-labelledby="a11y-text">
              {TEXT_ZOOM.map((z, level) => (
                <Segment key={z} type="button" aria-pressed={(prefs.text ?? 0) === level} onClick={() => set("text", level)}>
                  {Math.round(z * 100)}%
                </Segment>
              ))}
            </Segments>
          </Box>

          <Box component="section">
            <GroupTitle id="a11y-display">תצוגה וקריאה</GroupTitle>
            <Toggles role="group" aria-labelledby="a11y-display">
              {TOGGLES.map(({ key, label, mouseOnly }) => {
                const on = !!prefs[key];
                return (
                  <Toggle
                    key={key}
                    type="button"
                    role="switch"
                    aria-checked={on}
                    data-mouse-only={mouseOnly || undefined}
                    onClick={() => set(key, on ? 0 : 1)}
                  >
                    <Check aria-hidden="true">{on && "✓"}</Check>
                    {label}
                  </Toggle>
                );
              })}
            </Toggles>
          </Box>
        </Body>

        <Foot>
          <Reset type="button" onClick={() => update({})}>
            איפוס הגדרות הנגישות
          </Reset>
          <StatementLink href="/accessibility" onClick={() => setOpen(false)}>
            הצהרת הנגישות
          </StatementLink>
        </Foot>
      </Panel>
    </>
  );
};
