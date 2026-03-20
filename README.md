# Source

מאגר סטטי מבוסס Eleventy להצגת כתבים אפוקריפיים בעברית, עם ניווט לפי שפת מקור ולפי דמות מקראית.

## סטאק
- Eleventy 3
- Nunjucks templates
- Pagefind לחיפוש סטטי

## פקודות עיקריות
- `npm run dev` — פיתוח מקומי (`http://localhost:5000/Source/`)
- `npm run build` — בנייה מלאה + אינדוקס חיפוש (דרך `npm exec`)
- `npm run ci:verify` — כל בדיקות האיכות והוולידציות
- `npm run report:content` — עדכון דוח סטטוס תוכן
- `npm run check:content-report` — בדיקה שהדוח השמור תואם לנתוני `src/texts/`

## מבנה תוכן
- `src/texts/<source>/<book>/index.md` — מבוא/עמוד ראשי לספר
- `src/texts/<source>/<book>/page-*.md` — עמודי פרקים
- `src/_data/*.json` — קטלוג שפות/מקורות/דמויות

## מדיניות דוח סטטוס התוכן
- המאגר **כן** מגרס את `docs/content-status-he.md`; זו המדיניות הרשמית כדי שהדוח יהיה זמין גם בלי להריץ build.
- אחרי כל שינוי שמוסיף/מסיר פרקים, משנה `book`/`source`, או מעדכן placeholder של תרגום, צריך להריץ `npm run report:content` ולצרף את ה-diff של הדוח לאותו commit.
- `npm run check:content-report` וגם ה-CI ייכשלו אם הקובץ השמור לא תואם לפלט העדכני של `scripts/report-content-status.mjs`.

## הערות תפעול
- הפריסה מניחה `pathPrefix=/Source/` (חשוב ל־GitHub Pages).
- מנהל החבילות הרשמי לפרויקט הוא `npm`, והמקור היחיד לפקודות ולנעילת תלויות הוא `package.json`/`package-lock.json` שבשורש המאגר.
- שרידי `Source/package.json` ו-`Source/package-lock.json` הוסרו כי לא הייתה להם צריכה פעילה; אם נדרש ההקשר ההיסטורי, הוא מתועד ב-`docs/project-audit-he.md`.
- אם סביבת העבודה כוללת proxy vars של npm, מומלץ להריץ פקודות עם ניקוי משתני proxy לפני `npm ci`/`npm run`.
