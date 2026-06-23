import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = 'src';
const TEXTS_ROOT = 'src/texts';
const entries = new Map();
const missingPermalinks = [];
const errors = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (full.endsWith('.md') || full.endsWith('.njk')) check(full);
  }
}

function walkTexts(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkTexts(full);
    } else if (full.endsWith('.md')) {
      checkMissingPermalink(full);
    }
  }
}

function frontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  return m ? m[1] : null;
}

function readKey(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : '';
}

function hasKey(fm, key) {
  return new RegExp(`^${key}:`, 'm').test(fm);
}

function normalize(p) {
  if (!p) return '';
  if (!p.startsWith('/')) p = '/' + p;
  if (!p.endsWith('/')) p += '/';
  return p;
}

function check(file) {
  const fm = frontmatter(readFileSync(file, 'utf8'));
  if (!fm) return;
  const permalink = readKey(fm, 'permalink');
  if (!permalink || permalink.includes('{{')) return;
  const norm = normalize(permalink);
  if (!entries.has(norm)) entries.set(norm, []);
  entries.get(norm).push(file);
}

function checkMissingPermalink(file) {
  const content = readFileSync(file, 'utf8');
  const fm = frontmatter(content);
  if (!fm) return;

  // Skip files explicitly marked as draft
  if (hasKey(fm, 'draft') && readKey(fm, 'draft') === 'true') return;

  // Skip 404, sitemap, RSS feed (these have permalink set in frontmatter or are excluded)
  const rel = relative(TEXTS_ROOT, file).replace(/\\/g, '/');
  const base = rel.split('/').pop();

  // Only check page-N.md and index.md files in src/texts/
  if (!/^page-\d+\.md$/.test(base) && base !== 'index.md') return;

  if (!hasKey(fm, 'permalink')) {
    missingPermalinks.push(`${file}: missing 'permalink' field in frontmatter`);
  }
}

walk(ROOT);
walkTexts(TEXTS_ROOT);

for (const [permalink, files] of entries.entries()) {
  if (files.length > 1) {
    errors.push(`duplicate permalink '${permalink}' in: ${files.join(', ')}`);
  }
}

errors.push(...missingPermalinks);

if (errors.length) {
  console.error('Permalink verification failed:\n');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('Permalink verification passed (no duplicates, no missing permalinks in src/texts/).');
