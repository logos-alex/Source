import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/texts';
const requiredKeys = ['layout', 'title', 'book', 'source', 'figure', 'pageNumber'];
const errors = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full);
      continue;
    }
    if (/page-\d+\.md$/.test(name)) {
      checkFile(full);
    }
  }
}

function getFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  return match ? match[1] : null;
}

function hasKey(frontmatter, key) {
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

  if (!frontmatter) {
    errors.push(`${file}: missing frontmatter block`);
    return;
  }

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

if (errors.length) {
  console.error('Frontmatter verification failed:\n');
  for (const err of errors) {
    console.error(`- ${err}`);
  }
  process.exit(1);
}

console.log('Frontmatter verification passed for all chapter pages.');
