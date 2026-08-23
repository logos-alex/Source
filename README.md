# אפוקריפה — התנ"ך האפוקריפי

מיזם ארכיון דיגיטלי פתוח של כתבים חיצוניים, גנוזים ואפוקריפיים בעברית — שחזורים, תרגומים וביאורים של טקסטים שנדחקו אל שולי המסורת ועתה שבים אל שפת המוצא. החותם היווני ΛΟΓΙΑ ("אמרות") נשמר כסמל ההוצאה.

- **אתר חי:** https://logos-alex.github.io/Source/
- **מסמכי הכוונה:** `docs/PROJECT-MANIFEST.md`

## מצב המאגר (אוגוסט 2026)

שלושה חיבורים פעילים בטקסט מלא, לצד 27 חיבורים נוספים הרשומים בקטלוג בהכנה:

| חיבור פעיל                                | מקור                              | היקף                                                 |
| ----------------------------------------- | --------------------------------- | ---------------------------------------------------- |
| **חזון אברהם**                            | סלאבית (שלושה נוסחים: א', ב', ג') | 17 פרקים לכל נוסח + נספחים, טבלת הקבלה ותצוגה מקבילה |
| **מעשה יצחק**                             | ערבית (BnF Arabe 5072)            | 4 פרקים + הערות נוסח                                 |
| **שיחת משה (תשיעיתא דמשה גביא בנביאותא)** | סורית                             | 6 פרקים + 2 נספחים, תצוגה מקבילה סורית־עברית         |

| מדד                      |                     ערך |
| ------------------------ | ----------------------: |
| חיבורים רשומים בקטלוג    |                      30 |
| חיבורים פעילים בטקסט מלא |                       3 |
| פרקי תוכן                |                      66 |
| מילים (בערך)             |                 ~17,900 |
| שפות מקור בקטלוג         |                       8 |
| דמויות מקראיות בקטלוג    | 9 (+ חטיבת תלמידי ישוע) |
| חיבורים עם תצוגה מקבילית |                       9 |
| חיבורים בסטטוס "בקרוב"   |                      27 |

### חיבורים בקטלוג לפי שפת מקור

| שפה      | מספר חיבורים | דוגמאות                                                 |
| -------- | -----------: | ------------------------------------------------------- |
| aramaic  |           11 | sichat-moshe, clementine-r1..r4, apoc-daniel-syriac     |
| arabic   |            7 | maase-yitzchak, ketav-almagal, chazon-daniel-aravi      |
| greek    |            4 | apokalypsis-esdras, maale-yeshayahu, sefer-hanoch-a     |
| latin    |            3 | chazon-ezra-sofer, maasei-timotheos, klalot-hashvatim   |
| armenian |            2 | vision-daniel-armenian, vision-enoch-righteous-armenian |
| slavic   |            1 | apocalypse-abraham (פעיל)                               |
| hebrew   |            1 | sefer-zerubbabel                                        |
| geez     |            1 | clementos                                               |
| **סה"כ** |       **30** |                                                         |

### חיבורים עם תצוגה מקבילית מתוכננת (9)

apoc-daniel-syriac, young-daniel-syriac, clementine-r1, clementine-r2, clementine-r3, clementine-r4, clementine-homilies, sichat-moshe, chazon-ezra-suri

---

## מה מוכן עכשיו

### תשתית טכנית מלאה

- **מנוע אתר:** Eleventy 3.x (Nunjucks templates) — 16 בדיקות CI, כולן עוברות
- **קטלוג:** `src/_data/sources-catalog.json` עם 29 חיבורים, 8 שפות, 8 דמויות, 9 עם `parallelLayout: true`
- **תבניות Nunjucks:** `base.njk`, `text-page.njk`, `category-page.njk`, `content-page.njk`, `breadcrumbs.njk`, `disqus.njk`, `logo-mark.njk`
- **עיצוב:** CSS מלא עם CSS variables — RTL, מצב כהה/בהיר, מערכת מרחבית, z-index scale מסודר, תמיכה ב-`prefers-reduced-motion`
- **פונטים:** Self-hosted — Frank Ruhl Libre (300/400/700), Noto Serif Hebrew (300/400/700), EB Garamond (לוגו לטיני) — WOFF2 + TTF, עם `unicode-range` לחלוקת טעינה
- **חיפוש:** Pagefind (סטטי) — אינדקס נבנה אוטומטית ב-`npm run build`
- **תגובות:** Disqus (lazy-loaded, opt-in)
- **דפי תוכן:** about, license (CC0), privacy (GDPR), contact
- **נכסי מותג:** og-image, favicon (svg/ico/192/512), apple-touch-icon, manifest.json (PWA מלא)
- **תכונות UX:** header-search, footer-nav מעוצב, back-to-top, font-controls (A-/A/A+/A++), RSS feed, reading-progress bar, reading-mode, parallel-toggle

### סקריפטים

- **CI:** `npm run ci:verify` מריץ 16 בדיקות אימות (frontmatter, catalog, permalinks, built-links, placeholders, third-party-controls, ועוד)
- **יצירת פרקים:** `npm run new:chapter -- <lang>/<book> <pageNumber> "<title>" <source> <figure> [version]`
- **דוחות:** `npm run report:content` — דוח אוטומטי של מצב התוכן
- **מודולים משותפים:** `scripts/_lib/` (walk.mjs, frontmatter.mjs, catalog.mjs) — לשימוש בסקריפטים חדשים

---

## מה חסר

27 חיבורים בקטלוג עדיין בסטטוס "בקרוב" ("החיבור בהכנה. הטקסט יתווסף בהמשך.") עם `comingSoon: true`.

כדי להפוך חיבור לפעיל יש ל:

1. כתוב `index.md` עם מבוא מלא (300–600 מילה)
2. צור קבצי `page-1.md`, `page-2.md`, … עם הפרקים
3. צור `main.json` עם `{"version": "main"}`
4. שנה `comingSoon: false` ב-`index.md`
5. הרץ `npm run ci:verify`

---

## כיצד לתרום תוכן

### הוספת פרק חדש לחיבור קיים

```bash
npm run new:chapter -- <lang>/<book> <pageNumber> "<title>" <source> <figure> [version]
# Example:
npm run new:chapter -- aramaic/sichat-moshe 9 "פרק ט" aramaic moshe main
```

הסקריפט יוצר קובץ עם frontmatter תקין (`layout`, `title`, `book`, `source`, `figure`, `pageNumber`, `version`, `permalink`, `tags`).

### עריכת פרק קיים

1. פתח את הקובץ הרלוונטי ב-`src/texts/<lang>/<book>/page-N.md`
2. ערוך את הטקסט (markdown)
3. הוסף הערות שוליים ב-frontmatter תחת `notes:`
4. הרץ `npm run ci:verify` לפני commit
5. הרץ `npm run dev` לתצוגה מקומית

### מבנה frontmatter נדרש

```yaml
---
layout: text-page
title: "פרק א"
book: sichat-moshe
source: aramaic
figure: moshe
pageNumber: 1
version: main
permalink: /texts/aramaic/sichat-moshe/page-1/
tags:
  - texts
  - aramaic
  - moshe
description: "תיאור קצר של תוכן הפרק (מופיע ב־meta description ובתצוגת חיפוש)."
notes:
  - "**הערה 1** — ביאור מילולי."
  - '**הערה 2** — הקבלה לחז"ל.'
---
```

### הוספת חיבור חדש

1. צור תיקייה: `src/texts/<lang>/<book-id>/`
2. צור `index.md` עם מבוא מלא (300+ מילים) ו-`comingSoon: true` בעת ההכנה, `false` בעת השלמה
3. צור קבצי `page-1.md`, `page-2.md`, … עם הפרקים
4. צור `main.json` עם `{"version": "main"}`
5. הוסף רשומה ל-`src/_data/sources-catalog.json`:
   ```json
   {
     "id": "new-book-id",
     "title": "שם החיבור בעברית",
     "lang": "aramaic",
     "description": "תיאור קצר.",
     "figure": "moshe",
     "parallelLayout": false
   }
   ```
6. הרץ `npm run ci:verify` — אם עבר, החיבור מוכן.

### תצוגה מקבילית (מקור + תרגום)

חיבורים עם `parallelLayout: true` בקטלוג מציגים שתי עמודות. בכל פרק:

```markdown
#### מקור סורי

[טקסט המקור בתעתיק עברי]

### תרגום עברי

[תרגום עברי]
```

התבנית מפצלת אוטומטית על `### תרגום עברי` ומציגה את המקור מימין והתרגום משמאל.

---

## סטנדרטי תוכן

### מבוא (index.md)

מבוא איכותי כולל:

- **רקע היסטורי** — מתי, היכן, על־ידי מי נכתב החיבור (לפי המסורת או המחקר)
- **מקורות הנוסח** — כתבי־יד, מהדורות, תרגומים קודמים
- **מבנה החיבור** — חלוקה לפרקים, חלקים, נושאים מרכזיים
- **מעמד במסורת** — יחס חז"ל, הכנסייה, הקאנון
- **עקרונות התרגום** — מתי מילולי, מתי משוחרר, החלטות עריכה מרכזיות
- **מראי מקום** — לפחות 3־5 מקורות אקדמיים מרכזיים

אורך יעד: **300–600 מילים**.

### פרק (page-N.md)

פרק איכותי כולל:

- **נוסח המקור** (בחיבורי parallel) — בתעתיק עברי מדויק
- **תרגום עברי** — בלשון קלאסית מתונה, מילולי ככל האפשר
- **הערות שוליים** (`notes:` בפרונטמטר) — לפחות הערה אחת לכל פסוק/פסקה עם:
  - ביאור מילולי (מונחים זרים)
  - הקבלה למקרא
  - הקבלה לחז"ל / רמב"ם / רמב"ן
  - הקבלה בין־דתית (נצרות, אסלאם)
  - רקע היסטורי

אורך יעד: **300+ מילים לפרק** (למעט פרקים קצרים מטבעם, כמו קללות).

### תיאור (`description` בפרונטמטר)

תיאור קצר (עד 180 תווים) של תוכן הפרק. מופיע ב-meta description, בתצוגת חיפוש Pagefind, ובשיתוף חברתי. אם חסר — המערכת תשתמש בתיאור ברירת מחדל גנרי.

---

## טכנולוגיות

- **מנוע אתר:** Eleventy 3.x (Nunjucks templates)
- **עיצוב:** CSS עם CSS variables — RTL, מצב כהה/בהיר, מערכת מרחבית
- **פונטים:** Self-hosted — Frank Ruhl Libre (עברית, WOFF2) + Noto Serif Hebrew (גיבוי) + EB Garamond (לוגו לטיני)
- **חיפוש:** Pagefind (סטטי)
- **פריסה:** GitHub Pages דרך GitHub Actions
- **תגובות:** Disqus (lazy-loaded)
- **רישיון:** CC0 1.0 (נחלת הכלל)

## הרצה מקומית

```bash
npm install
npm run dev        # שרת פיתוח ב-port 5000
npm run build      # בנייה מלאה + מיניפיקציה + Pagefind
npm run ci:verify  # כל 16 בדיקות האימות
```

## מבנה הפרויקט

```
src/
├── _data/              # קטלוגים (sources-catalog, figures, languages, updates)
├── _includes/          # תבניות Nunjucks
├── assets/             # פונטים, CSS, JS, תמונות
├── texts/              # כתבים לפי שפת מקור (8 שפות, 30 חיבורים — 3 פעילים)
├── by-figure/          # כתבים לפי דמות (9 דמויות + חטיבת תלמידי ישוע)
├── about.njk, license.njk, contact.njk, privacy.njk
├── index.njk           # דף הבית
└── search.njk, updates.njk, sitemap.njk

scripts/
├── _lib/               # מודולים משותפים (walk, frontmatter, catalog)
├── verify-*.mjs        # 15 בדיקות אימות
├── ci-verify.mjs       # מריץ את כל הבדיקות
├── new-chapter.mjs     # יצירת פרק חדש
└── report-content-status.mjs  # דוח מצב תוכן

lib/
└── display-book-title.cjs  # פילטר כותרת תצוגה
```

## בדיקות איכות (CI)

הפרויקט כולל 16 בדיקות אימות אוטומטיות שרצות בכל PR ובכל push:

```bash
npm run ci:verify
```

בדיקות עיקריות:

- `verify-frontmatter` — סכמת פרונטמטר מלאה
- `verify-catalog-consistency` — התאמה בין קטלוג לפרונטמטר
- `verify-text-structure` — רצף מספור פרקים
- `verify-built-links` — קישורים פנימיים תקינים
- `verify-intro-navigation` — ניווט מבוא→פרק ראשון
- `verify-placeholders` — סמני TODO/FIXME
- `verify-third-party-controls` — תקינות אנליטיקס/Disqus/translate
- `verify-display-book-titles` — כותרות תצוגה עקביות

הערה: ה-CI בודק **עקביות מבנית** בלבד. הוא אינו בודק נוכחות תוכן טקסטואלי — לכן placeholder עם `comingSoon: true` עובר. לדוח אמיתי של מצב התוכן, הרץ `npm run report:content`.

## רישיון

התכנים באתר מופצים בנחלת הכלל (**CC0 1.0**) — ניתן להשתמש, לצטט ולשנות בחופשיות.

## יצירת קשר

לשאלות, הצעות או תרומות תוכן — ראה עמוד [צור קשר](src/contact.njk) באתר, או פתח Issue ב-GitHub.
