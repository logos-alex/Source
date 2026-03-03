import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [bookPath, pageNumberRaw, titleRaw, source, figure, version = 'main'] = process.argv.slice(2);

if (!bookPath || !pageNumberRaw || !titleRaw || !source || !figure) {
  console.error('Usage: node scripts/new-chapter.mjs <texts/book/path> <pageNumber> <title> <source> <figure> [version]');
  process.exit(1);
}

const pageNumber = Number(pageNumberRaw);
if (!Number.isInteger(pageNumber) || pageNumber <= 0) {
  console.error('pageNumber must be a positive integer');
  process.exit(1);
}

const file = join('src', 'texts', bookPath, `page-${pageNumber}.md`);
if (existsSync(file)) {
  console.error(`File already exists: ${file}`);
  process.exit(1);
}

const parts = bookPath.split('/');
const book = parts[parts.length - 1];

const content = `---\nlayout: text-page\ntitle: ${titleRaw}\nbook: ${book}\nsource: ${source}\nfigure: ${figure}\npageNumber: ${pageNumber}\nversion: ${version}\n---\n\n`; 

writeFileSync(file, content, 'utf8');
console.log(`Created ${file}`);
