import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const SITE_ROOT = '_site';
const sitePrefix = JSON.parse(readFileSync('src/_data/site.json', 'utf8')).pathPrefix || '/';
const errors = [];
const htmlFiles = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (full.endsWith('.html')) htmlFiles.push(full);
  }
}

function toFsPath(urlPath) {
  let clean = urlPath.split('#')[0].split('?')[0];
  if (sitePrefix !== '/' && clean.startsWith(sitePrefix)) {
    clean = clean.slice(sitePrefix.length - 1);
  }
  if (!clean || clean === '/') return join(SITE_ROOT, 'index.html');

  const maybeFile = join(SITE_ROOT, clean.replace(/^\//, ''));
  if (existsSync(maybeFile) && statSync(maybeFile).isFile()) return maybeFile;

  const maybeIndex = join(SITE_ROOT, clean.replace(/^\//, ''), 'index.html');
  if (existsSync(maybeIndex)) return maybeIndex;

  return null;
}

// Extract URLs from many attribute types, not just href/src.
// Covers: href, src, srcset (multiple URLs), link href, meta content (URLs only),
// form action, iframe src, image href (SVG), data-* that look like URLs.
const URL_ATTR_RE = /(?:href|src|action|poster|data-url|data-href|data-src)\s*=\s*"([^"]+)"/g;
const SRCSET_RE = /srcset\s*=\s*"([^"]+)"/g;
const META_URL_RE = /<meta[^>]+content\s*=\s*"((?:\/[^"]+"|https?:\/\/[^"]+))"/g;
const JSONLD_URL_RE = /"(?:url|@id|image|logo|sameAs)"\s*:\s*"([^"]+)"/g;

function looksLikeInternal(url) {
  return url.startsWith('/') || url.startsWith(sitePrefix);
}

function check(file) {
  const html = readFileSync(file, 'utf8');

  // 1. Standard attributes (href, src, action, etc.)
  let m;
  URL_ATTR_RE.lastIndex = 0;
  while ((m = URL_ATTR_RE.exec(html))) {
    const url = m[1];
    if (!url) continue;
    if (/^(https?:)?\/\//.test(url) || /^(mailto:|tel:|javascript:|data:)/.test(url)) continue;
    if (url.startsWith('#')) continue;
    // Ignore false-positive Hebrew/Aramaic text misparsed as URL
    if (!url.startsWith('/') && /[\u0590-\u05FF\u0600-\u06FF\s]/.test(url)) continue;

    let fsPath = null;
    if (url.startsWith('/')) {
      fsPath = toFsPath(url);
    } else {
      const rel = join(dirname(file), url.split('#')[0].split('?')[0]);
      if (existsSync(rel) && statSync(rel).isFile()) fsPath = rel;
      else {
        const relIndex = join(dirname(file), url.split('#')[0].split('?')[0], 'index.html');
        if (existsSync(relIndex)) fsPath = relIndex;
      }
    }
    if (!fsPath) {
      errors.push(`${file}: broken link/resource '${url}'`);
    }
  }

  // 2. srcset (responsive images) — comma-separated URL+descriptor pairs
  SRCSET_RE.lastIndex = 0;
  while ((m = SRCSET_RE.exec(html))) {
    const srcset = m[1];
    for (const entry of srcset.split(',')) {
      const url = entry.trim().split(/\s+/)[0];
      if (!url) continue;
      if (/^(https?:)?\/\//.test(url) || /^(mailto:|tel:|javascript:|data:)/.test(url)) continue;
      if (!looksLikeInternal(url)) continue;
      const fsPath = toFsPath(url);
      if (!fsPath) {
        errors.push(`${file}: broken srcset URL '${url}'`);
      }
    }
  }

  // 3. meta content URLs (og:image, twitter:image, canonical)
  META_URL_RE.lastIndex = 0;
  while ((m = META_URL_RE.exec(html))) {
    const url = m[1];
    if (!looksLikeInternal(url)) continue;
    const fsPath = toFsPath(url);
    if (!fsPath) {
      errors.push(`${file}: broken meta URL '${url}'`);
    }
  }

  // 4. JSON-LD url/@id/image/logo/sameAs (only check internal)
  JSONLD_URL_RE.lastIndex = 0;
  while ((m = JSONLD_URL_RE.exec(html))) {
    const url = m[1];
    if (!looksLikeInternal(url)) continue;
    const fsPath = toFsPath(url);
    if (!fsPath) {
      errors.push(`${file}: broken JSON-LD URL '${url}'`);
    }
  }
}

walk(SITE_ROOT);
htmlFiles.forEach(check);

if (errors.length) {
  const shown = Math.min(errors.length, 120);
  console.error(`Built-link verification failed (${errors.length} issues, showing first ${shown}):\n`);
  for (const err of errors.slice(0, shown)) console.error(`- ${err}`);
  if (errors.length > 120) console.error(`... and ${errors.length - 120} more`);
  process.exit(1);
}

console.log(`Built-link verification passed (${htmlFiles.length} HTML files scanned).`);
