"use client";

import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { useStore } from "@/components/store";
import { CloseButton, CoverImage, Muted, Price } from "@/components/ui/primitives";
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

const Bar = styled("div")({ display: "flex", alignItems: "center", gap: 10, borderBottom: `2px solid ${brand.line}`, padding: "12px 14px" });

const Input = styled("input")({ minWidth: 0, flex: 1, padding: "8px 2px", fontSize: 19, outline: "none" });

const Results = styled("div")({ display: "grid", gap: 4, overflow: "auto", padding: 8 });

const Quick = styled("button")({
  borderRadius: 999,
  border: `2px solid ${brand.line}`,
  padding: "6px 14px",
  fontWeight: 700,
  color: brand.pinkInk,
});

const Hit = styled("button")({
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

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useStore();
  if (!searchOpen) return null;
  return <SearchBody close={() => setSearchOpen(false)} />;
}

function SearchBody({ close }: { close: () => void }) {
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
    <Panel open onClose={close} aria-label="חיפוש מנה">
      <Bar>
        <SearchIcon style={{ width: 22, height: 22, flexShrink: 0, color: brand.pinkInk }} />
        <Input
          autoFocus
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="מה מחפשים? למשל סלמון, טארט, פוקצ'ה"
          aria-label="חיפוש מנה"
        />
        <CloseButton tone="blush" type="button" onClick={close} aria-label="סגירת החיפוש">
          ✕
        </CloseButton>
      </Bar>

      <Results>
        {!q.trim() ? (
          <>
            <Muted sx={{ px: 1, pt: 1.25, pb: 0.5, fontSize: 14 }}>חיפושים נפוצים</Muted>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "0 6px 10px" }}>
              {QUICK.map((w) => (
                <Quick key={w} type="button" onClick={() => setQ(w)}>
                  {w}
                </Quick>
              ))}
            </div>
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
              <span>
                <b>{it.name}</b>
                <small>
                  {menu.categories.find((c) => c.id === it.categoryId)?.name}
                  {it.unit ? ` · ${it.unit}` : ""}
                </small>
              </span>
              <Price>{formatILS(it.price)}</Price>
            </Hit>
          ))
        ) : (
          <Muted sx={{ px: 1.5, py: 2.5, textAlign: "center", fontSize: 14 }}>לא מצאנו מנה בשם &quot;{q}&quot;. נסו מילה אחרת, או כתבו לנו בווצאפ.</Muted>
        )}
      </Results>
    </Panel>
  );
}
