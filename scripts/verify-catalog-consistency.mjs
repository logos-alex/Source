import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const TEXTS_ROOT = 'src/texts';
const CATALOG = JSON.parse(readFileSync('src/_data/sources-catalog.json', 'utf8'));
const KNOWN_BOOK_IDS = new Set(CATALOG.map((entry) => entry.id));
const errors = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (full.endsWith('.md')) check(full);
  }
}

function getFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  return m ? m[1] : null;
}

function readKey(frontmatter, key) {
  const m = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : '';
}

function check(file) {
  const content = readFileSync(file, 'utf8');
  const fm = getFrontmatter(content);
  if (!fm) return;

  const book = readKey(fm, 'book');
  if (!book) return;

  if (!KNOWN_BOOK_IDS.has(book)) {
    errors.push(`${file}: unknown book '${book}' (not found in sources-catalog.json)`);
  }
}

walk(TEXTS_ROOT);

if (errors.length) {
  console.error('Catalog consistency verification failed:\n');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('Catalog consistency verification passed.');
