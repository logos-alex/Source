# Source

מאגר סטטי מבוסס Eleventy להצגת כתבים אפוקריפיים בעברית, עם ניווט לפי שפת מקור ולפי דמות מקראית.

## סטאק
- Eleventy 3
- Nunjucks templates
- Pagefind לחיפוש סטטי

## פקודות עיקריות
- `npm run dev` — פיתוח מקומי (`http://localhost:5000/Source/`)
- `npm run build` — בנייה מלאה + אינדוקס חיפוש
- `npm run ci:verify` — כל בדיקות האיכות והוולידציות
- `npm run report:content` — עדכון דוח סטטוס תוכן

## מבנה תוכן
- `src/texts/<source>/<book>/index.md` — מבוא/עמוד ראשי לספר
- `src/texts/<source>/<book>/page-*.md` — עמודי פרקים
- `src/_data/*.json` — קטלוג שפות/מקורות/דמויות

## הערות תפעול
- הפריסה מניחה `pathPrefix=/Source/` (חשוב ל־GitHub Pages).
- קיימת אזהרת npm סביב `http-proxy`; אם מופיעה מקומית, אפשר להריץ פקודות עם:
  - `env -u npm_config_http-proxy npm run ci:verify`
