"use client";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Dialog from "@mui/material/Dialog";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { useStore } from "@/components/store";
import { CloseButton, CoverImage, Muted, Price, srOnly } from "@/components/ui/primitives";
import { formatILS } from "@/lib/pricing";
import { brand } from "@/theme/theme";

const QUICK = ["סלמון", "פוקצ'ות", "קיש", "טארט", "סלט יווני", "פסטה"];
const norm = (s: string) => s.toLowerCase().replace(/[׳'"״`]/g, "").replace(/\s+/g, " ").trim();

const Panel = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-container": {
    alignItems: "flex-start",
    padding: "calc(env(safe-area-inset-top, 0px) + 12px) 12px 0",
    [theme.breakpoints.up(760)]: { paddingTop: "calc(var(--hdr) + 16px)" },
  },
  "& .MuiDialog-paper": {
    margin: 0,
    width: "100%",
    maxWidth: 640,
    maxHeight: "80vh",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    animation: "up 0.25s ease",
  },
}));

const Bar = styled(Box)({ display: "flex", alignItems: "center", gap: 10, borderBottom: `2px solid ${brand.line}`, padding: "12px 14px" });

const Input = styled(InputBase)({
  minWidth: 0,
  flex: 1,
  borderRadius: 8,
  fontSize: 19,
  "& .MuiInputBase-input": { padding: "8px 2px" },
  // InputBase drops the outline on focus.
  "&.Mui-focused": { outline: `3px solid ${brand.berry}`, outlineOffset: 2 },
});

const Results = styled(Box)({ display: "grid", gap: 4, overflow: "auto", padding: 8 });

const Quick = styled(ButtonBase)({
  borderRadius: 999,
  border: `2px solid ${brand.line}`,
  padding: "6px 14px",
  fontWeight: 700,
  color: brand.pinkInk,
});

const Hit = styled(ButtonBase)({
  display: "grid",
  width: "100%",
  gridTemplateColumns: "56px 1fr auto",
  alignItems: "center",
  gap: 12,
  borderRadius: 16,
  padding: 8,
  textAlign: "start",
  "&:hover, &:focus-visible": { background: brand.blush },
  "& b": { display: "block", lineHeight: 1.25, color: brand.berry },
  "& small": { color: brand.muted, fontSize: "80%" },
});

const Thumb = styled(CoverImage)({ width: 56, height: 56, borderRadius: 12 });

export const SearchDialog = () => {
  const { searchOpen, setSearchOpen } = useStore();
  if (!searchOpen) return null;
  return <SearchBody close={() => setSearchOpen(false)} />;
};

const SearchBody = ({ close }: { close: () => void }) => {
  const { menu, openSheet } = useStore();
  const [q, setQ] = useState("");

  const hits = useMemo(() => {
    const words = norm(q).split(" ").filter(Boolean);
    if (!words.length) return [];
    return menu.items
      .filter((it) => {
        const cat = menu.categories.find((c) => c.id === it.categoryId)?.name ?? "";
        const hay = norm(`${it.name} ${it.description ?? ""} ${cat}`);
        return words.every((w) => hay.includes(w));
      })
      .slice(0, 14);
  }, [q, menu]);

  return (
    // The name goes on the paper: that's the element with role="dialog" (a root aria-label never reaches it).
    <Panel open onClose={close} slotProps={{ paper: { "aria-label": "חיפוש מנה" } }}>
      <Box component="p" role="status" style={srOnly}>
        {!q.trim() ? "" : hits.length === 1 ? "נמצאה מנה אחת" : hits.length ? `נמצאו ${hits.length} מנות` : "לא נמצאו מנות"}
      </Box>
      <Bar>
        <SearchIcon style={{ width: 22, height: 22, flexShrink: 0, color: brand.pinkInk }} />
        <Input
          autoFocus
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="מה מחפשים? למשל סלמון, טארט, פוקצ'ה"
          slotProps={{ input: { "aria-label": "חיפוש מנה" } }}
        />
        <CloseButton tone="blush" type="button" onClick={close} aria-label="סגירת החיפוש">
          ✕
        </CloseButton>
      </Bar>

      <Results>
        {!q.trim() ? (
          <>
            <Muted sx={{ px: 1, pt: 1.25, pb: 0.5, fontSize: 14 }}>חיפושים נפוצים</Muted>
            <Box style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "0 6px 10px" }}>
              {QUICK.map((w) => (
                <Quick key={w} type="button" onClick={() => setQ(w)}>
                  {w}
                </Quick>
              ))}
            </Box>
          </>
        ) : hits.length ? (
          hits.map((it) => (
            <Hit
              key={it.id}
              type="button"
              onClick={() => {
                close();
                openSheet(it.id);
              }}
            >
              <Thumb src={it.image} alt="" width={56} height={56} />
              <Box component="span">
                <Box component="b">{it.name}</Box>
                <Box component="small">
                  {menu.categories.find((c) => c.id === it.categoryId)?.name}
                  {it.unit ? ` · ${it.unit}` : ""}
                </Box>
              </Box>
              <Price>{formatILS(it.price)}</Price>
            </Hit>
          ))
        ) : (
          <Muted sx={{ px: 1.5, py: 2.5, textAlign: "center", fontSize: 14 }}>לא מצאנו מנה בשם &quot;{q}&quot;. נסו מילה אחרת, או כתבו לנו בוואטסאפ.</Muted>
        )}
      </Results>
    </Panel>
  );
};
