"use client";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import NativeSelect from "@mui/material/NativeSelect";
import OutlinedInput, { type OutlinedInputProps } from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import { useId, type ReactNode } from "react";
import { brand } from "@/theme/theme";
import { boxAs } from "@/components/ui/primitives";

const Control = styled(FormControl)({ gap: 6, minWidth: 0 });

type Labeled = { label: string; error?: string; hint?: string };

const Shell = ({ id, label, error, hint, children }: Labeled & { id: string; children: ReactNode }) => (
  <Control fullWidth error={!!error}>
    <FormLabel htmlFor={id}>{label}</FormLabel>
    {children}
    {(error || hint) && <FormHelperText id={`${id}-help`}>{error || hint}</FormHelperText>}
  </Control>
);

export const InputField = ({ label, error, hint, id, ...props }: Labeled & Omit<OutlinedInputProps, "error">) => {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Shell id={fid} label={label} error={error} hint={hint}>
      <OutlinedInput id={fid} fullWidth aria-describedby={error || hint ? `${fid}-help` : undefined} {...props} />
    </Shell>
  );
};

export const SelectField = ({
  label,
  error,
  hint,
  children,
  ...props
}: Labeled & { name: string; defaultValue?: string; children: ReactNode }) => {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint}>
      <NativeSelect input={<OutlinedInput />} inputProps={{ id, ...props }}>
        {children}
      </NativeSelect>
    </Shell>
  );
};

export const Notice = styled(boxAs("p"), { shouldForwardProp: (p) => p !== "tone" })<{ tone?: "error" | "ok" | "info" }>(({ tone = "error" }) => ({
  borderRadius: 14,
  padding: "12px 14px",
  fontWeight: 700,
  ...(tone === "error" && { background: brand.dangerBg, color: brand.danger }),
  ...(tone === "ok" && { background: brand.okBg, color: brand.ok }),
  ...(tone === "info" && { background: brand.blush, color: brand.berry, fontWeight: 400 }),
}));
