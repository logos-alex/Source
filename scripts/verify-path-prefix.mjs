import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '_site';
const requiredPrefix = '/Source/';
const bad = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (full.endsWith('.html')) check(full);
  }
}

function check(file) {
  const text = readFileSync(file, 'utf8');
  const re = /(?:href|src)="(\/[^"#?]*)"/g;
  let m;
  while ((m = re.exec(text))) {
    const url = m[1];
    if (
      url.startsWith(requiredPrefix) ||
      url.startsWith('//') ||
      url === '/' ||
      url.startsWith('/#') ||
      url === '/favicon.ico'
    ) {
      continue;
    }
    bad.push({ file, url });
  }
}

walk(ROOT);

if (bad.length) {
  console.error('Found non-prefixed internal URLs in built output:');
  for (const item of bad.slice(0, 50)) {
    console.error(`- ${item.file}: ${item.url}`);
  }
  process.exit(1);
}

console.log(`Prefix check passed: all built internal URLs use ${requiredPrefix}`);
