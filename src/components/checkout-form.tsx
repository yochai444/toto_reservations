"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { submitOrder, type SubmitResult } from "@/app/actions/submit-order";
import { useStore } from "@/components/store";
import { earliestDeliveryDate, formatHebrewDate } from "@/lib/dates";
import type { CustomerField } from "@/lib/order";
import { formatILS } from "@/lib/pricing";
import { SITE } from "@/lib/site";

const FIELDS: { name: CustomerField; label: string; type?: string; placeholder?: string; autoComplete?: string; ltr?: boolean; inputMode?: "tel" }[] = [
  { name: "name", label: "שם מלא", placeholder: "לדוגמה: מיכל לוי", autoComplete: "name" },
  { name: "phone", label: "טלפון נייד", placeholder: "050-0000000", autoComplete: "tel", ltr: true, inputMode: "tel" },
  { name: "date", label: "תאריך הספקה", type: "date" },
  { name: "time", label: "שעת הספקה", type: "time" },
  { name: "place", label: "מקום ההספקה", placeholder: "עיר, רחוב ומספר, או שם האולם", autoComplete: "street-address" },
];

export function CheckoutForm() {
  const { hydrated, lines, item, lineTotal, total, totalQty, clearCart, setDrawerOpen } = useStore();
  const [values, setValues] = useState<Record<CustomerField, string>>({ name: "", phone: "", date: "", time: "", place: "" });
  const [errors, setErrors] = useState<Partial<Record<CustomerField, string>>>({});
  const [formError, setFormError] = useState<string>();
  const [done, setDone] = useState<Extract<SubmitResult, { ok: true }>>();
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <div className="wrap grid justify-items-center gap-3 pt-12 pb-30 text-center">
        <div className="grid size-24 place-items-center rounded-full bg-pink shadow-pop">
          <Image src="/img/crown.png" alt="" width={168} height={193} className="w-[52px] brightness-0 invert" />
        </div>
        <h1 className="text-[clamp(2rem,6vw,3rem)]">ההזמנה נשלחה לטוטו!</h1>
        <p className="max-w-[46ch] text-muted">
          תודה {done.firstName}. קיבלנו {done.trays === 1 ? "מגש אחד" : `${done.trays} מגשים`} ל{formatHebrewDate(done.date)} בשעה {done.time}. נחזור אליך בווצאפ בהקדם
          לאישור הפרטים ולתיאום התשלום.
        </p>
        <Link href="/" className="btn btn-pink mt-2">
          חזרה לדף הבית
        </Link>
      </div>
    );
  }

  if (!hydrated) return <div className="min-h-[70vh]" aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className="wrap grid justify-items-center gap-3 pt-20 pb-36 text-center text-muted">
        <Image src="/img/crown.png" alt="" width={168} height={193} className="w-[60px] opacity-60" />
        <h1 className="text-3xl">הסל עדיין ריק</h1>
        <p>בחרו כמה מגשים מהתפריט ונחזור לכאן.</p>
        <Link href="/menu" className="btn btn-pink">
          לתפריט
        </Link>
      </div>
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

  const input =
    "w-full min-w-0 rounded-[14px] border-2 border-line bg-cream px-3.5 py-3 text-[17px] text-ink outline-none focus:border-pink-btn focus:bg-white aria-invalid:border-[#C0392B] aria-invalid:bg-[#FFF1F0]";

  return (
    <div className="wrap grid gap-6 pt-8.5 pb-30 min-[960px]:grid-cols-[1.2fr_1fr] min-[960px]:items-start">
      <section className="rounded-[26px] bg-white px-5.5 py-6 shadow-card">
        <h1 className="mb-1.5 text-[1.7rem]">לאן ומתי?</h1>
        <p className="mb-4.5 text-muted">ממלאים פרטים, ואנחנו חוזרים אליכם בווצאפ לאישור ולתיאום התשלום.</p>
        <form className="grid gap-4" noValidate onSubmit={onSubmit}>
          {FIELDS.map((f) => (
            <div key={f.name} className="grid gap-1.5">
              <label htmlFor={`f-${f.name}`} className="font-extrabold text-berry">
                {f.label}
              </label>
              <input
                id={`f-${f.name}`}
                name={f.name}
                type={f.type ?? "text"}
                value={values[f.name]}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
                autoComplete={f.autoComplete}
                inputMode={f.inputMode}
                min={f.type === "date" ? earliestDeliveryDate() : undefined}
                step={f.type === "time" ? 900 : undefined}
                aria-invalid={errors[f.name] ? true : undefined}
                aria-describedby={errors[f.name] ? `e-${f.name}` : undefined}
                className={`${input} ${f.ltr ? "text-right [direction:ltr]" : ""}`}
              />
              {errors[f.name] && (
                <span id={`e-${f.name}`} className="text-sm font-bold text-[#B03224]">
                  {errors[f.name]}
                </span>
              )}
            </div>
          ))}
          {/* honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <div className="flex items-start gap-2.5 rounded-[14px] bg-blush px-3.5 py-3 text-[15px] text-berry">
            <Image src="/img/crown.png" alt="" width={168} height={193} className="mt-0.5 h-[22px] w-auto shrink-0" />
            <span>ההזמנה תישלח לטוטו בווצאפ. המחיר הסופי, המשלוח והתשלום ייסגרו איתכם אישית.</span>
          </div>
          {formError && (
            <p role="alert" className="rounded-[14px] bg-[#FFF1F0] px-3.5 py-3 font-bold text-[#B03224]">
              {formError}
            </p>
          )}
          <button type="submit" className="btn btn-pink" disabled={pending}>
            {pending ? "שולחים…" : <>שליחת ההזמנה · <span className="tabular-nums">{formatILS(total)}</span></>}
          </button>
          <p className="text-center text-[13.5px] text-muted">
            מעדיפים לדבר? <span dir="ltr" className="tabular-nums">{SITE.phoneDisplay}</span>
          </p>
        </form>
      </section>

      <aside className="rounded-[26px] bg-white px-5.5 py-6 shadow-card min-[960px]:sticky min-[960px]:top-[calc(var(--hdr)+20px)]" aria-label="סיכום ההזמנה">
        <h2 className="mb-1.5 text-[1.7rem]">ההזמנה שלך</h2>
        <p className="mb-4.5 text-muted">
          <span className="tabular-nums">{totalQty}</span> מגשים ·{" "}
          <Link href="/menu" className="underline">
            הוספת מנות
          </Link>
        </p>
        <div className="grid gap-2.5">
          {lines.map((l) => (
            <div key={l.key} className="flex justify-between gap-3 border-b border-dashed border-line pb-2 text-[15.5px]">
              <span className="min-w-0">
                {l.qty} × {item(l.itemId)?.name}
                {l.picks.length > 0 && <small className="block text-muted">{l.picks.join(" + ")}</small>}
              </span>
              <span className="tabular-nums">{formatILS(lineTotal(l))}</span>
            </div>
          ))}
          <div className="flex items-baseline justify-between text-lg font-extrabold">
            <span>סה״כ משוער</span>
            <span className="price text-[1.6rem]">{formatILS(total)}</span>
          </div>
          <button type="button" onClick={() => setDrawerOpen(true)} className="justify-self-start text-[13.5px] text-muted underline">
            עריכת הסל
          </button>
        </div>
      </aside>
    </div>
  );
}
