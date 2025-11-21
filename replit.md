# Hebrew Digital Archive - Eleventy 3.1.2

## 📖 Project Overview

A static site hosting translations and scholarly commentary of ancient apocalyptic texts, with dual navigation by source language (Hebrew/Slavic/Latin/Aramaic) and biblical figures (Elijah/Jacob/Ezra/Isaiah).

**Production:** https://heb-sources.netlify.app/
**Repository:** GitHub (with Netlify auto-deploy)

---

## ✨ Recent Implementations (Latest Session)

### 1. **Breadcrumbs Navigation** ✅
- Displays contextual navigation path: Home > Source > Book > Page
- Dynamically parses `page.url` to show current location
- Accessible with ARIA labels

### 2. **Dark Mode Toggle** ✅
- Button (🌙/☀️) in top-left of header
- Saves preference in localStorage
- Complete color palette: brown/gold scheme for dark mode
- System preference detection fallback

### 3. **Mobile Responsive Design** ✅
- Breakpoint at 768px for tablets/phones
- Flexible navigation and reduced padding
- Touch-friendly link sizes (8px+ padding)

### 4. **Accessibility Features** ✅
- ARIA labels on nav and main role
- Clear focus states (2px solid outline)
- Color-scheme meta tag for system integration

### 5. **Reading Progress Bar** ✅
- Fixed bar at top showing scroll progress
- Gradient: brown to gold
- Auto-updates on scroll

### 6. **Print Optimization** ✅
- Black text on white background
- Hides navigation/comments/pagination
- Maintains page breaks for long texts
- Auto-expands link URLs in parentheses

### 7. **404 Error Page** ✅
- Hebrew interface at `/404.html`
- Suggests navigation to main sections
- Matches site aesthetics

---

## 🏗️ Site Architecture

```
src/
├── _data/
│   ├── figures.json          # elijah, jacob, ezra, isaiah → Hebrew names
│   ├── sources.json          # hebrew, slavic, aramaic, latin → Hebrew names
│   └── site.json             # Site metadata
├── _includes/
│   ├── base.njk              # Main layout with dark mode + breadcrumbs
│   ├── text-page.njk         # Text display with reading progress
│   ├── book-index.njk        # Book listing
│   ├── breadcrumbs.njk       # Navigation path component
│   └── mobile-menu.njk       # Mobile nav (prepared)
├── assets/
│   └── style.css             # All styles (dark mode, mobile, print, accessibility)
├── texts/
│   └── [source]/[book]/      # Content organized by language → book
├── by-figure/
│   └── [figure]/             # Auto-generated collections by figure
├── index.njk                 # Homepage
├── texts.njk                 # Source directory
├── by-figure.njk            # Figure pages (collection)
├── sitemap.njk              # XML sitemap
└── 404.md                    # Error page
```

---

## 🔧 Key Technologies

- **Generator:** Eleventy 3.1.2
- **Template Language:** Nunjucks (njk)
- **Styling:** CSS with CSS variables for theming
- **Data Files:** JSON (figures, sources)
- **Features:** 
  - Collections API for organizing by book/figure
  - Syntax highlighting support (@11ty/eleventy-plugin-syntaxhighlight)
  - Date formatting (luxon)
  - Search indexing (pagefind - configured)

---

## 📊 Content Statistics

- **Files:** 19 markdown/content files
- **Templates:** 9 Nunjucks templates  
- **Build Output:** ~340KB (gzipped)
- **Build Time:** ~0.1s

---

## 🎨 Color Scheme

### Light Mode (Default)
- Background: `#f9f5e7` (Cream/Papyrus)
- Text: `#3D2B1F` (Brown-earth)
- Border: `#d4af37` (Thin gold)
- Headers: `#5a3a2a` (Dark brown)
- Accents: `#8b4513` (Saddle brown)

### Dark Mode
- Background: `#1a1410` (Deep brown)
- Text: `#e8dcc8` (Light cream)
- Border: `#8b7355` (Muted brown)
- Headers: `#d4a574` (Light tan)
- Accents: `#d4af37` (Gold)

---

## 🚀 Deployment & Git

**Netlify Auto-Deploy:**
```bash
git push origin main  # Triggers auto-build on Netlify
```

**Environment:**
- Framework: Eleventy
- Build command: `npm run build`
- Publish directory: `dist/`

**Important Files:**
- `.eleventy.js` - Build config (collections, filters)
- `package.json` - Dependencies
- `replit.md` - This file

---

## 🔍 SEO & Meta

- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Open Graph tags
- ✅ Canonical URLs
- ✅ Hebrew language meta

---

## 💡 Future Enhancements

1. **Search Integration** - Pagefind already installed, awaiting activation
2. **Figure Summary Pages** - Each biblical figure as a dedicated page
3. **Bibliography** - Centralized reference list
4. **Comments Section** - Disqus integration ready
5. **Related Texts** - Cross-references between texts

---

## 📝 User Preferences & Notes

- All text/navigation in Hebrew (RTL layout)
- Academic/scholarly tone
- Traditional parchment aesthetics maintained
- User prefers git push workflow for deployment
- Dark mode with brown-gold color scheme (not blue/gray)

---

**Last Updated:** November 21, 2025  
**Status:** Production Ready with Latest Features ✨
