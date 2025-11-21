# בית מדרש וירטואלי לכתבים גנוזים
# Virtual Study House for Ancient Texts

## Overview
This is an Eleventy (11ty) static site generator project that creates a digital archive of ancient apocalyptic and eschatological texts. The project presents Hebrew, Slavic, and Latin texts with scholarly commentary and translations.

## Project Structure
- **src/** - Source directory containing all content and templates
  - **_data/** - Site metadata, figures, and sources configuration
  - **_includes/** - Nunjucks templates (base.njk, book-index.njk, category-page.njk, text-page.njk)
  - **assets/** - CSS styling files
  - **texts/** - Organized by source language (hebrew/, slavic/, Latin/)
    - Each text has an index page and individual page files
- **dist/** - Generated static site output (not committed to git)
- **.eleventy.js** - Eleventy configuration file

## Technology Stack
- **Eleventy v3.1.2** - Static site generator
- **Nunjucks** - Template engine for HTML
- **Markdown** - Content format for text pages
- **Luxon** - Date formatting library
- **Prism.js** - Syntax highlighting plugin

## Development Setup
The project is configured to run on Replit with:
- Dev server on port 5000 (bound to 0.0.0.0)
- Live reload enabled
- Automatic builds on file changes

### Commands
- `npm run dev` - Start development server on port 5000
- `npm run build` - Build static site to dist/

## Deployment
Configured for static deployment:
- **Type**: Static site
- **Build command**: `npm run build`
- **Output directory**: `dist/`

## Content Organization
Texts are organized by:
1. **Source language** (Hebrew, Slavic, Latin)
2. **Book/document** (e.g., Apocalypse of Elijah, Ladder of Jacob, Vision of Ezra)
3. **Individual pages** with scholarly notes and commentary

## Architecture Deep Dive

### Eleventy Configuration (.eleventy.js)
**Custom Collections:**
- `textsByBook` - Groups texts by book identifier and sorts by pageNumber
  - Filters items tagged with "texts"
  - Critical for pagination and table of contents

**Custom Filters:**
- `date` - Formats dates using Luxon (dd LLL yyyy)
- `figureLink` - Converts figure names to URL slugs (/by-figure/name/)
- `findIndexByUrl` - Finds item index by URL for navigation

**Assets:**
- Pass-through copy for `src/assets/` (CSS files)
- No image optimization currently configured

### Template System
**Layout Hierarchy:**
1. `base.njk` - Root template with:
   - Header with site title and navigation
   - Main content area
   - Footer
   - Google Translate widget
   - RTL Hebrew support

2. `text-page.njk` - Individual text pages:
   - Displays title, source, and figure
   - Renders markdown content
   - Shows numbered footnotes with IDs
   - Previous/Next pagination
   - "Table of Contents" button
   - Disqus comments integration

3. `book-index.njk` - Book introduction pages:
   - Shows book title and description
   - Renders introduction content
   - Lists all pages in the book (pageNumber > 0)
   - Disqus comments

4. `category-page.njk` - Category listing template (currently unused)

### Content Organization Strategy
**Dual Taxonomy System:**
1. **By Source Language** (`source` field):
   - `hebrew` - Hebrew texts
   - `slavic` - Slavic texts  
   - `latin` - Latin texts
   - `aramaic` - Aramaic-Syriac texts (placeholder, no content yet)

2. **By Figure** (`figure` field):
   - `elijah` - Texts attributed to Elijah
   - `jacob` - Texts attributed to Jacob
   - `ezra` - Texts attributed to Ezra
   - `isaiah` - Texts attributed to Isaiah

**Page Number System:**
- `pageNumber: 0` - Introduction/index page for a book
- `pageNumber: 1+` - Content pages, sorted automatically

### Current Content Inventory
- **Total files**: 27 content files (.md + .njk)
- **Built site size**: 272KB (very lightweight!)
- **Total generated pages**: 26 HTML pages

**Hebrew Texts:**
- Apocalypse of Elijah (חזון אליהו) - 8 pages (2 versions: a & b)

**Slavic Texts:**
- Ladder of Jacob (סולם יעקב) - 5 pages

**Latin Texts:**
- Vision of Ezra (חזון עזרא הלטיני) - 1 page

### Navigation Structure
```
/ (Homepage)
├── /texts/ (By Source - All Categories)
│   ├── /texts/hebrew/ (Hebrew Category)
│   │   └── /texts/hebrew/apocalypse-of-elijah/
│   │       ├── index (Introduction)
│   │       ├── /a/page-1/ through /a/page-4/
│   │       └── /b/page-1/ through /b/page-4/
│   ├── /texts/slavic/ (Slavic Category)
│   │   └── /texts/slavic/ladder-of-jacob/
│   │       ├── index (Introduction)
│   │       └── page-1/ through page-5/
│   └── /texts/latin/ (Latin Category)
│       └── /texts/latin/vision-of-ezra/
│           ├── index (Introduction)
│           └── page-1/
└── /by-figure/ (By Attribution)
    ├── /by-figure/elijah/ (Elijah texts)
    ├── /by-figure/jacob/ (Jacob texts)
    ├── /by-figure/ezra/ (Ezra texts)
    └── /by-figure/isaiah/ (Isaiah texts)
```

### Features Implemented
- ✅ Responsive design with mobile support
- ✅ Hebrew RTL text direction
- ✅ Google Translate widget (6 languages)
- ✅ Scholarly footnotes with references
- ✅ Bi-directional page navigation
- ✅ Table of contents for each book
- ✅ Disqus comments on all text pages
- ✅ Clean, manuscript-inspired design
- ✅ Live reload during development

## Recent Changes (Nov 21, 2025)
- Imported from GitHub and set up for Replit environment
- Configured Eleventy dev server to run on port 5000 with host 0.0.0.0
- Set up workflow for automatic dev server startup
- Configured static deployment settings
- Verified site builds and runs correctly with Hebrew RTL layout
- **Fixed navigation bug**: Created missing `/texts/` index page
- **Fixed navigation bug**: Created missing `/texts/latin/` category page
- Now all navigation links work correctly
