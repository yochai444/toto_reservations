"use client";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { useState, useTransition } from "react";
import { submitOrder, type SubmitResult } from "@/app/actions/submit-order";
import { useStore } from "@/components/store";
import { InputField, Notice } from "@/components/ui/form";
import { Crown, LinkButton, Muted, Num, Price, TextButton, Wrap } from "@/components/ui/primitives";
import { earliestDeliveryDate, formatHebrewDate } from "@/lib/dates";
import type { CustomerField } from "@/lib/order";
import { formatILS } from "@/lib/pricing";
import { SITE } from "@/lib/site";
import { brand } from "@/theme/theme";

const FIELDS: { name: CustomerField; label: string; type?: string; placeholder?: string; autoComplete?: string; ltr?: boolean; inputMode?: "tel" }[] = [
  { name: "name", label: "שם מלא", placeholder: "לדוגמה: מיכל לוי", autoComplete: "name" },
  { name: "phone", label: "טלפון נייד", placeholder: "050-0000000", autoComplete: "tel", ltr: true, inputMode: "tel" },
  { name: "date", label: "תאריך הספקה", type: "date" },
  { name: "time", label: "שעת הספקה", type: "time" },
  { name: "place", label: "מקום ההספקה", placeholder: "עיר, רחוב ומספר, או שם האולם", autoComplete: "street-address" },
];

const Centered = styled(Wrap)({ display: "grid", justifyItems: "center", gap: 12, textAlign: "center" });

const DoneBadge = styled("div")(({ theme }) => ({
  display: "grid",
  width: 96,
  height: 96,
  placeItems: "center",
  borderRadius: "50%",
  background: brand.pink,
  boxShadow: theme.toto.shadows.pop,
}));

const Layout = styled(Wrap)(({ theme }) => ({
  display: "grid",
  gap: 24,
  paddingTop: 34,
  paddingBottom: 120,
  [theme.breakpoints.up(960)]: { gridTemplateColumns: "1.2fr 1fr", alignItems: "start" },
}));

const card = {
  borderRadius: 26,
  background: "#fff",
  padding: "24px 22px",
  "& h1, & h2": { marginBottom: 6, fontSize: "1.7rem" },
  "& > p": { marginBottom: 18 },
};

const Card = styled("section")(({ theme }) => ({ ...card, boxShadow: theme.toto.shadows.card }));

const Summary = styled("aside")(({ theme }) => ({
  ...card,
  boxShadow: theme.toto.shadows.card,
  [theme.breakpoints.up(960)]: { position: "sticky", top: "calc(var(--hdr) + 20px)" },
}));

const Form = styled("form")({ display: "grid", gap: 16 });

const Note = styled("div")({
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  borderRadius: 14,
  background: brand.blush,
  padding: "12px 14px",
  fontSize: 15,
  color: brand.berry,
});

const SummaryLine = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  borderBottom: `1px dashed ${brand.line}`,
  paddingBottom: 8,
  fontSize: 15.5,
  "& small": { display: "block", color: brand.muted, fontSize: "80%" },
});

const TotalRow = styled("div")({ display: "flex", alignItems: "baseline", justifyContent: "space-between", fontSize: 18, fontWeight: 800 });

export function CheckoutForm() {
  const { hydrated, lines, item, lineTotal, total, totalQty, clearCart, setDrawerOpen } = useStore();
  const [values, setValues] = useState<Record<CustomerField, string>>({ name: "", phone: "", date: "", time: "", place: "" });
  const [errors, setErrors] = useState<Partial<Record<CustomerField, string>>>({});
  const [formError, setFormError] = useState<string>();
  const [done, setDone] = useState<Extract<SubmitResult, { ok: true }>>();
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <Centered sx={{ pt: 6, pb: 15 }}>
        <DoneBadge>
          <Crown width={52} white />
        </DoneBadge>
        <h1 style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}>ההזמנה נשלחה לטוטו!</h1>
        <Muted sx={{ maxWidth: "46ch" }}>
          תודה {done.firstName}. קיבלנו {done.trays === 1 ? "מגש אחד" : `${done.trays} מגשים`} ל{formatHebrewDate(done.date)} בשעה {done.time}. נחזור אליך בווצאפ בהקדם
          לאישור הפרטים ולתיאום התשלום.
        </Muted>
        <LinkButton href="/" sx={{ mt: 1 }}>
          חזרה לדף הבית
        </LinkButton>
      </Centered>
    );
  }

  if (!hydrated) return <div style={{ minHeight: "70vh" }} aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <Centered sx={{ pt: 10, pb: 18, color: brand.muted }}>
        <Crown width={60} style={{ opacity: 0.6 }} />
        <h1 style={{ fontSize: 30 }}>הסל עדיין ריק</h1>
        <p>בחרו כמה מגשים מהתפריט ונחזור לכאן.</p>
        <LinkButton href="/menu">לתפריט</LinkButton>
      </Centered>
    );
  }

  const set = (name: CustomerField, v: string) => {
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(undefined);
    const website = String(new FormData(e.currentTarget).get("website") ?? "");
    startTransition(async () => {
      const res = await submitOrder({
        customer: values,
        lines: lines.map(({ itemId, picks, qty }) => ({ itemId, picks, qty })),
        website,
      });
      if (res.ok) {
        clearCart();
        setDone(res);
        window.scrollTo({ top: 0 });
      } else {
        setErrors(res.fieldErrors);
        setFormError(res.error);
        const first = FIELDS.find((f) => res.fieldErrors[f.name]);
        if (first) document.getElementById(`f-${first.name}`)?.focus();
      }
    });
  };

  return (
    <Layout>
      <Card>
        <h1>לאן ומתי?</h1>
        <Muted>ממלאים פרטים, ואנחנו חוזרים אליכם בווצאפ לאישור ולתיאום התשלום.</Muted>
        <Form noValidate onSubmit={onSubmit}>
          {FIELDS.map((f) => (
            <InputField
              key={f.name}
              id={`f-${f.name}`}
              label={f.label}
              error={errors[f.name]}
              name={f.name}
              type={f.type ?? "text"}
              value={values[f.name]}
              onChange={(e) => set(f.name, e.target.value)}
              placeholder={f.placeholder}
              autoComplete={f.autoComplete}
              inputProps={{
                inputMode: f.inputMode,
                min: f.type === "date" ? earliestDeliveryDate() : undefined,
                step: f.type === "time" ? 900 : undefined,
                dir: f.ltr ? "ltr" : undefined,
                style: f.ltr ? { textAlign: "right" } : undefined,
              }}
            />
          ))}
          {/* honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" hidden aria-hidden="true" />

          <Note>
            <Crown width={19} style={{ marginTop: 2, height: 22, width: "auto", flexShrink: 0 }} />
            <span>ההזמנה מגיעה ישר לטוטו, ואישור יישלח אליכם בווצאפ. המחיר הסופי, המשלוח והתשלום ייסגרו איתכם אישית.</span>
          </Note>
          {formError && <Notice role="alert">{formError}</Notice>}
          <Button type="submit" disabled={pending}>
            {pending ? (
              "שולחים…"
            ) : (
              <>
                שליחת ההזמנה · <Num>{formatILS(total)}</Num>
              </>
            )}
          </Button>
          <Muted sx={{ textAlign: "center", fontSize: 13.5 }}>
            מעדיפים לדבר? <Num dir="ltr">{SITE.phoneDisplay}</Num>
          </Muted>
        </Form>
      </Card>

      <Summary aria-label="סיכום ההזמנה">
        <h2>ההזמנה שלך</h2>
        <Muted>
          <Num>{totalQty}</Num> מגשים ·{" "}
          <Link href="/menu" style={{ textDecoration: "underline" }}>
            הוספת מנות
          </Link>
        </Muted>
        <div style={{ display: "grid", gap: 10 }}>
          {lines.map((l) => (
            <SummaryLine key={l.key}>
              <span style={{ minWidth: 0 }}>
                {l.qty} × {item(l.itemId)?.name}
                {l.picks.length > 0 && <small>{l.picks.join(" + ")}</small>}
              </span>
              <Num>{formatILS(lineTotal(l))}</Num>
            </SummaryLine>
          ))}
          <TotalRow>
            <span>סה״כ משוער</span>
            <Price size="1.6rem">{formatILS(total)}</Price>
          </TotalRow>
          <TextButton type="button" onClick={() => setDrawerOpen(true)}>
            עריכת הסל
          </TextButton>
        </div>
      </Summary>
    </Layout>
  );
}
