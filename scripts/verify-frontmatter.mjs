import { readdirSync, readFileSync, statSync } from 'node:fs';
<<<<<<< HEAD
import { join, relative } from 'node:path';

const TEXTS_ROOT = 'src/texts';
const LANGUAGES_DATA = 'src/_data/languages.json';
const FIGURES_DATA = 'src/_data/figures.json';

const SOURCE_KEYS = Object.keys(JSON.parse(readFileSync(LANGUAGES_DATA, 'utf8')));
const FIGURE_KEYS = Object.keys(JSON.parse(readFileSync(FIGURES_DATA, 'utf8')));

const errors = [];

function walk(dir, cb) {
=======
import { join } from 'node:path';

const ROOT = 'src/texts';
const requiredKeys = ['layout', 'title', 'book', 'source', 'figure', 'pageNumber'];
const errors = [];

function walk(dir) {
>>>>>>> origin/main
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
<<<<<<< HEAD
      walk(full, cb);
      continue;
    }
    cb(full);
=======
      walk(full);
      continue;
    }
    if (/page-\d+\.md$/.test(name)) {
      checkFile(full);
    }
>>>>>>> origin/main
  }
}

function getFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  return match ? match[1] : null;
}

function hasKey(frontmatter, key) {
<<<<<<< HEAD
  return new RegExp(`^${key}:`, 'm').test(frontmatter);
}

function readValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
}

function assertKeys(frontmatter, file, keys) {
  for (const key of keys) {
    if (!hasKey(frontmatter, key)) {
      errors.push(`${file}: missing required key '${key}'`);
    }
  }
}

function assertKnownValue(frontmatter, file, key, allowed) {
  if (!hasKey(frontmatter, key)) return;
  const value = readValue(frontmatter, key);
  if (!allowed.includes(value)) {
    errors.push(`${file}: unknown ${key} '${value}'`);
  }
}

function checkPage(file, frontmatter) {
  assertKeys(frontmatter, file, ['layout', 'title', 'book', 'source', 'figure', 'pageNumber']);

  if (hasKey(frontmatter, 'pageNumber')) {
    const raw = readValue(frontmatter, 'pageNumber');
    const numeric = Number(raw);
    if (!Number.isInteger(numeric) || numeric <= 0) {
      errors.push(`${file}: pageNumber must be a positive integer (got '${raw}')`);
    }
  }

  assertKnownValue(frontmatter, file, 'source', SOURCE_KEYS);
  assertKnownValue(frontmatter, file, 'figure', FIGURE_KEYS);
}

function checkBookIndex(file, frontmatter) {
  assertKeys(frontmatter, file, ['layout', 'title', 'book', 'source', 'figure', 'permalink']);
  assertKnownValue(frontmatter, file, 'source', SOURCE_KEYS);
  assertKnownValue(frontmatter, file, 'figure', FIGURE_KEYS);
}

function checkLanguageIndex(file, frontmatter) {
  assertKeys(frontmatter, file, ['layout', 'title', 'permalink']);
}

walk(TEXTS_ROOT, (file) => {
  if (!file.endsWith('.md')) return;

  const content = readFileSync(file, 'utf8');
  const frontmatter = getFrontmatter(content);
=======
  const re = new RegExp(`^${key}:`, 'm');
  return re.test(frontmatter);
}

function readValue(frontmatter, key) {
  const re = new RegExp(`^${key}:\\s*(.+)$`, 'm');
  const match = frontmatter.match(re);
  return match ? match[1].trim() : '';
}

function checkFile(file) {
  const content = readFileSync(file, 'utf8');
  const frontmatter = getFrontmatter(content);

>>>>>>> origin/main
  if (!frontmatter) {
    errors.push(`${file}: missing frontmatter block`);
    return;
  }

<<<<<<< HEAD
  const rel = relative(TEXTS_ROOT, file).replace(/\\/g, '/');
  const parts = rel.split('/');
  const base = parts[parts.length - 1];

  if (/^page-\d+\.md$/.test(base)) {
    checkPage(file, frontmatter);
    return;
  }

  if (base === 'index.md' && parts.length >= 3) {
    checkBookIndex(file, frontmatter);
    return;
  }

  if (base === 'index.md' && parts.length === 2) {
    checkLanguageIndex(file, frontmatter);
  }
});
=======
  for (const key of requiredKeys) {
    if (!hasKey(frontmatter, key)) {
      errors.push(`${file}: missing required key '${key}'`);
    }
  }

  if (hasKey(frontmatter, 'pageNumber')) {
    const raw = readValue(frontmatter, 'pageNumber');
    const numeric = Number(raw.replace(/['"]/g, ''));
    if (!Number.isInteger(numeric) || numeric <= 0) {
      errors.push(`${file}: pageNumber must be a positive integer (got '${raw}')`);
    }
  }
}

walk(ROOT);
>>>>>>> origin/main

if (errors.length) {
  console.error('Frontmatter verification failed:\n');
  for (const err of errors) {
    console.error(`- ${err}`);
  }
  process.exit(1);
}

<<<<<<< HEAD
console.log('Frontmatter verification passed for chapter and index pages.');
=======
console.log('Frontmatter verification passed for all chapter pages.');
>>>>>>> origin/main
