"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import { useFormStatus } from "react-dom";
import { useState, type ReactNode } from "react";
import { Notice } from "@/components/ui/form";
import { brand } from "@/theme/theme";
import { boxAs } from "@/components/ui/primitives";

export const FormCard = styled(boxAs("form"))(({ theme }) => ({
  display: "grid",
  gap: 20,
  borderRadius: 22,
  background: "#fff",
  padding: 20,
  boxShadow: theme.toto.shadows.card,
  [theme.breakpoints.up("sm")]: { padding: 24 },
}));

export const Stack = styled(Box)({ display: "grid", gap: 16 });
export const StackForm = styled(boxAs("form"))({ display: "grid", gap: 16 });

export const Pair = styled(Box, { shouldForwardProp: (p) => p !== "always" })<{ always?: boolean }>(({ theme, always }) => ({
  display: "grid",
  gap: 20,
  ...(always ? { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" } : { [theme.breakpoints.up("sm")]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" } }),
}));

export const FormActions = styled(Box)({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 });

export const DangerRow = styled(Box)({ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: 12, fontSize: 14, color: brand.muted });

const CancelLink = styled(Link)({ fontWeight: 700, color: brand.muted, textDecoration: "underline" });

export const Cancel = ({ href }: { href: string }) => <CancelLink href={href}>ביטול</CancelLink>;

export const CheckField = ({ name, defaultChecked, label }: { name: string; defaultChecked: boolean; label: ReactNode }) => (
  <FormControlLabel control={<Checkbox name={name} defaultChecked={defaultChecked} />} label={label} />
);

export const SubmitButton = ({ children }: { children: ReactNode }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "שומרים…" : children}
    </Button>
  );
};

const DangerText = styled(ButtonBase)({ borderRadius: 999, padding: "8px 12px", fontWeight: 700, color: brand.danger, textDecoration: "underline" });
const MutedText = styled(DangerText)({ color: brand.muted });
const DangerFill = styled(ButtonBase)({ borderRadius: 999, background: brand.danger, padding: "8px 16px", fontWeight: 700, color: "#fff" });

export const DeleteButton = ({ action, id, label = "מחיקה" }: { action: (fd: FormData) => Promise<void>; id: string; label?: string }) => {
  const [armed, setArmed] = useState(false);
  return armed ? (
    <Box component="form" action={action} style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Box component="input" type="hidden" name="id" value={id} />
      <Box component="span" style={{ fontWeight: 700, color: brand.danger }}>בטוח?</Box>
      <DangerFill type="submit">כן, למחוק</DangerFill>
      <MutedText type="button" onClick={() => setArmed(false)}>
        ביטול
      </MutedText>
    </Box>
  ) : (
    <DangerText type="button" onClick={() => setArmed(true)}>
      {label}
    </DangerText>
  );
};

export const FormError = ({ error }: { error?: string }) => error ? <Notice role="alert">{error}</Notice> : null;
