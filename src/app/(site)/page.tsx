import Box from "@mui/material/Box";
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
  { title: "ממלאים פרטים", text: "שם, טלפון, תאריך, שעה ומקום האספקה. זה הכול." },
  { title: "סוגרים בוואטסאפ", text: "ההזמנה מגיעה ישר לטוטו, ואנחנו חוזרים אליכם לאישור ולתיאום התשלום." },
];

const HomePage = async () => {
  const menu = await getMenu();
  const featured = menu.items.filter((i) => i.featured);

  return (
    <>
      <Hero>
        <HeroIn>
          <Box>
            <HeroLogo role="img" aria-label="TOTO Catering" />
            <Tags>
              <Box component="span">קייטרינג חלבי</Box>·<Box component="span">כשר למהדרין</Box>·<Box component="span">עכו והצפון</Box>
            </Tags>
            <HeroTitle>
              האוכל עלינו, <Box component="em">המחמאות</Box> עליכם
            </HeroTitle>
            <HeroSub>מגשי אירוח, סלטים, מאפים וקינוחים לכל אירוע. בוחרים באתר, ואנחנו חוזרים אליכם בוואטסאפ לסגירת ההזמנה.</HeroSub>
            <Actions>
              <LinkButton href="/menu" variant="white">
                לתפריט ולהזמנה
              </LinkButton>
              <SectionButton section="how" variant="ghost">
                איך זה עובד?
              </SectionButton>
            </Actions>
          </Box>
          <Collage aria-hidden="true">
            <Box className="ph ph-a">
              <CoverImage src="/img/hero.webp" alt="" fill priority sizes="(min-width:960px) 350px, 40vw" />
            </Box>
            <Box className="ph ph-b">
              <CoverImage src="/img/croissant.webp" alt="" fill priority sizes="(min-width:960px) 260px, 40vw" />
            </Box>
            <Box className="ph ph-c">
              <CoverImage src="/img/lemontart.webp" alt="" fill sizes="(min-width:960px) 300px, 40vw" />
            </Box>
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
            <Box component="h2">מזמינים ב-3 צעדים</Box>
            <Muted sx={{ maxWidth: "52ch" }}>בלי טלפונים הלוך ושוב. בוחרים, שולחים, ואנחנו חוזרים אליכם לסגור את הפרטים.</Muted>
          </SectionHead>
          <Steps>
            {STEPS.map((s, i) => (
              <Step key={s.title}>
                <StepNum>{i + 1}</StepNum>
                <Box component="h3">{s.title}</Box>
                <Box component="p">{s.text}</Box>
              </Step>
            ))}
          </Steps>
        </Wrap>
      </Section>

      <SectionTail>
        <Wrap>
          <SectionHead>
            <Box component="h2">מה בא לכם להגיש?</Box>
            <Muted>
              {menu.items.length} מנות ב-{menu.categories.length} קטגוריות, מהפתיחה ועד הקינוח.
            </Muted>
          </SectionHead>
          <Categories>
            {menu.categories.map((c) => (
              <CategoryLink key={c.id} href={`/menu#cat-${c.id}`}>
                <Box component="span" className="ring">
                  <Image src={c.image} alt="" width={110} height={110} />
                </Box>
                <Box component="b">{c.name}</Box>
                <Box component="span" className="count">{menu.items.filter((i) => i.categoryId === c.id).length} מנות</Box>
              </CategoryLink>
            ))}
          </Categories>
        </Wrap>
      </SectionTail>

      <PinkSection>
        <Wrap>
          <SectionHead>
            <Crown white />
            <Box component="h2" style={{ color: "#fff" }}>הכי מוזמנים אצלנו</Box>
            <Box component="p">המגשים שחוזרים כמעט לכל אירוע.</Box>
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
          <Box>
            <Box component="h2">כשר למהדרין</Box>
            <Muted sx={{ maxWidth: "44ch" }}>כל המנות חלביות או פרווה, בהשגחת הרבנות הראשית עכו ובהשגחת בד״ץ. תעודות הכשרות זמינות לפי בקשה.</Muted>
          </Box>
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
            <Box>
              <Box component="h3">לאירועים עם בופה מעוצב</Box>
              <Box component="p" style={{ fontSize: "1.1rem", fontWeight: 600 }}>בריתות, בר ובת מצווה, ימי הולדת, אירועי חברה ושבתות. {SITE.serviceArea}.</Box>
              <Box component="ul">
                {["הזמנה באתר בכמה דקות", "אישור ותיאום אישי בוואטסאפ", "משלוח עד מקום האירוע"].map((t) => (
                  <Box component="li" key={t}>
                    <Crown width={16} white />
                    {t}
                  </Box>
                ))}
              </Box>
            </Box>
          </EventsPanel>
          <ContactPanel>
            <Box component="h3">דברו איתנו</Box>
            <Muted>{SITE.address}</Muted>
            <Phone href={`tel:${SITE.phoneDisplay.replace(/-/g, "")}`} dir="ltr">
              {SITE.phoneDisplay}
            </Phone>
            <Muted sx={{ mt: 1.25 }}>שיחה, הודעה או וואטסאפ. נשמח לעזור בבחירת הכמויות.</Muted>
          </ContactPanel>
        </ContactGrid>
      </SectionTail>
    </>
  );
};

export default HomePage;
