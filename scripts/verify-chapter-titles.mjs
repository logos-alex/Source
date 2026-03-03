import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/texts';
const errors = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (/page-\d+\.md$/.test(name)) check(full);
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

function check(file) {
  const fm = frontmatter(readFileSync(file, 'utf8'));
  if (!fm) return;
  const title = readKey(fm, 'title');
  if (!title.includes('פרק')) {
    errors.push(`${file}: chapter title should include 'פרק' (got '${title}')`);
  }
}

walk(ROOT);

if (errors.length) {
  console.error('Chapter-title verification failed:\n');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('Chapter-title verification passed.');
