import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src';
const entries = new Map();
const errors = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (full.endsWith('.md') || full.endsWith('.njk')) check(full);
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

walk(ROOT);

for (const [permalink, files] of entries.entries()) {
  if (files.length > 1) {
    errors.push(`duplicate permalink '${permalink}' in: ${files.join(', ')}`);
  }
}

if (errors.length) {
  console.error('Permalink verification failed:\n');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('Permalink verification passed (no duplicate static permalinks).');
