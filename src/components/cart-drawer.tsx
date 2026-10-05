"use client";

import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import { Stepper } from "@/components/menu-card";
import { useStore } from "@/components/store";
import { CloseButton, CoverImage, Crown, LinkButton, Muted, Price, TextButton } from "@/components/ui/primitives";
import { formatILS } from "@/lib/pricing";
import { brand } from "@/theme/theme";

const Panel = styled(Drawer)({
  "& .MuiDrawer-paper": { display: "flex", flexDirection: "column", width: "min(440px, 100%)", background: brand.cream },
});

const Head = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: brand.pink,
  padding: "calc(16px + env(safe-area-inset-top, 0px)) 20px 14px",
  color: "#fff",
  "& h3": { fontSize: 24, color: "#fff" },
});

const Empty = styled("div")({
  display: "grid",
  flex: 1,
  alignContent: "start",
  justifyItems: "center",
  gap: 12,
  padding: "40px 16px",
  textAlign: "center",
  color: brand.muted,
  "& b": { color: brand.berry },
});

const Lines = styled("div")({ display: "grid", flex: 1, alignContent: "start", gap: 12, overflow: "auto", padding: "14px 16px" });

const Line = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "72px 1fr",
  gap: 12,
  borderRadius: 18,
  background: "#fff",
  padding: 10,
  boxShadow: theme.toto.shadows.card,
}));

const Thumb = styled(CoverImage)({ width: 72, height: 72, borderRadius: 12 });

const LineBody = styled("div")({ display: "grid", minWidth: 0, gap: 4 });

const Between = styled("div")({ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 });

const Foot = styled("div")({
  display: "grid",
  gap: 12,
  borderTop: `1px solid ${brand.line}`,
  background: "#fff",
  padding: "16px 20px calc(18px + env(safe-area-inset-bottom, 0px))",
});

const TotalRow = styled("div")({ display: "flex", alignItems: "baseline", justifyContent: "space-between", fontSize: 18, fontWeight: 800 });

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, item, setQty, lineTotal, total } = useStore();
  const close = () => setDrawerOpen(false);

  return (
    // MUI mirrors the anchor for RTL and the RTL style plugin mirrors it back, so "left" opens on the visual right (start) edge.
    <Panel
      anchor="left"
      open={drawerOpen}
      onClose={close}
      slotProps={{ paper: { role: "dialog", "aria-modal": true, "aria-labelledby": "drawer-title" } }}
    >
      <Head>
        <h3 id="drawer-title">הסל שלי</h3>
        <CloseButton type="button" onClick={close} aria-label="סגירה">
          ✕
        </CloseButton>
      </Head>

      {lines.length === 0 ? (
        <Empty>
          <Crown width={60} style={{ opacity: 0.6 }} />
          <b>הסל ריק</b>
          <p>הוסיפו מגשים מהתפריט.</p>
          <LinkButton href="/menu" onClick={close}>
            לתפריט
          </LinkButton>
        </Empty>
      ) : (
        <>
          <Lines>
            {lines.map((l) => {
              const it = item(l.itemId)!;
              return (
                <Line key={l.key}>
                  <Thumb src={it.image} alt="" width={72} height={72} />
                  <LineBody>
                    <div style={{ lineHeight: 1.25, fontWeight: 800 }}>{it.name}</div>
                    {l.picks.length > 0 && <Muted as="div" sx={{ fontSize: 14 }}>{l.picks.join(" + ")}</Muted>}
                    <Between>
                      <Stepper qty={l.qty} onChange={(q) => setQty(l.key, q)} label={`כמות ${it.name}`} />
                      <Price size="1.1rem">{formatILS(lineTotal(l))}</Price>
                    </Between>
                    <TextButton type="button" onClick={() => setQty(l.key, 0)}>
                      הסרה
                    </TextButton>
                  </LineBody>
                </Line>
              );
            })}
          </Lines>
          <Foot>
            <TotalRow>
              <span>סה״כ משוער</span>
              <Price size="1.6rem">{formatILS(total)}</Price>
            </TotalRow>
            <Muted sx={{ fontSize: 13.5 }}>המחיר הסופי, המשלוח והתשלום נסגרים מול טוטו בווצאפ.</Muted>
            <LinkButton href="/checkout" onClick={close}>
              להמשך ההזמנה
            </LinkButton>
          </Foot>
        </>
      )}
    </Panel>
  );
}
