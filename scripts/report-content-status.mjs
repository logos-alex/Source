import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/texts';
const CATALOG_PATH = 'src/_data/sources-catalog.json';
const OUT = 'docs/content-status-he.md';
const UNTRANSLATED_MARKER = '⚠️ תרגום עברי לעמוד זה יתווסף לאחר אימות הנוסח.';

function frontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  return match ? match[1] : null;
}

function readKey(fm, key) {
  const match = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
}

function readNumber(fm, key) {
  const v = readKey(fm, key);
  const n = Number(v);
  return Number.isInteger(n) ? n : 0;
}

function loadCatalog() {
  try {
    return JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));
  } catch (_) {
    return [];
  }
}

function collectBooks(root = ROOT) {
  const catalog = loadCatalog();
  const parallelBooks = new Set(catalog.filter((e) => e.parallelLayout).map((e) => e.id));
  const catalogFigure = new Map(catalog.map((e) => [e.id, e.figure || '']));

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
          source: readKey(fm, 'source') || '-',
          figure: readKey(fm, 'figure') || catalogFigure.get(book) || '-',
          parallel: parallelBooks.has(book),
          notesCount: 0,
          wordCount: 0,
          comingSoon: false,
          draft: false
        });
      }

      const stats = books.get(book);

      if (readKey(fm, 'comingSoon') === 'true') stats.comingSoon = true;
      if (readKey(fm, 'draft') === 'true') stats.draft = true;

      if (!/^page-\d+\.md$/.test(name)) continue;

      stats.pages += 1;
      if (text.includes(UNTRANSLATED_MARKER)) {
        stats.untranslated += 1;
      }

      // Count notes (block scalar YAML)
      const notesMatch = fm.match(/^notes:\s*\n((?:\s+-\s.+\n?)+)/m);
      if (notesMatch) {
        const noteLines = notesMatch[1].split('\n').filter((l) => /^\s+-\s/.test(l));
        stats.notesCount += noteLines.length;
      }

      // Word count (rough — count whitespace-separated tokens in body)
      const body = text.replace(/^---[\s\S]*?---\n/, '');
      const words = body.split(/\s+/).filter((w) => w.length > 0);
      stats.wordCount += words.length;
    }
  }

  walk(root);
  return books;
}

function renderReport(books = collectBooks()) {
  const rows = [...books.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  // Summary at top
  const totalBooks = rows.length;
  const totalPages = rows.reduce((s, [, st]) => s + st.pages, 0);
  const totalNotes = rows.reduce((s, [, st]) => s + st.notesCount, 0);
  const totalWords = rows.reduce((s, [, st]) => s + st.wordCount, 0);
  const parallelCount = rows.filter(([, st]) => st.parallel).length;
  const comingSoonCount = rows.filter(([, st]) => st.comingSoon).length;

  let md = '# דוח סטטוס תוכן\n\n';
  md += '## סיכום מצטבר\n\n';
  md += `| מדד | ערך |\n|---|---:|\n`;
  md += `| סה"כ ספרים | ${totalBooks} |\n`;
  md += `| סה"כ פרקים | ${totalPages} |\n`;
  md += `| סה"כ הערות שוליים | ${totalNotes} |\n`;
  md += `| סה"כ מילים (בערך) | ${totalWords.toLocaleString('he-IL')} |\n`;
  md += `| ספרים עם תצוגה מקבילית | ${parallelCount} |\n`;
  md += `| ספרים בהכנה (comingSoon) | ${comingSoonCount} |\n\n`;

  md += '## פירוט לפי ספר\n\n';
  md += '| ספר | מקור | דמות | פרקים | הערות | מילים | מקבילית | ללא תרגום מאומת |\n';
  md += '|---|---|---|---:|---:|---:|:---:|---:|\n';

  for (const [book, stats] of rows) {
    md += `| ${book} | ${stats.source} | ${stats.figure} | ${stats.pages} | ${stats.notesCount} | ${stats.wordCount.toLocaleString('he-IL')} | ${stats.parallel ? '✓' : ''} | ${stats.untranslated} |\n`;
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
