import Image from "next/image";
import Link from "next/link";
import { MenuCard } from "@/components/menu-card";
import { SectionLink } from "@/components/section-link";
import { getMenu } from "@/lib/menu";
import { SITE } from "@/lib/site";

const STEPS = [
  { title: "בוחרים מגשים", text: "עוברים על התפריט, בוחרים מילויים וכמויות. הסכום מתעדכן בסל תוך כדי." },
  { title: "ממלאים פרטים", text: "שם, טלפון, תאריך, שעה ומקום ההספקה. זה הכל." },
  { title: "סוגרים בווצאפ", text: "ההזמנה מגיעה ישר לטוטו, ואנחנו חוזרים אליכם לאישור ולתיאום התשלום." },
];

const Crown = ({ className = "w-[34px]" }: { className?: string }) => (
  <Image src="/img/crown.png" alt="" width={168} height={193} className={`h-auto ${className}`} />
);

export default async function HomePage() {
  const menu = await getMenu();
  const featured = menu.items.filter((i) => i.featured);

  return (
    <>
      {/* hero: fills the first screen */}
      <section className="pattern-white bg-pink text-white">
        <div className="wrap hero-in grid content-center items-center min-[960px]:grid-cols-[1.05fr_1fr]">
          <div>
            <div className="hero-logo logo-white mb-[clamp(6px,1.6vh,18px)]" role="img" aria-label="TOTO Catering" />
            <div className="mb-[clamp(8px,1.8vh,18px)] inline-flex flex-wrap gap-x-2.5 gap-y-1 rounded-full border border-white/40 bg-white/18 px-3.5 py-1 text-[12.5px] font-bold tracking-wide sm:text-sm">
              <span>קייטרינג חלבי</span>·<span>כשר למהדרין</span>·<span>עכו והצפון</span>
            </div>
            <h1 className="hero-title mb-[clamp(6px,1.4vh,16px)] font-bold text-white">
              האוכל עלינו,{" "}
              <em className="rounded-[14px] bg-butter px-[0.18em] text-berry not-italic [box-decoration-break:clone]">המחמאות</em> עליכם
            </h1>
            <p className="hero-sub mb-[clamp(12px,2.4vh,28px)] max-w-[36ch] font-semibold">
              מגשי אירוח, סלטים, מאפים וקינוחים לכל אירוע. בוחרים באתר, ואנחנו חוזרים אליכם בווצאפ לסגירת ההזמנה.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/menu" className="btn btn-white">
                לתפריט ולהזמנה
              </Link>
              <SectionLink id="how" className="btn btn-ghost">
                איך זה עובד?
              </SectionLink>
            </div>
          </div>
          <div className="collage" aria-hidden="true">
            <div className="ph ph-a">
              <Image src="/img/hero.webp" alt="" fill priority sizes="(min-width:960px) 350px, 40vw" className="object-cover" />
            </div>
            <div className="ph ph-b">
              <Image src="/img/croissant.webp" alt="" fill priority sizes="(min-width:960px) 260px, 40vw" className="object-cover" />
            </div>
            <div className="ph ph-c">
              <Image src="/img/lemontart.webp" alt="" fill sizes="(min-width:960px) 300px, 40vw" className="object-cover" />
            </div>
            <div className="sticker flex items-center gap-2 rounded-full bg-butter px-[18px] py-2.5 font-display text-[15px] font-bold text-berry shadow-pop">
              <Crown className="w-[17px]" />
              טרי, מעוצב, מוכן להגשה
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="py-16 min-[900px]:py-22">
        <div className="wrap">
          <div className="mb-9 grid justify-items-center gap-2.5 text-center">
            <Crown />
            <h2 className="text-[clamp(1.9rem,4vw,2.7rem)]">מזמינים ב-3 צעדים</h2>
            <p className="max-w-[52ch] text-muted">בלי טלפונים הלוך ושוב. בוחרים, שולחים, ואנחנו חוזרים אליכם לסגור את הפרטים.</p>
          </div>
          <ol className="grid gap-4.5 min-[800px]:grid-cols-3 min-[800px]:gap-6.5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-1.5 rounded-[26px] border-2 border-line bg-white px-6 py-6.5">
                <span className="row-span-2 grid size-14 place-items-center rounded-full bg-pink font-display text-[28px] font-bold text-white shadow-pop">{i + 1}</span>
                <h3 className="pt-1 text-[1.35rem]">{s.title}</h3>
                <p className="text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pb-16 min-[900px]:pb-22">
        <div className="wrap">
          <div className="mb-9 grid justify-items-center gap-2.5 text-center">
            <h2 className="text-[clamp(1.9rem,4vw,2.7rem)]">מה בא לכם להגיש?</h2>
            <p className="text-muted">
              {menu.items.length} מנות ב-{menu.categories.length} קטגוריות, מהפתיחה ועד הקינוח.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4.5 gap-y-5.5">
            {menu.categories.map((c) => (
              <Link key={c.id} href={`/menu#cat-${c.id}`} className="group grid w-[136px] justify-items-center gap-2.5">
                <span className="cat-ring size-[120px] rounded-full p-[5px] transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-6">
                  <Image src={c.image} alt="" width={110} height={110} className="size-full rounded-full border-4 border-white object-cover" />
                </span>
                <b className="font-display text-[1.12rem] font-semibold text-berry">{c.name}</b>
                <span className="-mt-2 text-sm text-muted">{menu.items.filter((i) => i.categoryId === c.id).length} מנות</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pattern-white bg-pink py-16 text-white min-[900px]:py-22">
        <div className="wrap">
          <div className="mb-9 grid justify-items-center gap-2.5 text-center">
            <Crown className="w-[34px] brightness-0 invert" />
            <h2 className="text-[clamp(1.9rem,4vw,2.7rem)] text-white">הכי מוזמנים אצלנו</h2>
            <p>המגשים שחוזרים כמעט לכל אירוע.</p>
          </div>
          <div className="grid grid-cols-2 gap-3.5 min-[760px]:grid-cols-3 min-[760px]:gap-5.5 min-[1120px]:grid-cols-4">
            {featured.map((it) => (
              <MenuCard key={it.id} item={it} />
            ))}
          </div>
          <div className="mt-8.5 text-center">
            <Link href="/menu" className="btn btn-white">
              לכל התפריט
            </Link>
          </div>
        </div>
      </section>

      <section id="kosher" className="py-16 min-[900px]:py-22">
        <div className="wrap grid items-center gap-7.5 min-[900px]:grid-cols-[1fr_1.25fr]">
          <div>
            <h2 className="mb-3 text-[clamp(1.9rem,4vw,2.6rem)]">כשר למהדרין</h2>
            <p className="max-w-[44ch] text-muted">כל המנות חלביות או פרווה, בהשגחת הרבנות הראשית עכו ובהשגחת בד״ץ. תעודות הכשרות זמינות לפי בקשה.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["seal-dairy", "תעודת כשרות חלבי, הרבנות הראשית עכו"],
              ["seal-badatz", "השגחת בד״ץ"],
              ["seal-parve", "תעודת כשרות פרווה, הרבנות הראשית עכו"],
            ].map(([src, alt]) => (
              <div key={src} className="grid place-items-center rounded-[18px] border-2 border-line bg-white p-3.5">
                <Image src={`/img/${src}.png`} alt={alt} width={288} height={360} className="max-h-[150px] w-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="pb-16 min-[900px]:pb-22">
        <div className="wrap grid gap-4.5 min-[860px]:grid-cols-[1.3fr_1fr]">
          <div className="pattern-white rounded-[26px] bg-pink px-6.5 py-7.5 text-white">
            <div>
              <h3 className="mb-2.5 text-[1.7rem] text-white">לאירועים עם בופה מעוצב</h3>
              <p className="text-[1.1rem] font-semibold">בריתות, בר ובת מצווה, ימי הולדת, אירועי חברה ושבתות. {SITE.serviceArea}.</p>
              <ul className="mt-4 grid gap-2.5">
                {["הזמנה באתר בכמה דקות", "אישור ותיאום אישי בווצאפ", "משלוח עד מקום האירוע"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 font-semibold">
                    <Crown className="w-4 brightness-0 invert" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-[26px] border-2 border-line bg-white px-6.5 py-7.5">
            <h3 className="mb-2.5 text-[1.7rem]">דברו איתנו</h3>
            <p className="text-muted">{SITE.address}</p>
            <a href={`tel:${SITE.phoneDisplay.replace(/-/g, "")}`} dir="ltr" className="mt-3.5 inline-block font-display text-[clamp(1.8rem,5vw,2.4rem)] font-bold tracking-wide text-pink-ink tabular-nums">
              {SITE.phoneDisplay}
            </a>
            <p className="mt-2.5 text-muted">שיחה, הודעה או ווצאפ. נשמח לעזור בבחירת הכמויות.</p>
          </div>
        </div>
      </section>
    </>
  );
}
