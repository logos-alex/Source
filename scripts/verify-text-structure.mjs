import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = 'src/texts';
const books = new Map();
const intros = new Set();
const errors = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (full.endsWith('.md')) checkFile(full, name);
  }
}

function getFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  return m ? m[1] : null;
}

function readValue(frontmatter, key) {
  const m = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : '';
}

function checkFile(file, base) {
  const fm = getFrontmatter(readFileSync(file, 'utf8'));
  if (!fm) return;
  if (base === 'index.md') {
    const book = readValue(fm, 'book');
    if (book) intros.add(book);
    return;
  }
  if (!/^page-\d+\.md$/.test(base)) return;

  const book = readValue(fm, 'book');
  const n = Number(readValue(fm, 'pageNumber'));
  if (!book || !Number.isInteger(n) || n <= 0) return;

  if (!books.has(book)) books.set(book, []);
  books.get(book).push({ n, file, dir: dirname(file) });
}

walk(ROOT);

for (const [book, pages] of books.entries()) {
  pages.sort((a, b) => a.n - b.n);
  const seen = new Set();
  for (const p of pages) {
    if (seen.has(p.n)) {
      errors.push(`${book}: duplicate pageNumber ${p.n} (${p.file})`);
    }
    seen.add(p.n);
  }

  for (let expected = 1; expected <= pages[pages.length - 1].n; expected++) {
    if (!seen.has(expected)) {
      errors.push(`${book}: missing pageNumber ${expected}`);
    }
  }

  if (!intros.has(book)) {
    errors.push(`${book}: missing index.md introduction with matching 'book' key`);
  }
}

if (errors.length) {
  console.error('Text structure verification failed:\n');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log('Text structure verification passed for all books.');
