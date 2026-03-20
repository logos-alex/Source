import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/texts';
const OUT = 'docs/content-status-he.md';
const UNTRANSLATED_MARKER = '⚠️ תרגום עברי לעמוד זה יתווסף לאחר אימות הנוסח.';

function frontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  return match ? match[1] : null;
}

function readKey(fm, key) {
  const match = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
}

function collectBooks(root = ROOT) {
  const books = new Map();

  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) {
        walk(full);
        continue;
      }

      if (!/\.md$/.test(full)) continue;

      const text = readFileSync(full, 'utf8');
      const fm = frontmatter(text);
      if (!fm) continue;

      const book = readKey(fm, 'book');
      if (!book) continue;

      if (!books.has(book)) {
        books.set(book, {
          pages: 0,
          untranslated: 0,
          source: readKey(fm, 'source') || '-'
        });
      }

      if (!/^page-\d+\.md$/.test(name)) continue;

      books.get(book).pages += 1;
      if (text.includes(UNTRANSLATED_MARKER)) {
        books.get(book).untranslated += 1;
      }
    }
  }

  walk(root);
  return books;
}

function renderReport(books = collectBooks()) {
  const rows = [...books.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  let md = '# דוח סטטוס תוכן\n\n';
  md += '| ספר | מקור | מספר פרקים | פרקים ללא תרגום מאומת |\n';
  md += '|---|---:|---:|---:|\n';

  for (const [book, stats] of rows) {
    md += `| ${book} | ${stats.source} | ${stats.pages} | ${stats.untranslated} |\n`;
  }

  md += '\n> הדוח נוצר אוטומטית על ידי `npm run report:content`.\n';
  return md;
}

function verifyReport() {
  const expected = renderReport();
  const actual = readFileSync(OUT, 'utf8');

  if (actual !== expected) {
    console.error(`Outdated content status report: ${OUT}`);
    console.error('Run `npm run report:content` and commit the updated file.');
    process.exit(1);
  }

  console.log(`Verified ${OUT}`);
}

const mode = process.argv[2] ?? 'write';

if (mode === '--check') {
  verifyReport();
} else if (mode === 'write') {
  writeFileSync(OUT, renderReport(), 'utf8');
  console.log(`Wrote ${OUT}`);
} else {
  console.error(`Unknown mode: ${mode}`);
  console.error('Usage: node scripts/report-content-status.mjs [--check]');
  process.exit(1);
}
