import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import type { Metadata } from "next";
import { MenuHead, Prose } from "@/components/home/site-styles";
import { PinkBand } from "@/components/ui/primitives";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "הצהרת נגישות" };

const UPDATED = "12 באוקטובר 2026";

const AccessibilityPage = () => (
  <>
    <PinkBand>
      <MenuHead>
        <Box component="h1">הצהרת נגישות</Box>
        <Box component="p">עודכנה ב־{UPDATED}</Box>
      </MenuHead>
    </PinkBand>

    <Prose>
      <Box component="section">
        <Box component="h2">מחויבות לנגישות</Box>
        <Box component="p">
          {SITE.name} רואה חשיבות במתן שירות שוויוני לכל הלקוחות, ופועלת כדי שהאתר יהיה נגיש לאנשים עם מוגבלות, בהתאם לחוק שוויון זכויות לאנשים
          עם מוגבלות ולתקנות הנגישות לשירות.
        </Box>
      </Box>

      <Box component="section">
        <Box component="h2">רמת הנגישות באתר</Box>
        <Box component="p">
          האתר הונגש בהתאם להמלצות התקן הישראלי (ת״י 5568) לנגישות תכנים באינטרנט ברמה AA, המבוסס על הנחיות WCAG 2.0 של ארגון W3C. ההתאמות נבדקו
          בדפדפן Chrome.
        </Box>
        <Box component="p">בין ההתאמות שבוצעו:</Box>
        <Box component="ul">
          <Box component="li">ניווט מלא באמצעות המקלדת, עם סימון ברור של הרכיב שבפוקוס וקישור ״דילוג לתוכן הראשי״.</Box>
          <Box component="li">ניגודיות צבעים בין הטקסט לרקע בהתאם לתקן.</Box>
          <Box component="li">טקסט חלופי לתמונות בעלות תוכן, והסתרת תמונות קישוטיות מתוכנות הקראת מסך.</Box>
          <Box component="li">מבנה כותרות היררכי, תוויות לכל שדות הטופס והודעות שגיאה המוקראות בתוכנות הקראת מסך.</Box>
          <Box component="li">הודעות על פעולות (כמו הוספה לסל) ותוצאות חיפוש המוקראות בתוכנות הקראת מסך.</Box>
          <Box component="li">התאמה לטלפונים ולהגדלת התצוגה בדפדפן.</Box>
          <Box component="li">כיבוד הגדרת ״הפחתת תנועה״ של מערכת ההפעלה.</Box>
        </Box>
      </Box>

      <Box component="section">
        <Box component="h2">תפריט הנגישות</Box>
        <Box component="p">לחיצה על כפתור הנגישות בפינת המסך פותחת תפריט שבו אפשר להתאים את התצוגה:</Box>
        <Box component="ul">
          <Box component="li">הגדלת טקסט, עד 150%</Box>
          <Box component="li">ניגודיות גבוהה (רקע שחור, טקסט לבן וקישורים בצהוב)</Box>
          <Box component="li">גווני אפור</Box>
          <Box component="li">ריווח שורות ואותיות</Box>
          <Box component="li">הדגשת קישורים וכפתורים</Box>
          <Box component="li">גופן קריא</Box>
          <Box component="li">עצירת אנימציות</Box>
          <Box component="li">סמן עכבר גדול (במחשב)</Box>
        </Box>
        <Box component="p">ההגדרות נשמרות בדפדפן שלכם ונשארות פעילות גם בביקורים הבאים. כפתור ״איפוס״ מחזיר את התצוגה הרגילה.</Box>
      </Box>

      <Box component="section">
        <Box component="h2">חלקים שאינם בשליטתנו</Box>
        <Box component="p">
          קישורים לשירותים חיצוניים, כמו וואטסאפ, אינסטגרם, פייסבוק וטיקטוק, מובילים לאתרים של צד שלישי, ורמת הנגישות שלהם באחריותם. למרות מאמצינו,
          ייתכן שיימצאו באתר חלקים שטרם הונגשו במלואם. אם נתקלתם בבעיה, נשמח שתספרו לנו.
        </Box>
      </Box>

      <Box component="section">
        <Box component="h2">נגישות נקודת האיסוף</Box>
        {/* TODO(owner): describe the pickup point's physical access (step-free entrance, accessible parking, etc.). */}
        <Box component="p">
          נקודת האיסוף שלנו נמצאת ב{SITE.address}. לפרטים על הסדרי הנגישות במקום ולתיאום הגעה, פנו אלינו מראש ונשמח לסייע. אפשר גם לקבל את ההזמנה
          במשלוח עד מקום האירוע.
        </Box>
      </Box>

      <Box component="section">
        <Box component="h2">פניות בנושא נגישות</Box>
        <Box component="p">
          נתקלתם בקושי באתר או בשירות? נשמח לשמוע ולתקן. כדי שנוכל לטפל בפנייה, ציינו את העמוד, תיאור הבעיה ואת הדפדפן או הטכנולוגיה המסייעת שבה
          השתמשתם.
        </Box>
        <Box component="ul">
          <Box component="li">רכזת הנגישות: בעלת העסק, {SITE.name}</Box>
          <Box component="li">
            טלפון:{" "}
            <Link href={`tel:${SITE.phoneDisplay.replace(/-/g, "")}`} dir="ltr">
              {SITE.phoneDisplay}
            </Link>
          </Box>
          <Box component="li">
            וואטסאפ:{" "}
            <Link href={SITE.whatsappLink} target="_blank" rel="noopener">
              שליחת הודעה
            </Link>
          </Box>
          <Box component="li">
            דוא״ל: <Link href={`mailto:${SITE.email}`}>{SITE.email}</Link>
          </Box>
        </Box>
      </Box>
    </Prose>
  </>
);

export default AccessibilityPage;
