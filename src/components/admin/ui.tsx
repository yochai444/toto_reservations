"use client";

import { useFormStatus } from "react-dom";
import { useState, type ReactNode } from "react";

export function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="font-extrabold text-berry">{label}</span>
      {children}
      {hint && !error && <span className="text-sm text-muted">{hint}</span>}
      {error && <span className="text-sm font-bold text-[#B03224]">{error}</span>}
    </label>
  );
}

export function SubmitButton({ children, className = "btn btn-pink" }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? "שומרים…" : children}
    </button>
  );
}

/** Two-step delete: the first tap asks, the second submits. No browser confirm() dialogs. */
export function DeleteButton({ action, id, label = "מחיקה" }: { action: (fd: FormData) => Promise<void>; id: string; label?: string }) {
  const [armed, setArmed] = useState(false);
  return armed ? (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <span className="font-bold text-[#B03224]">בטוח?</span>
      <button type="submit" className="rounded-full bg-[#B03224] px-4 py-2 font-bold text-white">
        כן, למחוק
      </button>
      <button type="button" onClick={() => setArmed(false)} className="rounded-full px-3 py-2 font-bold text-muted underline">
        ביטול
      </button>
    </form>
  ) : (
    <button type="button" onClick={() => setArmed(true)} className="rounded-full px-3 py-2 font-bold text-[#B03224] underline">
      {label}
    </button>
  );
}

export function FormError({ error }: { error?: string }) {
  return error ? (
    <p role="alert" className="rounded-[14px] bg-[#FFF1F0] px-3.5 py-3 font-bold text-[#B03224]">
      {error}
    </p>
  ) : null;
}
