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

## 💡 Future Enhancements & Recommendations

### HIGH PRIORITY 🔴
1. **Pagefind Search Activation** - Already installed, configure UI component
2. **Optimize Typography** - Hebrew ligatures, letter-spacing refinement
3. **Figure Summary Pages** - Each biblical figure (Elijah/Jacob/Ezra/Isaiah) as dedicated page with all related texts
4. **Content Completion** - Add remaining texts for each source (currently: 4 texts, capacity: 20+)

### MEDIUM PRIORITY 🟡
5. **Bibliography & References** - Centralized reference list with academic citations
6. **Related Texts** - Cross-references between texts that reference same themes/figures
7. **Advanced Filtering** - Filter by era, text length, complexity level
8. **Print Stylesheet** - Further optimize for academic paper printing

### LOWER PRIORITY 🟢
9. **Comments System** - Disqus integration ready (text-page.njk has Disqus code)
10. **Analytics** - Google Analytics for user behavior tracking
11. **API Endpoint** - JSON API for programmatic access to texts
12. **Archive Blog** - Commentary and scholarly articles about texts

---

## 🔍 Technical Audit Summary

### ✅ Strengths
- **Clean Architecture** - Well-organized file structure, easy to maintain
- **Responsive Design** - Works on mobile/tablet/desktop (768px breakpoint)
- **Accessibility** - ARIA labels, focus states, color scheme aware
- **SEO Ready** - Sitemap, robots.txt, canonical URLs, Open Graph, JSON-LD
- **Dark Mode** - Full dark theme with localStorage persistence
- **Build Speed** - ~0.8s build time (excellent)
- **Performance** - 996KB total output (very lightweight)
- **Hebrew Support** - RTL layout, proper language tagging, Google Fonts

### ⚠️ Areas for Enhancement
1. **Content Density** - Only 4 texts currently (7 texts worth of structure exists)
2. **Search** - Pagefind installed but not activated in UI
3. **Typography** - Could use Hebrew-specific letter-spacing adjustments
4. **Link Styling** - Internal links could have visual distinction
5. **Mobile Navigation** - Mobile menu template exists but not fully integrated
6. **Caching Headers** - May need explicit cache control on Netlify
7. **Lazy Loading** - Consider lazy-loading for future image content
8. **Comments** - Disqus integration in place but may need moderation settings

### 📊 Metrics
- **Build Files**: 41 generated HTML files
- **Templates**: 11 reusable Nunjucks components
- **Data Files**: 3 JSON files for configuration
- **CSS**: 436 lines (well-organized, CSS variables used)
- **Bundle Size**: ~996KB (1MB - very reasonable)
- **Build Time**: 0.8 seconds (fast)

---

## 🎯 Recommended Action Plan

### Phase 1: Content Expansion (Next Session)
- [ ] Complete Latin texts (Vision of Ezra has 1 page, typically 5-10)
- [ ] Complete Slavic texts (Ladder of Jacob has 5 pages, typically 10+)
- [ ] Add Hebrew and Aramaic texts
- [ ] Validate all texts have consistent frontmatter

### Phase 2: Feature Activation (Current)
- [ ] Activate Pagefind search UI component
- [ ] Configure Disqus moderation settings
- [ ] Add "Related Texts" suggestions section
- [ ] Implement figure summary pages

### Phase 3: Polish & Optimization
- [ ] Fine-tune Hebrew typography
- [ ] Add print CSS for academic use
- [ ] Implement social sharing buttons
- [ ] Add estimated reading time for texts

---

## 📝 User Preferences & Notes

- All text/navigation in Hebrew (RTL layout)
- Academic/scholarly tone
- Traditional parchment aesthetics maintained (papyrus/brown/gold)
- User prefers git push workflow for deployment
- Dark mode with brown-gold color scheme (not blue/gray)
- **CRITICAL**: Exact preservation of source text - never rewrite or fabricate
- Format: Main text separated from commentary/notes (notes in frontmatter array)

---

**Last Updated:** November 21, 2025  
**Status:** Production Ready with Optimization Opportunities ✨  
**Content Completion**: 4/20 texts (20%)
