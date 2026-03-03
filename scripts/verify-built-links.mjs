import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const SITE_ROOT = '_site';
const sitePrefix = JSON.parse(readFileSync('src/_data/site.json', 'utf8')).pathPrefix || '/';
const errors = [];
const htmlFiles = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (full.endsWith('.html')) htmlFiles.push(full);
  }
}

function toFsPath(urlPath) {
  let clean = urlPath.split('#')[0].split('?')[0];
  if (sitePrefix !== '/' && clean.startsWith(sitePrefix)) {
    clean = clean.slice(sitePrefix.length - 1);
  }
  if (!clean || clean === '/') return join(SITE_ROOT, 'index.html');

  const maybeFile = join(SITE_ROOT, clean.replace(/^\//, ''));
  if (existsSync(maybeFile) && statSync(maybeFile).isFile()) return maybeFile;

  const maybeIndex = join(SITE_ROOT, clean.replace(/^\//, ''), 'index.html');
  if (existsSync(maybeIndex)) return maybeIndex;

  return null;
}

function check(file) {
  const html = readFileSync(file, 'utf8');
  const re = /(?:href|src)="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    const url = m[1];
    if (!url) continue;

    // Ignore external, mail, data, js pseudo links
    if (/^(https?:)?\/\//.test(url) || /^(mailto:|tel:|javascript:|data:)/.test(url)) continue;

    // Ignore anchor-only links
    if (url.startsWith('#')) continue;

    let fsPath = null;
    if (url.startsWith('/')) {
      fsPath = toFsPath(url);
    } else {
      const rel = join(dirname(file), url.split('#')[0].split('?')[0]);
      if (existsSync(rel) && statSync(rel).isFile()) fsPath = rel;
      else {
        const relIndex = join(dirname(file), url.split('#')[0].split('?')[0], 'index.html');
        if (existsSync(relIndex)) fsPath = relIndex;
      }
    }

    if (!fsPath) {
      errors.push(`${file}: broken link/resource '${url}'`);
    }
  }
}

walk(SITE_ROOT);
htmlFiles.forEach(check);

if (errors.length) {
  console.error('Built-link verification failed:\n');
  for (const err of errors.slice(0, 120)) console.error(`- ${err}`);
  process.exit(1);
}

console.log('Built-link verification passed.');
