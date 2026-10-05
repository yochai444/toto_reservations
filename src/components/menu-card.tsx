"use client";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { useStore } from "@/components/store";
import { ButterPill, CoverImage, Muted, Price, UnitChip } from "@/components/ui/primitives";
import type { MenuItem } from "@/lib/menu-types";
import { formatILS } from "@/lib/pricing";
import { brand } from "@/theme/theme";

const StepperRoot = styled("div")({ display: "inline-flex", alignItems: "center", borderRadius: 999, background: brand.blush, padding: 3 });
const StepBtn = styled("button")({
  display: "grid",
  placeItems: "center",
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "#fff",
  fontSize: 20,
  lineHeight: 1,
  fontWeight: 700,
  color: brand.pinkInk,
});
const StepQty = styled("output")({ minWidth: 30, textAlign: "center", fontWeight: 800, fontVariantNumeric: "tabular-nums" });

export function Stepper({ qty, onChange, label }: { qty: number; onChange: (q: number) => void; label: string }) {
  return (
    <StepperRoot role="group" aria-label={label}>
      <StepBtn type="button" onClick={() => onChange(qty - 1)} aria-label="הפחתה">
        −
      </StepBtn>
      <StepQty>{qty}</StepQty>
      <StepBtn type="button" onClick={() => onChange(qty + 1)} aria-label="הוספה">
        +
      </StepBtn>
    </StepperRoot>
  );
}

const Card = styled("article")(({ theme }) => ({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  overflow: "hidden",
  borderRadius: 26,
  background: "#fff",
  boxShadow: theme.toto.shadows.card,
  "&:hover .dish-photo": { transform: "scale(1.05)" },
}));

const PhotoButton = styled("button")({
  position: "relative",
  display: "block",
  aspectRatio: "4 / 3",
  width: "100%",
  overflow: "hidden",
  background: brand.blush,
  "& .dish-photo": { transition: "transform 0.3s" },
});

const Badge = styled(ButterPill)({
  position: "absolute",
  insetInlineStart: 10,
  top: 10,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "2px 10px",
  fontSize: 12.5,
});

const Body = styled("div")(({ theme }) => ({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: 6,
  padding: 14,
  [theme.breakpoints.up(760)]: { padding: "16px 18px 18px" },
}));

const Name = styled("h3")(({ theme }) => ({
  fontSize: "1.06rem",
  lineHeight: 1.25,
  [theme.breakpoints.up(760)]: { fontSize: "1.18rem" },
}));

const Small = styled(Muted)({ fontSize: 14.5, lineHeight: 1.375 });

const Footer = styled("div")({
  marginTop: "auto",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  paddingTop: 10,
});

const Row = styled("div")({ display: "flex", alignItems: "center", gap: 6 });

export function MenuCard({ item }: { item: MenuItem }) {
  const { group, lines, addLine, setQty, qtyOfItem, openSheet, showToast } = useStore();
  const g = group(item);
  const inCart = qtyOfItem(item.id);
  const plainLine = !g ? lines.find((l) => l.itemId === item.id) : undefined;

  return (
    <Card>
      <PhotoButton type="button" onClick={() => openSheet(item.id)} aria-label={`פרטים על ${item.name}`}>
        <CoverImage className="dish-photo" src={item.image} alt="" fill sizes="(min-width:1120px) 280px, (min-width:760px) 33vw, 50vw" />
        {item.badge && (
          <Badge>
            <Image src="/img/crown.png" alt="" width={168} height={193} style={{ height: 13, width: "auto" }} />
            {item.badge}
          </Badge>
        )}
      </PhotoButton>

      <Body>
        <Name>{item.name}</Name>
        {item.description && <Small>{item.description}</Small>}
        {item.unit && <UnitChip>{item.unit}</UnitChip>}
        {g?.choices.some((c) => c.extra) && (
          <Small>
            עד {g.max} מילויים · סלמון מעושן +{g.choices.find((c) => c.extra)!.extra} ₪
          </Small>
        )}

        <Footer>
          <Price size="1.3rem">{formatILS(item.price)}</Price>
          {g ? (
            <Row>
              {inCart > 0 && <ButterPill sx={{ px: 1, py: 0.25, fontSize: 12.5 }}>בסל: {inCart}</ButterPill>}
              <Button size="small" onClick={() => openSheet(item.id)}>
                {g.cta}
              </Button>
            </Row>
          ) : plainLine ? (
            <Stepper qty={plainLine.qty} onChange={(q) => setQty(plainLine.key, q)} label={`כמות ${item.name}`} />
          ) : (
            <Button
              size="small"
              onClick={() => {
                addLine(item.id, [], 1);
                showToast(`נוסף לסל: ${item.name}`);
              }}
              aria-label={`הוספת ${item.name} לסל`}
            >
              + הוספה
            </Button>
          )}
        </Footer>
      </Body>
    </Card>
  );
}
