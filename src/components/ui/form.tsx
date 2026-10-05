"use client";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import NativeSelect from "@mui/material/NativeSelect";
import OutlinedInput, { type OutlinedInputProps } from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import { useId, type ReactNode } from "react";
import { brand } from "@/theme/theme";

const Control = styled(FormControl)({ gap: 6, minWidth: 0 });

type Labeled = { label: string; error?: string; hint?: string };

function Shell({ id, label, error, hint, children }: Labeled & { id: string; children: ReactNode }) {
  return (
    <Control fullWidth error={!!error}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      {children}
      {(error || hint) && <FormHelperText id={`${id}-help`}>{error || hint}</FormHelperText>}
    </Control>
  );
}

/** Label above a text input, with a hint or an error under it. */
export function InputField({ label, error, hint, id, ...props }: Labeled & Omit<OutlinedInputProps, "error">) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Shell id={fid} label={label} error={error} hint={hint}>
      <OutlinedInput id={fid} fullWidth aria-describedby={error || hint ? `${fid}-help` : undefined} {...props} />
    </Shell>
  );
}

/** Label above a native <select> (best on phones). */
export function SelectField({
  label,
  error,
  hint,
  children,
  ...props
}: Labeled & { name: string; defaultValue?: string; children: ReactNode }) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint}>
      <NativeSelect input={<OutlinedInput />} inputProps={{ id, ...props }}>
        {children}
      </NativeSelect>
    </Shell>
  );
}

/** Rounded message box: errors, success notes and info. */
export const Notice = styled("p", { shouldForwardProp: (p) => p !== "tone" })<{ tone?: "error" | "ok" | "info" }>(({ tone = "error" }) => ({
  borderRadius: 14,
  padding: "12px 14px",
  fontWeight: 700,
  ...(tone === "error" && { background: brand.dangerBg, color: brand.danger }),
  ...(tone === "ok" && { background: brand.okBg, color: brand.ok }),
  ...(tone === "info" && { background: brand.blush, color: brand.berry, fontWeight: 400 }),
}));
