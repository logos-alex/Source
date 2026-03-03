import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/texts';
const OUT = 'docs/content-status-he.md';

const books = new Map();

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (/\.md$/.test(full)) check(full, name);
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

function check(file, base) {
  const text = readFileSync(file, 'utf8');
  const fm = frontmatter(text);
  if (!fm) return;

  const book = readKey(fm, 'book');
  if (!book) return;
  if (!books.has(book)) books.set(book, { pages: 0, untranslated: 0, source: readKey(fm, 'source') || '-' });

  if (/^page-\d+\.md$/.test(base)) {
    books.get(book).pages += 1;
    if (text.includes('⚠️ תרגום עברי לעמוד זה יתווסף לאחר אימות הנוסח.')) {
      books.get(book).untranslated += 1;
    }
  }
}

walk(ROOT);

const rows = [...books.entries()].sort((a,b)=>a[0].localeCompare(b[0]));
let md = '# דוח סטטוס תוכן\n\n';
md += '| ספר | מקור | מספר פרקים | פרקים ללא תרגום מאומת |\n';
md += '|---|---:|---:|---:|\n';
for (const [book, s] of rows) {
  md += `| ${book} | ${s.source} | ${s.pages} | ${s.untranslated} |\n`;
}

md += '\n> הדוח נוצר אוטומטית על ידי `npm run report:content`.\n';
writeFileSync(OUT, md, 'utf8');
console.log(`Wrote ${OUT}`);
