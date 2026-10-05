"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Stepper } from "@/components/menu-card";
import { useStore } from "@/components/store";
import { ButterPill, CloseButton, CoverImage, Muted, Num, Price, srOnly, UnitChip } from "@/components/ui/primitives";
import { formatILS, trayPrice } from "@/lib/pricing";
import { brand } from "@/theme/theme";

/** Dish details + option picker. Mounted only while open, keyed by item, so state starts fresh. */
export function ItemSheet() {
  const { sheetItemId } = useStore();
  if (!sheetItemId) return null;
  return <SheetBody key={sheetItemId} itemId={sheetItemId} />;
}

const Sheet = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-container": {
    alignItems: "flex-end",
    [theme.breakpoints.up(760)]: { alignItems: "center", padding: 24 },
  },
  "& .MuiDialog-paper": {
    margin: 0,
    width: "100%",
    maxWidth: 560,
    maxHeight: "92vh",
    borderRadius: "28px 28px 0 0",
    boxShadow: "none",
    animation: "up 0.25s ease",
    [theme.breakpoints.up(760)]: { borderRadius: 28 },
  },
}));

const Photo = styled("div")({ position: "relative", flexShrink: 0, aspectRatio: "16 / 9", background: brand.blush });

const PhotoClose = styled(CloseButton)({
  position: "absolute",
  insetInlineEnd: 12,
  top: 12,
  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
});

const Content = styled("div")({ display: "grid", gap: 14, padding: "20px 22px 22px", "& h3": { fontSize: "1.6rem" } });

const Meta = styled("div")({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 });

const Legend = styled("legend")(({ theme }) => ({
  marginBottom: 4,
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  fontFamily: theme.toto.fonts.display,
  fontSize: 18,
  fontWeight: 600,
  color: brand.berry,
  "& span": { fontFamily: theme.toto.fonts.body, fontSize: 14, fontWeight: 800, color: brand.pinkInk, fontVariantNumeric: "tabular-nums" },
}));

const Choice = styled("label", { shouldForwardProp: (p) => p !== "checked" && p !== "disabled" })<{ checked: boolean; disabled: boolean }>(
  ({ checked, disabled }) => ({
    position: "relative",
    display: "inline-flex",
    cursor: disabled ? "not-allowed" : "pointer",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    border: `2px solid ${checked ? brand.pinkBtn : brand.line}`,
    background: checked ? brand.pinkBtn : "#fff",
    color: checked ? "#fff" : undefined,
    padding: "8px 14px",
    fontSize: 15,
    fontWeight: 700,
    opacity: disabled ? 0.4 : 1,
    "&:has(:focus-visible)": { outline: `3px solid ${brand.butter}` },
  }),
);

const Bar = styled("div")({
  position: "sticky",
  bottom: 0,
  display: "flex",
  alignItems: "center",
  gap: 12,
  borderTop: `1px solid ${brand.line}`,
  background: "#fff",
  padding: "14px 22px calc(16px + env(safe-area-inset-bottom, 0px))",
});

function SheetBody({ itemId }: { itemId: string }) {
  const { item: getItem, group, addLine, openSheet, showToast } = useStore();
  const item = getItem(itemId)!;
  const g = group(item);
  const [picks, setPicks] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const close = () => openSheet(null);

  const toggle = (name: string) => {
    if (!g) return;
    if (g.max === 1) return setPicks([name]);
    setPicks((p) => (p.includes(name) ? p.filter((x) => x !== name) : p.length < g.max ? [...p, name] : p));
  };
  const ready = !g || picks.length >= g.min;
  const total = trayPrice(item, g, picks) * qty;

  return (
    <Sheet open onClose={close} aria-labelledby="sheet-title">
      <Photo>
        <CoverImage src={item.image} alt="" fill sizes="560px" />
        <PhotoClose type="button" onClick={close} aria-label="סגירה">
          ✕
        </PhotoClose>
      </Photo>

      <Content>
        <h3 id="sheet-title">{item.name}</h3>
        <Meta>
          {item.unit && <UnitChip>{item.unit}</UnitChip>}
          <Price size="1.3rem">{formatILS(item.price)}</Price>
          <Muted as="span" sx={{ fontSize: 14 }}>
            למגש
          </Muted>
        </Meta>
        {item.description && <Muted sx={{ fontSize: 14.5 }}>{item.description}</Muted>}

        {g && (
          <fieldset style={{ display: "grid", gap: 10 }}>
            <Legend>
              {g.legend}
              <span>
                {picks.length} מתוך {g.max}
              </span>
            </Legend>
            <Meta>
              {g.choices.map((c, i) => {
                const checked = picks.includes(c.name);
                const disabled = !checked && g.max > 1 && picks.length >= g.max;
                return (
                  <Choice key={c.name} htmlFor={`opt-${i}`} checked={checked} disabled={disabled}>
                    <input
                      id={`opt-${i}`}
                      type={g.max === 1 ? "radio" : "checkbox"}
                      name="opt"
                      style={srOnly}
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggle(c.name)}
                    />
                    {c.name}
                    {c.extra && <ButterPill sx={{ px: 1, fontSize: 12.5, fontWeight: 700 }}>+{c.extra} ₪</ButterPill>}
                  </Choice>
                );
              })}
            </Meta>
            <Muted sx={{ fontSize: 14 }}>
              {g.max === 1 ? "בחירה אחת" : `אפשר לבחור עד ${g.max} למגש`}
              {g.choices.some((c) => c.extra) ? ". התוספת היא למגש כולו." : "."}
            </Muted>
          </fieldset>
        )}
      </Content>

      <Bar>
        <Stepper qty={qty} onChange={(q) => setQty(Math.max(1, Math.min(50, q)))} label="כמות מגשים" />
        <Button
          disabled={!ready}
          sx={{ flex: 1 }}
          onClick={() => {
            addLine(item.id, picks, qty);
            showToast(`נוסף לסל: ${item.name}`);
            close();
          }}
        >
          הוספה לסל · <Num>{formatILS(total)}</Num>
        </Button>
      </Bar>
    </Sheet>
  );
}
