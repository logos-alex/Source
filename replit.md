# Hebrew Digital Archive - Eleventy 3.1.2

## 📖 Project Overview

A static site hosting translations and scholarly commentary of ancient apocalyptic texts.
Dual navigation by source language (Hebrew/Slavic/Aramaic/Arabic/Geez/Latin) and biblical figures.

**Production:** https://logos-alex.github.io/Source/
**Repository:** GitHub (with GitHub Actions auto-deploy)

---

## 🏗️ Site Architecture

```
src/
├── _data/
│   ├── figures.json          # figure keys → Hebrew names
│   ├── sources.json          # source keys → Hebrew names
│   ├── languages.json        # language keys → Hebrew names (used in text-page.njk)
│   ├── sources-catalog.json  # Full catalog of books with metadata
│   ├── figureCatalogKeys.json # List of active figure keys
│   ├── build-info.js         # Git commit/branch/date (auto at build time)
│   └── site.json             # Site metadata (pathPrefix, origin, etc.)
├── _includes/
│   ├── base.njk              # Main layout (dark mode, breadcrumbs, nav)
│   ├── text-page.njk         # Text display (reading progress, parallel layout, ToC, Disqus)
│   ├── book-index.njk        # Book listing
│   ├── category-page.njk     # Category/language page
│   ├── breadcrumbs.njk       # Navigation path component
│   └── mobile-menu.njk       # Mobile nav
├── assets/
│   └── style.css             # All styles (dark mode, mobile, print, RTL)
├── texts/
│   ├── arabic/sefer-megilot/ # 34 pages
│   ├── aramaic/
│   │   ├── apoc-daniel-syriac/  # 31 pages (parallel Aramaic+Hebrew layout)
│   │   ├── young-daniel-syriac/ # 5 pages
│   │   └── tsavaat-yeshua/      # index only
│   ├── geez/clementos/       # 17 pages
│   ├── hebrew/sefer-zerubbabel/ # 7 pages
│   ├── latin/                # index only
│   └── slavic/apocalypse-abraham/
│       ├── a/                # 21 pages (Version A)
│       └── b/                # 25 pages (Version B)
├── by-figure/                # Figure index pages (abraham, daniel, zerubbabel, talmidei-yeshua)
├── scripts/                  # CI/verify scripts (all used in package.json)
├── index.njk                 # Homepage
├── texts.njk                 # Source directory
├── by-figure.njk             # Figure collection pages
├── search.njk                # Pagefind search page
├── updates.njk               # Updates/changelog page
├── sitemap.njk               # XML sitemap
└── 404.md                    # Error page
```

---

## 🔧 Key Technologies

- **Generator:** Eleventy 3.1.2
- **Template Language:** Nunjucks (`markdownTemplateEngine: "njk"`, `htmlTemplateEngine: "njk"`)
- **Styling:** CSS with CSS variables for theming (RTL, dark mode)
- **pathPrefix:** `/Source/` (set in site.json, used in .eleventy.js)
- **Search:** Pagefind (runs after build)
- **Deploy:** GitHub Actions → GitHub Pages

---

## ⚙️ Custom Filters in .eleventy.js

| Filter | Purpose |
|---|---|
| `findIndexByUrl(items, url)` | Finds index of current page in array |
| `bookPages(items, url, book, includeIndex=true)` | Pages in same book, sorted by pageNumber |
| `toHebrewNumeral(num)` | Converts number to Hebrew letters (א, ב, ...) |
| `chapterDisplayTitle(item, book)` | Human-readable chapter title for nav |

---

## 📊 Content Statistics (current)

- **Total pages built:** 149 HTML files (על בסיס ריצת `npm run ci:verify`)
- **Books עם פרקים:** Arabic (34), Aramaic Daniel (31), Slavic Abraham A (21), Slavic Abraham B (25), Hebrew (7), Aramaic Young Daniel (5)
- **Books במצב index-only:** Geez/clementos, Aramaic/tsavaat-yeshua, Latin
- **מקור נתונים מומלץ:** `docs/content-status-he.md` (נוצר ע״י `npm run report:content`)

---

## 🎨 Color Scheme

### Light Mode (Default)
- Background: `#f9f5e7` (Cream/Papyrus)
- Text: `#3D2B1F` (Brown-earth)
- Border: `#d4af37` (Gold)

### Dark Mode
- Background: `#1a1410` (Deep brown)
- Text: `#e8dcc8` (Light cream)
- Accents: `#d4af37` (Gold)

---

## 🚀 Deployment

**GitHub Actions auto-deploy on push to main:**
```bash
git add .
git commit -m "..."
git push origin main
```

Build command: `npm run build`
Output dir: `_site/`

**Important:** `_site/` ו-`dist/` הן תוצרי build; לא עורכים אותן ידנית.

---

## 📝 Content Guidelines

- All UI/navigation in Hebrew (RTL layout)
- Academic/scholarly tone
- Traditional parchment aesthetics (papyrus/brown/gold)
- **CRITICAL**: Never rewrite or fabricate source text
- Parallel layout for Aramaic books: split at `<h3>תרגום עברי</h3>` or `<hr>`
- Frontmatter required: `title`, `book`, `pageNumber`, `source`, `figure`, `permalink`

---

## 🔍 npm Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server on port 5000 |
| `npm run build` | Full build (Eleventy + Pagefind) |
| `npm run ci:verify` | Run all verify scripts |
| `npm run check:frontmatter` | Verify frontmatter completeness |
| `npm run check:pathprefix` | Verify path prefix in built HTML |
| `npm run new:chapter` | Helper to create a new chapter file |
| `npm run report:content` | Content status report |

---

**Last Updated:** June 23, 2026
**Status:** ✅ Live on GitHub Pages — נתוני התוכן מתעדכנים דרך `npm run report:content`

---

## 📚 עדכון תוכן (יוני 2026)

מאז העדכון האחרון (מרץ 2026) נוספו לאתר החיבורים הבאים:

| חיבור | שפת מקור | דמות | עמודים |
|---|---|---|---|
| כתב אלמגאל | ערבית | תלמידי ישוע | 34 |
| חזון עזרא הסופר | לטינית | עזרא | 8 |
| קורפוס קלימנטיני (R1–R4 + Homilies) | ארמית | תלמידי ישוע | 218 |
| אפוקליפסיס אסדרס | יוונית | עזרא | 7 |
| מעלה ישעיהו | יוונית | ישעיהו | 7 |
| מעשי טימותיוס | לטינית | תלמידי ישוע | 5 |
| שיחת משה | ארמית | אברהם | 8 |
| ספר חנוך א' (שחזור מיוונית) | יוונית | חנוך | 10 |
| חנוך קומראן ארמית | ארמית | חנוך | 8 |
| חזון חנוך הצדיק (ארמנית) | ארמנית | חנוך | 8 |
| חזון דניאל (ארמני) | ארמנית | דניאל | 5 |

**סה"כ נכון ליוני 2026:** 25 חיבורים · 8 דמויות ייחוס · 8 שפות מקור · ~661 עמודי HTML

---

## 🔧 שיפורי תשתית (יוני 2026)

- הוספת permalink מפורש ל-24 עמודים שהיו חסרים (sefer-zerubbabel, clementos, vision-enoch-righteous-armenian)
- השלמת הניווט הראשי: הוספת עזרא, ישעיהו, ממקורות הישמעאלים ל-dropdown "לפי ייחוס"
- תיקון RSS feed: המרת pubDate לפורמט RFC-822 תקני (במקום "אפריל 2026")
- הוספת og:image:width/height/alt + twitter:image:alt לשיפור SEO חברתי
- sitemap.xml דינמי: lastmod מתעדכן אוטומטית מ-buildInfo, כולל את כל דפי החיבורים
- הסרת _redirects catch-all שהסתיר 404
- איחוד כפילות @media (max-width: 880px) ב-CSS
- העברת booksWithHebrewChapterTitles ל-catalog (parallelLayout: true ב-sources-catalog.json)
- הוספת preload ל-og-image + loading=lazy ל-favicons
- הרחבת verify-permalinks.mjs לתפוס permalinks חסרים
