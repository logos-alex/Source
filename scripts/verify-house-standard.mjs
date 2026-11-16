// ביקורת תקן הבית (docs/STANDARD-2026-11.md) — נכשלת אם ליקוי חוזר לאתר.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src/texts";
const errors = [];

// לשון עבודה שנשארה מגוף החיבור — אסורה
const WORKING_VOICE = [
  "כפי שסוכם",
  "כפי שהתבקש",
  "לבקשת המשתמש",
  "השארתי את",
  "תיקנתי ל",
  "העדפתי לתקן",
];
// מונחים אקדמיים שאסורים בגוף
const ACADEMIC = [
  "פסאודאפיגרף",
  "פסבדואפיגרף",
  "מהדורה ביקורתית",
  "מהדורה מדעית",
  "שחזור פילולוגי",
  "מראי מקום עיקריים",
];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.startsWith("page-") && name.endsWith(".md")) check(full);
  }
}

function check(file) {
  const raw = readFileSync(file, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const body = m ? raw.slice(m[0].length) : raw;

  // 1. אין גוש הערות בגוף הפרק
  if (/^#{2,3}\s*הערות/m.test(body)) {
    errors.push(
      `${file}: גוש הערות בגוף הפרק — ההערות מקומן ב-frontmatter (notes:)`,
    );
  }
  // 2. אין לשון עבודה
  for (const phrase of WORKING_VOICE) {
    if (body.includes(phrase))
      errors.push(`${file}: לשון עבודה בגוף — „${phrase}”`);
  }
  // 3. אין מונחים אקדמיים
  for (const term of ACADEMIC) {
    if (body.includes(term))
      errors.push(`${file}: מונח אקדמי בגוף — „${term}”`);
  }
  // 4. אין דילוג ברמות הכותרת
  const levels = [...body.matchAll(/^(#{2,4})\s/gm)].map((x) => x[1].length);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      errors.push(
        `${file}: דילוג ברמות הכותרת (h${levels[i - 1]} → h${levels[i]})`,
      );
      break;
    }
  }
}

walk(ROOT);

if (errors.length) {
  console.error("❌ house-standard violations:");
  for (const e of errors) console.error("  • " + e);
  process.exit(1);
}
console.log("House-standard verification passed.");
