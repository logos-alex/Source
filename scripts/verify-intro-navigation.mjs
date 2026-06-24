import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const filters = new Map();
const eleventyConfig = {
  addFilter(name, fn) {
    filters.set(name, fn);
  },
  addPassthroughCopy() {}
};

require('../.eleventy.js')(eleventyConfig);

const bookPages = filters.get('bookPages');
if (typeof bookPages !== 'function') {
  throw new Error('Could not load the bookPages filter from .eleventy.js');
}

const ROOT = 'src/texts';
const items = [];
const errors = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (full.endsWith('.md')) items.push(toCollectionItem(full));
  }
}

function getFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  return match ? match[1] : '';
}

function readValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
}

function toUrl(file, frontmatter) {
  const permalink = readValue(frontmatter, 'permalink');
  if (permalink) return permalink;

  const rel = relative('src', file).replace(/\\/g, '/');
  if (rel.endsWith('/index.md')) {
    return `/${rel.replace(/index\.md$/, '')}`;
  }

  return `/${rel.replace(/\.md$/, '/')}`;
}

function toCollectionItem(file) {
  const content = readFileSync(file, 'utf8');
  const frontmatter = getFrontmatter(content);
  const pageNumberRaw = readValue(frontmatter, 'pageNumber');
  const pageNumber = pageNumberRaw ? Number(pageNumberRaw) : undefined;

  return {
    inputPath: file,
    fileSlug: file.endsWith('/index.md') ? 'index' : file.split('/').pop()?.replace(/\.md$/, ''),
    url: toUrl(file, frontmatter),
    data: {
      book: readValue(frontmatter, 'book') || undefined,
      draft: readValue(frontmatter, 'draft') === 'true',
      pageNumber: Number.isInteger(pageNumber) ? pageNumber : undefined,
      title: readValue(frontmatter, 'title') || undefined
    }
  };
}

walk(ROOT);

const firstChapters = items.filter((item) => item.data?.pageNumber === 1);

for (const chapter of firstChapters) {
  const pagesInBook = bookPages(items, chapter.url, chapter.data?.book, true);
  const currentIndex = pagesInBook.findIndex((item) => item.url === chapter.url);
  if (currentIndex <= 0) {
    errors.push(`${chapter.inputPath}: first chapter is missing an intro page before it`);
    continue;
  }

  const prevPage = pagesInBook[currentIndex - 1];
  if (Number(prevPage?.data?.pageNumber || 0) !== 0 && !prevPage?.inputPath?.endsWith('/index.md')) {
    errors.push(`${chapter.inputPath}: previous page is '${prevPage?.inputPath || 'unknown'}' instead of the intro page`);
    continue;
  }

  const expectedIntroPath = join(dirname(chapter.inputPath), 'index.md');
  if (prevPage.inputPath !== expectedIntroPath) {
    errors.push(`${chapter.inputPath}: previous page resolves to '${prevPage.inputPath}' instead of '${expectedIntroPath}'`);
  }
}

if (errors.length) {
  console.error('Intro-navigation verification failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Intro-navigation verification passed for ${firstChapters.length} first-chapter page(s).`);
