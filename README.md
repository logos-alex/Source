# LOGIA — אוצר הכתבים הגנוזים

מיזם ארכיון דיגיטלי פתוח של כתבים חיצוניים, גנוזים ואפוקריפיים בעברית — שחזורים, תרגומים וביאורים של טקסטים שנדחקו אל שולי המסורת ועתה שבים אל שפת המוצא.

## זהות המותג

- **שם:** LOGIA — אוצר הכתבים הגנוזים
- **מקור השם:** ΛΟΓΙΑ — מיוונית, "דברים, אמרות, דברי חזיון"
- **סמל:** חותם מעגלי ובתוכו האות Λ (למדא) — מזכיר ספר פתוח, גמלון מקדש, והר-הדעת
- **רישיון:** נחלת הכלל (CC0 1.0) — ויתור מלא על זכויות יוצרים

## מפת האתר

| עמוד | תיאור |
|---|---|
| `/` | דף הבית עם הירו, אפיגרפים, ניווט מהיר |
| `/texts/` | כתבים לפי שפת מקור (8 שפות) |
| `/by-figure/` | כתבים לפי דמות מקראית |
| `/search/` | חיפוש באוצר (Pagefind) |
| `/updates/` | מה חדש — עדכוני תוכן ומערכת |
| `/updates/feed.xml` | פיד RSS |
| `/about/` | אודות המיזם, חזון, מתודולוגיה, תודות |
| `/license/` | רישיון CC0 והסבר שימוש |
| `/privacy/` | מדיניות פרטיות (GDPR) |
| `/contact/` | צור קשר |

## טכנולוגיות

- **מנוע אתר:** Eleventy 3.x (Nunjucks templates)
- **עיצוב:** CSS עם CSS variables — RTL, מצב כהה/בהיר, מערכת מרחבית
- **פונטים:** Frank Ruhl Libre (עברית) + Noto Serif Hebrew (גיבוי) + EB Garamond (לטינית)
- **חיפוש:** Pagefind
- **פריסה:** GitHub Pages דרך GitHub Actions
- **תגובות:** Disqus
- **אנליטיקס:** Google Analytics + Microsoft Clarity
- **PWA:** manifest.json + apple-touch-icon + theme-color

## תכונות UX

- ✅ חיפוש תמידי בכותרת
- ✅ פוטר עשיר עם ניווט מהיר
- ✅ כפתור "חזרה לראש" צף
- ✅ פקדי גודל גופן (A-/A/A+/A++) בדפי טקסט
- ✅ מצב קריאה (הסתרת כל הסחות)
- ✅ מצב כהה/בהיר + זיהוי העדפת מערכת
- ✅ רספונסיביות מלאה (mobile/tablet/desktop)
- ✅ נגישות (ARIA, skip-link, keyboard nav)
- ✅ RSS feed לעדכונים
- ✅ Sitemap.xml + robots.txt + JSON-LD structured data

## הרצה מקומית

```bash
npm install
npm run dev      # שרת פיתוח ב-port 5000
npm run build    # בנייה מלאה + Pagefind
```

## מבנה הפרויקט

```
src/
├── _data/              # נתוני מקור (catalogs, languages, figures, site, updates)
├── _includes/          # תבניות Nunjucks
│   ├── base.njk        # תבנית ראשית (header, footer, SEO, PWA)
│   ├── text-page.njk   # דף טקסט (כולל פקדי גופן)
│   ├── book-index.njk  # דף ספר
│   ├── category-page.njk
│   ├── breadcrumbs.njk
│   └── logo-mark.njk   # סמל SVG לשימוש חוזר
├── assets/
│   ├── style.css       # מערכת עיצוב מלאה
│   ├── js/site.js      # לוגיקת UI (theme, nav, search, font-size, back-to-top)
│   ├── fonts/          # פונטים self-hosted
│   ├── img/logo.svg
│   ├── favicon.svg / .ico / .png (192/512)
│   ├── apple-touch-icon.png
│   └── og-image.png    # תמונת שיתוף חברתי 1200×630
├── texts/              # כתבים לפי שפת מקור
├── by-figure/          # כתבים לפי דמות
├── about.md, license.md, privacy.md, contact.md  # דפי מערכת
├── manifest.json       # PWA manifest
├── index.njk           # דף הבית
├── search.njk
├── updates.njk
├── updates-feed.njk    # RSS feed
├── sitemap.njk
├── robots.txt
└── 404.md
```

## עדכון אחרון
2026 — מהפך זהות חזותית + UX/UI מלא + תשתית אקדמית-משפטית לפרסום.
