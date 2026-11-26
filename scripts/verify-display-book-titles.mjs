import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SITE_ROOT = "_site";
const site = JSON.parse(readFileSync("src/_data/site.json", "utf8"));
const figureCatalogKeys = JSON.parse(
  readFileSync("src/_data/figureCatalogKeys.json", "utf8"),
);
const PATH_PREFIX = site.pathPrefix || "/";
const errors = [];
const seenPages = [];
const displayedTitlesByBookUrl = new Map();

function listDirectories(dir) {
  return readdirSync(dir).filter((name) =>
    statSync(join(dir, name)).isDirectory(),
  );
}

function collectListingPages() {
  const pages = [join(SITE_ROOT, "index.html")];

  for (const language of listDirectories(join(SITE_ROOT, "texts"))) {
    pages.push(join(SITE_ROOT, "texts", language, "index.html"));
  }

  for (const figureKey of figureCatalogKeys) {
    pages.push(join(SITE_ROOT, "by-figure", figureKey, "index.html"));
  }

  return pages;
}

function stripPathPrefix(url) {
  if (!url) return "";
  const [pathOnly] = url.split(/[?#]/, 1);
  if (PATH_PREFIX !== "/" && pathOnly.startsWith(PATH_PREFIX)) {
    return pathOnly.slice(PATH_PREFIX.length - 1);
  }
  return pathOnly;
}

function normalizeBookUrl(url) {
  const clean = stripPathPrefix(url);
  if (!/^\/texts\/[^/]+\/[^/]+\/?$/.test(clean)) return null;
  return clean.endsWith("/") ? clean : `${clean}/`;
}

function normalizeLinkText(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function pageLabel(file) {
  return file.replace(/\\/g, "/").replace(`${SITE_ROOT}/`, "/");
}

function noteTitle(bookUrl, title, page) {
  const entries = displayedTitlesByBookUrl.get(bookUrl) ?? [];
  entries.push({ title, page });
  displayedTitlesByBookUrl.set(bookUrl, entries);
}

function inspectPage(file) {
  const html = readFileSync(file, "utf8");
  const linkPattern = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match;

  while ((match = linkPattern.exec(html))) {
    const [, href, innerHtml] = match;
    const bookUrl = normalizeBookUrl(href);
    if (!bookUrl) continue;

    const title = normalizeLinkText(innerHtml);
    if (!title) continue;

    noteTitle(bookUrl, title, pageLabel(file));
  }

  seenPages.push(pageLabel(file));
}

for (const file of collectListingPages()) {
  inspectPage(file);
}

for (const [bookUrl, entries] of displayedTitlesByBookUrl.entries()) {
  const uniqueTitles = [...new Set(entries.map((entry) => entry.title))];
  if (uniqueTitles.length <= 1) continue;

  const details = entries
    .map((entry) => `${entry.page}='${entry.title}'`)
    .join(", ");
  errors.push(
    `${bookUrl} appears with inconsistent display titles across listing pages: ${details}`,
  );
}

// שם החיבור בכרטיס הרשימה חייב להיות גם שם עמודו שלו — תקן הבית §1 („אותו שם בדיוק בכל מקום”).
// ההשוואה שלעיל משווה בין דפי רשימה בלבד, ולכן לא ראתה עקיפת כותרת ב-display-book-title
// („חזון דניאל ארמי־סורי” בכרטיסים, מול „חזון דניאל הסורי־ארמי” בעמוד עצמו).
let comparedPages = 0;
for (const [bookUrl, entries] of displayedTitlesByBookUrl) {
  const file = join(SITE_ROOT, bookUrl, "index.html");
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  if (!titleMatch) continue;
  const pageTitle = normalizeLinkText(titleMatch[1].split("|")[0]).trim();
  comparedPages += 1;
  const mismatch = entries.find((entry) => entry.title !== pageTitle);
  if (mismatch) {
    errors.push(
      `${bookUrl}: listing title '${mismatch.title}' (${mismatch.page}) differs from the work's own page title '${pageTitle}'`,
    );
  }

  // A book title already appears as the page H1; its first content H2 must not
  // repeat the same title a second time.
  const headingMatch = html.match(/class="text-header"[\\s\\S]*?<h1[^>]*>([\\s\\S]*?)<\\/h1>/);
  const contentMatch = html.match(/class="text-content">([\\s\\S]*?)<\\/div>/);
  const firstH2 = contentMatch?.[1]?.match(/<h2[^>]*>([\\s\\S]*?)<\\/h2>/);
  if (headingMatch && firstH2) {
    const pageHeading = normalizeLinkText(headingMatch[1]);
    const openingHeading = normalizeLinkText(firstH2[1]);
    if (pageHeading === openingHeading) {
      errors.push(
        `${bookUrl}: the opening H2 repeats the page H1 '${pageHeading}'`,
      );
    }
  }

  const hasChapterList = /class="table-of-contents[^"]*"[^>]*>[\\s\\S]*?<li[ >]/.test(html);
  if (hasChapterList && !html.includes('class="text-header__actions"')) {
    errors.push(
      `${bookUrl}: a book with chapters is missing the quick-start and contents links near its title`,
    );
  }
}

if (errors.length) {
  console.error("Display-book-title verification failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Display-book-title verification passed across ${seenPages.length} listing pages and ${displayedTitlesByBookUrl.size} book links (${comparedPages} compared with the works' own page titles).`,
);
