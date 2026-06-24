import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src';
const ALLOWED_PATTERNS = [
  // pagefind search input placeholder (Hebrew) — accepts both "חפש" and "חיפוש" forms
  /placeholder=["']חיפוש?\s+בכתבים/i,
  // pagefind translation key in search UI
  /placeholder:\s*"חפש בכתבים\.\.\."/i,
  // CSS ::placeholder selector and its style rules
  /::placeholder\s*\{/,
  /\.header-search__input::placeholder/,
  /placeholder\s*:/i, // CSS property declarations (e.g. placeholder color)
  // explicit editorial marker
  /⚠️\s*תרגום עברי לעמוד זה יתווסף לאחר אימות הנוסח\./
];

const NEEDLES = ['TODO', 'FIXME', 'TBD', 'XXX', 'placeholder'];
const errors = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (/\.(md|njk|js|json|css)$/i.test(full)) check(full);
  }
}

function check(file) {
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const hasNeedle = NEEDLES.some((needle) => line.includes(needle));
    if (!hasNeedle) return;

    const allowed = ALLOWED_PATTERNS.some((re) => re.test(line));
    if (!allowed) {
      errors.push(`${file}:${idx + 1}: suspicious marker -> ${line.trim()}`);
    }
  });
}

walk(ROOT);

if (errors.length) {
  console.error('Placeholder marker verification failed:\n');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('Placeholder marker verification passed.');
