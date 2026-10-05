import Image from "next/image";
import {
  Actions,
  Categories,
  CategoryLink,
  Center,
  Collage,
  ContactGrid,
  ContactPanel,
  EventsPanel,
  Hero,
  HeroIn,
  HeroLogo,
  HeroSub,
  HeroTitle,
  KosherGrid,
  Phone,
  PinkSection,
  Seal,
  Seals,
  Section,
  SectionHead,
  SectionTail,
  Step,
  StepNum,
  Steps,
  Sticker,
  Tags,
} from "@/components/home/site-styles";
import { MenuCard } from "@/components/menu-card";
import { SectionButton } from "@/components/section-link";
import { CoverImage, Crown, DishGrid, LinkButton, Muted, Wrap } from "@/components/ui/primitives";
import { getMenu } from "@/lib/menu";
import { SITE } from "@/lib/site";

const STEPS = [
  { title: "בוחרים מגשים", text: "עוברים על התפריט, בוחרים מילויים וכמויות. הסכום מתעדכן בסל תוך כדי." },
  { title: "ממלאים פרטים", text: "שם, טלפון, תאריך, שעה ומקום ההספקה. זה הכל." },
  { title: "סוגרים בווצאפ", text: "ההזמנה מגיעה ישר לטוטו, ואנחנו חוזרים אליכם לאישור ולתיאום התשלום." },
];

export default async function HomePage() {
  const menu = await getMenu();
  const featured = menu.items.filter((i) => i.featured);

  return (
    <>
      {/* hero: fills the first screen */}
      <Hero>
        <HeroIn>
          <div>
            <HeroLogo role="img" aria-label="TOTO Catering" />
            <Tags>
              <span>קייטרינג חלבי</span>·<span>כשר למהדרין</span>·<span>עכו והצפון</span>
            </Tags>
            <HeroTitle>
              האוכל עלינו, <em>המחמאות</em> עליכם
            </HeroTitle>
            <HeroSub>מגשי אירוח, סלטים, מאפים וקינוחים לכל אירוע. בוחרים באתר, ואנחנו חוזרים אליכם בווצאפ לסגירת ההזמנה.</HeroSub>
            <Actions>
              <LinkButton href="/menu" variant="white">
                לתפריט ולהזמנה
              </LinkButton>
              <SectionButton section="how" variant="ghost">
                איך זה עובד?
              </SectionButton>
            </Actions>
          </div>
          <Collage aria-hidden="true">
            <div className="ph ph-a">
              <CoverImage src="/img/hero.webp" alt="" fill priority sizes="(min-width:960px) 350px, 40vw" />
            </div>
            <div className="ph ph-b">
              <CoverImage src="/img/croissant.webp" alt="" fill priority sizes="(min-width:960px) 260px, 40vw" />
            </div>
            <div className="ph ph-c">
              <CoverImage src="/img/lemontart.webp" alt="" fill sizes="(min-width:960px) 300px, 40vw" />
            </div>
            <Sticker className="sticker">
              <Crown width={17} />
              טרי, מעוצב, מוכן להגשה
            </Sticker>
          </Collage>
        </HeroIn>
      </Hero>

      <Section id="how">
        <Wrap>
          <SectionHead>
            <Crown />
            <h2>מזמינים ב-3 צעדים</h2>
            <Muted sx={{ maxWidth: "52ch" }}>בלי טלפונים הלוך ושוב. בוחרים, שולחים, ואנחנו חוזרים אליכם לסגור את הפרטים.</Muted>
          </SectionHead>
          <Steps>
            {STEPS.map((s, i) => (
              <Step key={s.title}>
                <StepNum>{i + 1}</StepNum>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Step>
            ))}
          </Steps>
        </Wrap>
      </Section>

      <SectionTail>
        <Wrap>
          <SectionHead>
            <h2>מה בא לכם להגיש?</h2>
            <Muted>
              {menu.items.length} מנות ב-{menu.categories.length} קטגוריות, מהפתיחה ועד הקינוח.
            </Muted>
          </SectionHead>
          <Categories>
            {menu.categories.map((c) => (
              <CategoryLink key={c.id} href={`/menu#cat-${c.id}`}>
                <span className="ring">
                  <Image src={c.image} alt="" width={110} height={110} />
                </span>
                <b>{c.name}</b>
                <span className="count">{menu.items.filter((i) => i.categoryId === c.id).length} מנות</span>
              </CategoryLink>
            ))}
          </Categories>
        </Wrap>
      </SectionTail>

      <PinkSection>
        <Wrap>
          <SectionHead>
            <Crown white />
            <h2 style={{ color: "#fff" }}>הכי מוזמנים אצלנו</h2>
            <p>המגשים שחוזרים כמעט לכל אירוע.</p>
          </SectionHead>
          <DishGrid>
            {featured.map((it) => (
              <MenuCard key={it.id} item={it} />
            ))}
          </DishGrid>
          <Center>
            <LinkButton href="/menu" variant="white">
              לכל התפריט
            </LinkButton>
          </Center>
        </Wrap>
      </PinkSection>

      <Section id="kosher">
        <KosherGrid>
          <div>
            <h2>כשר למהדרין</h2>
            <Muted sx={{ maxWidth: "44ch" }}>כל המנות חלביות או פרווה, בהשגחת הרבנות הראשית עכו ובהשגחת בד״ץ. תעודות הכשרות זמינות לפי בקשה.</Muted>
          </div>
          <Seals>
            {[
              ["seal-dairy", "תעודת כשרות חלבי, הרבנות הראשית עכו"],
              ["seal-badatz", "השגחת בד״ץ"],
              ["seal-parve", "תעודת כשרות פרווה, הרבנות הראשית עכו"],
            ].map(([src, alt]) => (
              <Seal key={src}>
                <Image src={`/img/${src}.png`} alt={alt} width={288} height={360} />
              </Seal>
            ))}
          </Seals>
        </KosherGrid>
      </Section>

      <SectionTail id="contact">
        <ContactGrid>
          <EventsPanel>
            <div>
              <h3>לאירועים עם בופה מעוצב</h3>
              <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>בריתות, בר ובת מצווה, ימי הולדת, אירועי חברה ושבתות. {SITE.serviceArea}.</p>
              <ul>
                {["הזמנה באתר בכמה דקות", "אישור ותיאום אישי בווצאפ", "משלוח עד מקום האירוע"].map((t) => (
                  <li key={t}>
                    <Crown width={16} white />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </EventsPanel>
          <ContactPanel>
            <h3>דברו איתנו</h3>
            <Muted>{SITE.address}</Muted>
            <Phone href={`tel:${SITE.phoneDisplay.replace(/-/g, "")}`} dir="ltr">
              {SITE.phoneDisplay}
            </Phone>
            <Muted sx={{ mt: 1.25 }}>שיחה, הודעה או ווצאפ. נשמח לעזור בבחירת הכמויות.</Muted>
          </ContactPanel>
        </ContactGrid>
      </SectionTail>
    </>
  );
}
