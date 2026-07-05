# LOGIA — אוצר הכתבים הגנוזים

## 📖 Project Overview

מיזם ארכיון דיגיטלי פתוח של כתבים חיצוניים, גנוזים ואפוקריפיים בעברית — שחזורים, תרגומים וביאורים של טקסטים שנדחקו אל שולי המסורת ועתה שבים אל שפת המוצא.

ניווט כפול: לפי שפת מקור (8 שפות) ולפי דמות מקראית מייחסת.

**Production:** https://logos-alex.github.io/Source/
**Repository:** GitHub (with GitHub Actions auto-deploy)

---

## 🏗️ Site Architecture

```
src/
├── _data/
│   ├── figures.json            # figure keys → Hebrew names
│   ├── languages.json          # language keys → Hebrew names
│   ├── sources-catalog.json    # Full catalog of books with metadata
│   ├── figureCatalogKeys.json  # List of active figure keys
│   ├── buildInfo.cjs           # Git commit/branch/date (auto at build time)
│   ├── site.json               # Site metadata (pathPrefix, origin, fonts, thirdParty)
│   └── updates.json            # Changelog entries for /updates/ page
├── _includes/
│   ├── base.njk                # Main layout (header, nav, footer, dark mode)
│   ├── text-page.njk           # Chapter display (reading progress, parallel layout, ToC, Disqus)
│   ├── book-index.njk          # Book listing (version groups)
│   ├── category-page.njk       # Book intro page (TOC, start-reading CTA, Disqus)
│   ├── content-page.njk        # Layout for standalone pages (about, methodology, etc.)
│   ├── breadcrumbs.njk         # Navigation path component
│   ├── disqus.njk              # Disqus comments (direct embed)
│   └── logo-mark.njk           # SVG logo mark
├── assets/
│   ├── style.css               # All styles (dark mode, mobile, print, RTL, tables)
│   ├── js/site.js              # Theme toggle, reading mode, parallel toggle, search, nav
│   ├── fonts/                  # Self-hosted: Frank Ruhl Libre, Noto Serif Hebrew, EB Garamond
│   ├── og-image.png            # Open Graph image (1200×630)
│   ├── favicon.svg / .ico / .png / apple-touch-icon
│   └── manifest.json           # PWA manifest
├── texts/
│   ├── hebrew/sefer-zerubbabel/        # 8 pages
│   ├── slavic/apocalypse-abraham/      # parent index + a/ (21 pages) + b/ (25 pages)
│   ├── aramaic/
│   │   ├── apoc-daniel-syriac/         # 32 pages (parallel Syriac+Hebrew)
│   │   ├── young-daniel-syriac/        # 7 pages (parallel)
│   │   ├── clementine-r1/              # 61 pages (parallel)
│   │   ├── clementine-r2/              # 76 pages (parallel)
│   │   ├── clementine-r3/              # 55 pages (parallel)
│   │   ├── clementine-r4/              # 3 pages (parallel)
│   │   ├── clementine-homilies/        # 23 pages (parallel)
│   │   ├── sichat-moshe/               # 8 pages (parallel)
│   │   ├── chazon-ezra-suri/           # 10 pages (parallel)
│   │   ├── enoch-qumran-aramaic/       # 8 pages
│   │   └── tsavaat-yeshua/             # index only (comingSoon)
│   ├── arabic/
│   │   ├── ketav-almagal/              # 34 pages
│   │   ├── ketav-almagal-nusach-b/     # 24 pages
│   │   ├── chazon-kifa-laklemis/       # 57 pages
│   │   ├── glia-de-klemis/             # 16 pages
│   │   ├── chazon-daniel-aravi/        # 7 pages
│   │   └── chazon-daniel-kopti/        # 8 pages
│   ├── greek/
│   │   ├── apokalypsis-esdras/         # 7 pages
│   │   ├── maale-yeshayahu/            # 7 pages
│   │   ├── sefer-hanoch-a/             # 10 pages
│   │   └── clementine-homilies-greek/  # 105 pages
│   ├── armenian/
│   │   ├── vision-daniel-armenian/     # 5 pages
│   │   └── vision-enoch-righteous-armenian/ # 8 pages
│   ├── geez/clementos/                # 9 pages
│   └── latin/
│       ├── chazon-ezra-sofer/         # 8 pages
│       ├── maasei-timotheos/          # 5 pages
│       └── klalot-hashvatim/          # 14 pages
├── by-figure/                 # Figure index pages (abraham, daniel, enoch, ezra, isaiah, zerubbabel, talmidei-yeshua)
├── scripts/                   # CI/verify scripts (16 verifiers)
├── index.njk                  # Homepage
├── texts.njk                  # Source directory (8 languages)
├── by-figure.njk              # Figure collection pages (pagination)
├── search.njk                 # Pagefind search page
├── updates.njk                # Updates/changelog page
├── updates-feed.njk           # RSS feed (/updates/feed.xml)
├── sitemap.njk                # XML sitemap (717 URLs)
├── about.njk                  # About page
├── methodology.njk            # Translation methodology
├── contact.njk                # Contact page
├── privacy.njk                # Privacy policy
├── license.njk                # CC0 license info
├── 404.md                     # Error page
├── robots.txt                 # Robots
└── _redirects                 # Netlify-style redirects (sitemap, RSS content-type)
```

---

## 🔧 Key Technologies

- **Generator:** Eleventy 3.1.6
- **Template Language:** Nunjucks (`markdownTemplateEngine: "njk"`, `htmlTemplateEngine: "njk"`)
- **Styling:** CSS with CSS variables (RTL, dark mode, print, WCAG AA contrast)
- **Fonts:** Self-hosted Frank Ruhl Libre (Hebrew) + EB Garamond (Latin display) + Noto Serif Hebrew (fallback)
- **pathPrefix:** `/Source/` (set in site.json, used in .eleventy.js)
- **Search:** Pagefind (runs after build, indexes 661 pages, 49,215 words)
- **Comments:** Disqus (direct embed, hebrew-aramaic-sources)
- **Analytics:** Google Analytics + Microsoft Clarity (direct load)
- **Translate:** Google Translate (button-triggered)
- **Deploy:** GitHub Actions → GitHub Pages

---

## ⚙️ Custom Filters in .eleventy.js

| Filter | Purpose |
|---|---|
| `renderMarkdownInline(text)` | Processes `**bold**`, `*italic*`, `` `code` ``, `---`→`<hr>`, `[text](url)` for YAML note fields |
| `renderNoteRefs(html)` | Renders inline markdown + converts `[N]` → `<sup>` footnote refs |
| `findIndexByUrl(items, url)` | Finds index of current page in array |
| `findCollectionItemByUrl(items, url)` | Finds collection item by URL |
| `displayBookTitle(item)` | Human-readable book title |
| `bookPages(items, url, book, includeIndex=true)` | Pages in same book, sorted by pageNumber |
| `toHebrewNumeral(num)` | Converts number to Hebrew letters (א, ב, ...) |
| `usesHebrewChapterTitles(book)` | Whether book uses parallel layout (from catalog) |
| `chapterDisplayTitle(item, book)` | Human-readable chapter title for nav |
| `normalizeBookTitle(value)` | Cleans up book titles for display |

---

## 📊 Content Statistics (current)

- **Total HTML pages built:** 720
- **Sitemap URLs:** 717
- **Pagefind indexed pages:** 661 (49,215 words)
- **Books with chapters:** 25 (across 8 source languages)
- **Books in index-only/coming-soon:** 1 (tsavaat-yeshua)
- **Source languages:** Hebrew, Slavic, Aramaic, Arabic, Greek, Armenian, Geez, Latin
- **Figure categories:** 7 (Abraham, Daniel, Enoch, Ezra, Isaiah, Zerubbabel, Talmidei Yeshua)
- **CI verification scripts:** 16 (all pass)

**מקור נתונים מומלץ:** `docs/content-status-he.md` (נוצר ע״י `npm run report:content`)

---

## 🎨 Color Scheme

### Light Mode (Default)
- Background: `#FAF6EE` (Warm ivory)
- Text: `#1C1813` (Deep ink)
- Accent: `#7C6233` (Antique bronze — WCAG AA compliant)
- Accent 2: `#A85C3C` (Faded terracotta)
- Border: `#D8C9A8` (Soft gold)

### Dark Mode
- Background: `#100D09` (Deep midnight)
- Text: `#EFE7D5` (Warm cream)
- Accent: `#C9A35D` (Antique gold)
- Accent 2: `#D88B5F` (Warm terracotta)

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

**Important:** `_site/` ו-`node_modules/` הן תוצרי build; לא עורכים אותן ידנית.

---

## 📝 Content Guidelines

- All UI/navigation in Hebrew (RTL layout)
- Academic/scholarly tone
- Editorial sacred-modern aesthetic (ivory/bronze/terracotta)
- **CRITICAL**: Never rewrite or fabricate source text
- Parallel layout for Aramaic books: split at `<h3>תרגום עברי</h3>` or `<hr>`
- Frontmatter required for chapter pages: `title`, `book`, `pageNumber`, `source`, `figure`, `permalink`, `tags`
- Frontmatter required for index pages: `title`, `book`, `source`, `figure`, `permalink`
- `tags` must include `texts` for sitemap inclusion
- Notes in YAML `notes:` block support inline markdown (`**bold**`, `*italic*`, `---`→`<hr>`)

---

## 🔍 npm Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server on port 5000 |
| `npm run build` | Full build (Eleventy + Pagefind) |
| `npm run ci:verify` | Run all 16 verify scripts + build + Pagefind |
| `npm run check:frontmatter` | Verify frontmatter completeness (including tags) |
| `npm run check:pathprefix` | Verify path prefix in built HTML |
| `npm run check:catalog` | Verify catalog consistency |
| `npm run check:built-links` | Verify all internal links resolve |
| `npm run check:third-party` | Verify third-party service controls |
| `npm run new:chapter` | Helper to create a new chapter file |
| `npm run report:content` | Content status report → docs/content-status-he.md |

---

**Last Updated:** June 25, 2026
**Status:** ✅ All 16 CI checks pass · 717 URLs in sitemap · WCAG AA compliant
