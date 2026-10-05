"use client";

import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useState, type ReactNode } from "react";
import { Notice } from "@/components/ui/form";
import { brand } from "@/theme/theme";

/** White card holding an admin form. */
export const FormCard = styled("form")(({ theme }) => ({
  display: "grid",
  gap: 20,
  borderRadius: 22,
  background: "#fff",
  padding: 20,
  boxShadow: theme.toto.shadows.card,
  [theme.breakpoints.up("sm")]: { padding: 24 },
}));

export const Stack = styled("div")({ display: "grid", gap: 16 });
export const StackForm = styled("form")({ display: "grid", gap: 16 });

/** Two fields side by side from 640px (or always, with `always`). */
export const Pair = styled("div", { shouldForwardProp: (p) => p !== "always" })<{ always?: boolean }>(({ theme, always }) => ({
  display: "grid",
  gap: 20,
  ...(always ? { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" } : { [theme.breakpoints.up("sm")]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" } }),
}));

export const FormActions = styled("div")({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 });

export const DangerRow = styled("div")({ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: 12, fontSize: 14, color: brand.muted });

const CancelLink = styled(Link)({ fontWeight: 700, color: brand.muted, textDecoration: "underline" });

export function Cancel({ href }: { href: string }) {
  return <CancelLink href={href}>ביטול</CancelLink>;
}

/** Native checkbox (posts "on" when checked) with an MUI look. */
export function CheckField({ name, defaultChecked, label }: { name: string; defaultChecked: boolean; label: ReactNode }) {
  return <FormControlLabel control={<Checkbox name={name} defaultChecked={defaultChecked} />} label={label} />;
}

export function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "שומרים…" : children}
    </Button>
  );
}

const DangerText = styled("button")({ borderRadius: 999, padding: "8px 12px", fontWeight: 700, color: brand.danger, textDecoration: "underline" });
const MutedText = styled(DangerText)({ color: brand.muted });
const DangerFill = styled("button")({ borderRadius: 999, background: brand.danger, padding: "8px 16px", fontWeight: 700, color: "#fff" });

/** Two-step delete: the first tap asks, the second submits. No browser confirm() dialogs. */
export function DeleteButton({ action, id, label = "מחיקה" }: { action: (fd: FormData) => Promise<void>; id: string; label?: string }) {
  const [armed, setArmed] = useState(false);
  return armed ? (
    <form action={action} style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input type="hidden" name="id" value={id} />
      <span style={{ fontWeight: 700, color: brand.danger }}>בטוח?</span>
      <DangerFill type="submit">כן, למחוק</DangerFill>
      <MutedText type="button" onClick={() => setArmed(false)}>
        ביטול
      </MutedText>
    </form>
  ) : (
    <DangerText type="button" onClick={() => setArmed(true)}>
      {label}
    </DangerText>
  );
}

export function FormError({ error }: { error?: string }) {
  return error ? <Notice role="alert">{error}</Notice> : null;
}
