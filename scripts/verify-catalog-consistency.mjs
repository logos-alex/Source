import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const TEXTS_ROOT = 'src/texts';
const BY_FIGURE_ROOT = 'src/by-figure';
const CATALOG = JSON.parse(readFileSync('src/_data/sources-catalog.json', 'utf8'));
const FIGURES = JSON.parse(readFileSync('src/_data/figures.json', 'utf8'));
const FIGURE_CATALOG_KEYS = JSON.parse(readFileSync('src/_data/figureCatalogKeys.json', 'utf8'));

const KNOWN_BOOK_IDS = new Set(CATALOG.map((entry) => entry.id));
const ACTIVE_FIGURE_KEYS = new Set(FIGURE_CATALOG_KEYS);
const usedFigures = new Map();
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

function noteUsedFigure(figure, file) {
  if (!figure) return;
  const files = usedFigures.get(figure) ?? [];
  files.push(file);
  usedFigures.set(figure, files);
}

function check(file) {
  const content = readFileSync(file, 'utf8');
  const fm = getFrontmatter(content);
  if (!fm) return;

  const book = readKey(fm, 'book');
  const figure = readKey(fm, 'figure');

  noteUsedFigure(figure, file);

  if (book && !KNOWN_BOOK_IDS.has(book)) {
    errors.push(`${file}: unknown book '${book}' (not found in sources-catalog.json)`);
  }
}

walk(TEXTS_ROOT);

for (const [figure, files] of usedFigures) {
  if (!(figure in FIGURES)) {
    errors.push(
      `${files[0]}: unknown figure '${figure}' (not found in src/_data/figures.json)`
    );
  }

  const manualPagePath = join(BY_FIGURE_ROOT, figure, 'index.md');
  const hasManualPage = existsSync(manualPagePath);
  const hasDynamicPage = ACTIVE_FIGURE_KEYS.has(figure);

  if (!hasDynamicPage && !hasManualPage) {
    errors.push(
      `${files[0]}: figure '${figure}' is used in content but has no active category page (add it to src/_data/figureCatalogKeys.json or create ${manualPagePath})`
    );
  }
}

for (const figureKey of FIGURE_CATALOG_KEYS) {
  if (!(figureKey in FIGURES)) {
    errors.push(
      `src/_data/figureCatalogKeys.json: figure '${figureKey}' is missing from src/_data/figures.json`
    );
  }
}

if (errors.length) {
  console.error('Catalog consistency verification failed:\n');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('Catalog consistency verification passed.');
