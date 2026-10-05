"use client";

import { styled } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { WhatsappIcon } from "@/components/icons";
import { useStore } from "@/components/store";
import { Crown, Num } from "@/components/ui/primitives";
import { formatILS } from "@/lib/pricing";
import { SITE } from "@/lib/site";
import { brand } from "@/theme/theme";

const CartBar = styled("div")(({ theme }) => ({
  position: "fixed",
  insetInline: 0,
  bottom: 0,
  zIndex: 45,
  background: `linear-gradient(to top, ${brand.cream} 70%, transparent)`,
  padding: "10px var(--gutter) calc(10px + env(safe-area-inset-bottom, 0px))",
  [theme.breakpoints.up("md")]: { insetInline: "auto 24px", bottom: 24, width: 360, background: "none", padding: 0 },
}));

const CartButton = styled("button")(({ theme }) => ({
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  borderRadius: 999,
  background: brand.pinkBtn,
  padding: "14px 22px",
  fontSize: 17,
  fontWeight: 800,
  color: "#fff",
  boxShadow: theme.toto.shadows.pop,
}));

const TrayCount = styled(Num)({ borderRadius: 999, background: "#fff", padding: "1px 10px", fontSize: 14, color: brand.pinkInk });

const WhatsApp = styled("a", { shouldForwardProp: (p) => p !== "raised" })<{ raised: boolean }>(({ theme, raised }) => ({
  position: "fixed",
  insetInlineEnd: 16,
  zIndex: 44,
  display: "grid",
  width: 54,
  height: 54,
  placeItems: "center",
  borderRadius: "50%",
  background: brand.wa,
  color: "#fff",
  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  bottom: raised ? "calc(86px + env(safe-area-inset-bottom, 0px))" : "calc(16px + env(safe-area-inset-bottom, 0px))",
  [theme.breakpoints.up("md")]: raised ? { bottom: 96 } : {},
}));

// Centered with inset + auto margins (not left:50%/translate), so the RTL style flip can't shift it.
const Toast = styled("div")({
  position: "fixed",
  top: "calc(var(--hdr) + env(safe-area-inset-top, 0px) + 12px)",
  insetInline: 0,
  zIndex: 1500,
  marginInline: "auto",
  display: "flex",
  width: "fit-content",
  maxWidth: "calc(100% - 32px)",
  alignItems: "center",
  gap: 8,
  borderRadius: 999,
  background: brand.berry,
  padding: "10px 18px",
  fontWeight: 700,
  color: "#fff",
  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  animation: "up 0.25s ease",
});

/** Bottom cart bar (phones: full width; desktop: corner pill), WhatsApp button and toast. */
export function FloatingUI() {
  const { totalQty, total, setDrawerOpen, toast } = useStore();
  const pathname = usePathname();
  const showBar = totalQty > 0 && pathname !== "/checkout";

  return (
    <>
      {showBar && (
        <CartBar>
          <CartButton type="button" onClick={() => setDrawerOpen(true)}>
            <span>
              לסיום ההזמנה <TrayCount>{totalQty === 1 ? "מגש אחד" : `${totalQty} מגשים`}</TrayCount>
            </span>
            <Num>{formatILS(total)}</Num>
          </CartButton>
        </CartBar>
      )}

      <WhatsApp href={SITE.whatsappLink} target="_blank" rel="noopener" aria-label="שליחת הודעה לטוטו בווצאפ" raised={showBar}>
        <WhatsappIcon style={{ width: 28, height: 28 }} />
      </WhatsApp>

      {toast && (
        <Toast role="status">
          <Crown width={16} white style={{ height: 18, width: "auto" }} />
          {toast}
        </Toast>
      )}
    </>
  );
}
