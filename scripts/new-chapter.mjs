import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h') || args.length < 5) {
  console.log(`Usage: node scripts/new-chapter.mjs <texts/book/path> <pageNumber> <title> <source> <figure> [version]

Example:
  node scripts/new-chapter.mjs aramaic/sichat-moshe 5 "פרק ה" aramaic moshe main

The script generates a frontmatter block that passes all verify-* checks:
  - layout, title, book, source, figure, pageNumber, version
  - permalink in standard format /texts/<source>/<book>/page-N/
  - tags (texts, source slug, figure slug)

The book path is relative to src/texts/ (e.g. "aramaic/sichat-moshe").
If the directory does not exist, it is created.`);
  process.exit(0);
}

const [bookPath, pageNumberRaw, titleRaw, source, figure, version = 'main'] = args;

if (!bookPath || !pageNumberRaw || !titleRaw || !source || !figure) {
  console.error('Error: missing required argument. Run with --help for usage.');
  process.exit(1);
}

const pageNumber = Number(pageNumberRaw);
if (!Number.isInteger(pageNumber) || pageNumber <= 0) {
  console.error('Error: pageNumber must be a positive integer');
  process.exit(1);
}

const relativePath = join('src', 'texts', bookPath, `page-${pageNumber}.md`);
const file = relativePath;

if (existsSync(file)) {
  console.error(`Error: file already exists: ${file}`);
  process.exit(1);
}

// Ensure parent directory exists
mkdirSync(dirname(file), { recursive: true });

const parts = bookPath.split('/');
const book = parts[parts.length - 1];
const permalink = `/texts/${source}/${book}/page-${pageNumber}/`;

const tags = ['texts', source, figure]
  .filter((v, i, arr) => arr.indexOf(v) === i); // dedupe

const frontmatter = [
  '---',
  `layout: text-page`,
  `title: "${titleRaw.replace(/"/g, '\\"')}"`,
  `book: ${book}`,
  `source: ${source}`,
  `figure: ${figure}`,
  `pageNumber: ${pageNumber}`,
  `version: ${version}`,
  `permalink: ${permalink}`,
  'tags:',
  ...tags.map(t => `  - ${t}`),
  '---',
  '',
  ''
].join('\n');

writeFileSync(file, frontmatter, 'utf8');
console.log(`Created ${file}`);
console.log(`  book:      ${book}`);
console.log(`  source:    ${source}`);
console.log(`  figure:    ${figure}`);
console.log(`  permalink: ${permalink}`);
console.log(`  tags:      ${tags.join(', ')}`);
