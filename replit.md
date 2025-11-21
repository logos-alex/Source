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

## Recent Changes (Nov 21, 2025)
- Imported from GitHub and set up for Replit environment
- Configured Eleventy dev server to run on port 5000 with host 0.0.0.0
- Set up workflow for automatic dev server startup
- Configured static deployment settings
- Verified site builds and runs correctly with Hebrew RTL layout
