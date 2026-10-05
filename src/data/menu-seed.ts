import type { Category, Menu, MenuItem, OptionGroup } from "@/lib/menu-types";

/**
 * TOTO dairy catering menu, 2026 edition (transcribed from the PDF flipbook).
 * This is the seed data; the admin area will later read and write the same shape from Supabase.
 * Images are temporary stock photos until TOTO's own dishes are photographed.
 */

const optionGroups: OptionGroup[] = [
  {
    id: "sandwich",
    legend: "בחרו מילויים",
    cta: "בחירת מילויים",
    min: 1,
    max: 2,
    choices: [
      { name: "חביתה" },
      { name: "סלט ביצים" },
      { name: "סלט טונה" },
      { name: "פטה וסלק" },
      { name: "בולגרית מלוחה וירקות טריים" },
      { name: "סלמון מעושן", extra: 45 },
    ],
  },
  {
    id: "tortilla",
    legend: "בחרו מילויים",
    cta: "בחירת מילויים",
    min: 1,
    max: 2,
    choices: [
      { name: "חביתה" },
      { name: "סלט ביצים" },
      { name: "סלט טונה" },
      { name: "בולגרית מלוחה וירקות טריים" },
    ],
  },
  {
    id: "focaccia",
    legend: "בחרו טעמים",
    cta: "בחירת טעמים",
    min: 1,
    max: 2,
    choices: [
      { name: "פסטו וגבינות" },
      { name: "פסטו וחציל" },
      { name: "זעתר" },
      { name: "פלפלים קלויים" },
      { name: "פלפלים קלויים, גבינות ושום" },
    ],
  },
  {
    id: "quiche",
    legend: "בחרו טעמים",
    cta: "בחירת טעמים",
    min: 1,
    max: 2,
    choices: [
      { name: "פטריות" },
      { name: "פלפלים" },
      { name: "בצל" },
      { name: "בטטה" },
      { name: "גבינות בלבד" },
      { name: "חצילים" },
    ],
  },
  {
    id: "borekas",
    legend: "בחרו טעמים",
    cta: "בחירת טעמים",
    min: 1,
    max: 2,
    choices: [{ name: "גבינות ופסטו" }, { name: "גבינות ורוטב פיצה" }],
  },
  {
    id: "shakshuka",
    legend: "בחרו סגנון",
    cta: "בחירת סגנון",
    min: 1,
    max: 1,
    choices: [{ name: "קלאסית" }, { name: "פיקנטית" }],
  },
];

const categories: Category[] = [
  { id: "starters", name: "מנות פתיחה", note: "לפי 10 סועדים", image: "beet" },
  { id: "finger", name: "Finger food", note: "מגשים של 20 יחידות", image: "cups" },
  { id: "hot", name: "מנות חמות", note: "לפי 10 סועדים", image: "salmon" },
  { id: "pasta", name: "פסטות", note: "מגש פסטה", image: "penne" },
  { id: "salads", name: "סלטים עשירים", note: "קערה 2.5 ליטר · 8–10 סועדים · 145 ₪", image: "greek" },
  { id: "pastry", name: "מאפים מלוחים", note: "מגשים מוכנים להגשה", image: "croissant" },
  { id: "desserts", name: "קינוחים", note: "מתוקים לסיום", image: "lemontart" },
];

const items: MenuItem[] = [];
const add = (categoryId: string, id: string, name: string, price: number, image: string, extra: Partial<MenuItem> = {}) =>
  items.push({ categoryId, id, name, price, image, ...extra });

add("starters", "eggplant-carpaccio", "קרפצ'ו חציל, טחינה וירקות", 145, "eggtahini");
add("starters", "beet-carpaccio", "קרפצ'ו סלק", 145, "beet", { badge: "מומלץ", featured: true });
add("starters", "pickles-platter", "פלטת מוחמצים מגוונת", 150, "pickles");
add("starters", "antipasti", "אנטי פסטי", 140, "antipasti");
add("starters", "vegetable-platter", "מגש ירקות", 135, "vegplatter");

add("finger", "eggplant-cups", "כוסות חציל, טחינה וירקות", 220, "cups", { unit: "20 יח'" });
add("finger", "tabbouleh-cups", "כוסות סלט טאבולה", 220, "cups", { unit: "20 יח'" });
add("finger", "greek-cups", "כוסות סלט יווני", 220, "greek", { unit: "20 יח'" });
add("finger", "eggplant-rolls", "חצילים מגולגלים במילוי גבינה וירקות צלויים", 180, "eggrolls", { unit: "20 יח'" });
add("finger", "salmon-puffs", "פחזניות שמנת מלוחה וסלמון מעושן", 250, "canape", { unit: "20 יח'", badge: "מומלץ" });

add("hot", "rosa-lasagna", "לזניה גבינות ברוטב רוזה", 250, "lasagna");
add("hot", "salmon-fillet", "נתח סלמון לצד ירקות שורש בתנור", 350, "salmon", { badge: "מומלץ", featured: true });
add("hot", "mushroom-stirfry", "מוקפץ פטריות", 220, "mushstir");
add("hot", "salmon-stirfry", "מוקפץ סלמון", 320, "salmon");
add("hot", "vegetable-stirfry", "מוקפץ ירקות", 220, "antipasti");
add("hot", "shakshuka", "שקשוקה", 200, "shak", { optionGroupId: "shakshuka", description: "קלאסית או פיקנטית" });
add("hot", "tanzia-couscous", "טנז'יה קוסקוס עם פירות יבשים", 260, "couscous", { description: "קוסקוס מתוק בתוספת פירות יבשים" });
add("hot", "couscous-soup", "קוסקוס עם מרק ירקות עשיר", 260, "couscous");
add("hot", "stuffed-eggplant", "חציל במילוי גבינות מוקרם", 220, "eggrolls");

add("pasta", "penne-mushroom", "פנה פטריות ברוטב שמנת עשיר", 150, "penne");
add("pasta", "penne-pesto", "פנה פסטו ברוטב שמנת עשיר", 150, "pesto");
add("pasta", "penne-rosa", "פנה רוזה ברוטב שמנת עשיר", 150, "spaghetti");
add("pasta", "penne-chestnut", "פנה ערמונים ברוטב שמנת עשיר", 150, "penne");
add("pasta", "kids-spaghetti", "ספגטי עגבניות שילדים אוהבים", 150, "spaghetti", { badge: "לילדים" });
add("pasta", "sweet-potato-ravioli", "רביולי בטטה", 170, "ravioli");
add("pasta", "cheese-ravioli", "רביולי גבינה", 170, "ravioli");

const salads: [string, string, string][] = [
  ["salad-green-cashew", "סלט ירוק, קשיו וחמוציות", "cups"],
  ["salad-cherry-mozzarella", "סלט שרי, בייבי מוצרלה וחומץ בלסמי", "greek"],
  ["salad-tabbouleh", "סלט טאבולה, עשבי תיבול וחמוציות", "cups"],
  ["salad-asian-cabbage", "סלט כרוב לבן אסייאתי, גרעינים וחמוציות", "caesar"],
  ["salad-greek", "סלט יווני, זיתים וזעתר", "greek"],
  ["salad-feta-sweet-potato", "סלט פטה ובטטה צלויה", "greek"],
  ["salad-feta-chips", "סלט פטה וציפס בטטה", "caesar"],
  ["salad-nicoise", "סלט ניסואז: טונה, ביצה קשה, תפו״א ומלפפון חמוץ", "antipasti"],
  ["salad-pasta-pesto", "סלט פסטה קרה, פסטו וירקות צלויים", "pesto"],
  ["salad-carrot-pecan", "סלט גזר חמוץ ופקאן סיני", "antipasti"],
  ["salad-tripoli-pickles", "סלט חמוצים טריפוליטאי", "pickles"],
  ["salad-root-vegetables", "סלט מיקס ירקות שורש חתוך גס", "vegplatter"],
  ["salad-lentils-tahini", "סלט עדשים ברוטב טחינה", "eggtahini"],
  ["salad-quinoa", "סלט קינואה, בטטה ומבחר ירקות", "antipasti"],
  ["salad-caesar", "סלט קיסר, פרמזן וקרוטונים", "caesar"],
  ["salad-rich-green", "סלט ירוק עשיר, קשיו וחמוציות (כל סוגי הירוקים)", "cups"],
];
salads.forEach(([id, name, image]) => add("salads", id, name, 145, image, { unit: "2.5 ליטר" }));

add("pastry", "croissants", "קרואסונים ממולאים", 180, "croissant", { unit: "12 יח'", optionGroupId: "sandwich", badge: "מומלץ", featured: true });
add("pastry", "bagel-sandwiches", "כריכי בייגל פיצוחים", 220, "bagel", { unit: "20 יח'", optionGroupId: "sandwich" });
add("pastry", "pink-sandwiches", "כריכים ורודים (סלק)", 250, "bagel", { unit: "15 יח'", optionGroupId: "sandwich" });
add("pastry", "black-sandwiches", "כריכים שחורים (חציל)", 250, "bagel", { unit: "15 יח'", optionGroupId: "sandwich" });
add("pastry", "fricassee", "פריקסה", 300, "pita", { unit: "20 יח'", description: "תפו״א, טונה, ביצה קשה, מלפפון חמוץ, אריסה וזיתים" });
add("pastry", "focaccias", "פוקצ'ות", 140, "focaccia", { unit: "20 יח'", optionGroupId: "focaccia" });
add("pastry", "tortillas", "טורטיות", 165, "tortilla", { unit: "20 חצאים", optionGroupId: "tortilla" });
add("pastry", "borekas-snails", "בורקס שבלולים", 220, "pinwheel", { unit: "25 יח'", optionGroupId: "borekas" });
add("pastry", "mini-pizzas", "פיציות", 145, "minipizza", { unit: "20 יח'" });
add("pastry", "quiche-base", "קיש בייס", 180, "quiche", { unit: "24 יח'", optionGroupId: "quiche" });
add("pastry", "mini-sabich", "פיתות מיני סביח", 180, "pita", { unit: "16 יח'", description: "חומוס, ביצה קשה, חציל וירקות" });
add("pastry", "handmade-pernot", "פרנות עבודת יד", 120, "focaccia", { unit: "2 יח' גדולות" });

add("desserts", "bachushot-tray", "מגש בחושות", 140, "brownie", { description: "מגיע פרוס" });
add("desserts", "crunch-tray", "מגש קראנץ' שחיתות", 140, "cakeslice", { description: "מגיע פרוס" });
add("desserts", "cookies-parve", "מיקס עוגיות פרווה", 230, "cookies");
add("desserts", "cookies-dairy", "מיקס עוגיות חלבי", 230, "cookies");
add("desserts", "lemon-tart", "טארט לימון ומרנג איטלקי", 220, "lemontart", { unit: "24 יח'", badge: "מומלץ", featured: true });
add("desserts", "caramel-nut-tart", "טארט פיצוחים מקורמל", 220, "chocotart", { unit: "24 יח'" });
add("desserts", "chocolate-souffle-tart", "טארט סופלה שוקולד", 220, "chocotart", { unit: "24 יח'" });
add("desserts", "pavlovas", "פבלובות קרם וניל ופירות יער", 220, "berrycake", { unit: "20 יח'" });
add("desserts", "sweet-blintzes", "בלינצ'ס מתוק במילוי גבינות", 140, "crepe", { unit: "16 חצאים" });
add("desserts", "chocolate-balls", "כדורי שוקולד שילדים אוהבים", 200, "choball", { unit: "35 יח'", description: "מקופלת" });
add("desserts", "dessert-cups", "קינוחי כוסות", 220, "dessertcup", { unit: "20 יח'" });
add("desserts", "cream-puffs", "פחזניות", 220, "creampuff", { unit: "20 יח'" });
add("desserts", "baklava-tray", "מגש בקלאווה", 220, "baklava");

export const menuSeed: Menu = { categories, items, optionGroups };
