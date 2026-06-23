import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src/texts";
const errors = [];
// Books that use strict "פרק N" chapter titles (normalized by chapterDisplayTitle filter).
// Note: sichat-moshe uses "חטיבה"/"נספח" patterns and is excluded from strict validation.
const booksWithHebrewChapterTitles = new Set([
  "apoc-daniel-syriac",
  "young-daniel-syriac",
  "clementine-r1",
  "clementine-r2",
  "clementine-r3",
  "clementine-r4",
  "clementine-homilies",
]);

// Pages whose titles legitimately don't start with "פרק" even in books that normally use it
// (e.g. appendices, page references in second half of a book).
const TITLE_EXCEPTIONS = new Set([
  "src/texts/aramaic/clementine-homilies/page-23.md", // נספח פילולוגי
  "src/texts/aramaic/clementine-r1/page-61.md",
  "src/texts/aramaic/clementine-r2/page-76.md",
  "src/texts/aramaic/clementine-r3/page-55.md",
  "src/texts/aramaic/clementine-r4/page-3.md",
]);

// Title patterns that are legitimate alternatives to "פרק N" in Hebrew-chapter-title books.
const LEGITIMATE_TITLE_PATTERNS = [
  /^\[עמוד/,        // [עמוד 48] — part II page references in apoc-daniel-syriac
  /^נספח/,          // נספח פילולוגי
  /^פתיחה/,         // פתיחה
  /^חטיבה/,         // חטיבה א
  /^חתימה/,         // חתימה
];

function toHebrewNumeral(num) {
  const n = Number(num);
  if (!Number.isInteger(n) || n <= 0) return "";
  const units = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
  const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
  if (n === 15) return "טו";
  if (n === 16) return "טז";
  if (n < 10) return units[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    return `${tens[t]}${units[u]}`;
  }
  return String(n);
}

function usesHebrewChapterTitles(book) {
  return booksWithHebrewChapterTitles.has(book);
}

function normalizedChapterDisplayTitle({ title, pageNumber, book }) {
  const rawTitle = title || "";
  if (!usesHebrewChapterTitles(book)) return rawTitle;
  // Match "פרק" with or without niqqud
  const stripped = rawTitle.replace(/[\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7]/g, "");
  if (!stripped.includes("פרק")) return rawTitle;
  const page = Number(pageNumber || 0);
  if (page > 0) return `פרק ${toHebrewNumeral(page)}`;
  return rawTitle;
}

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
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, "") : "";
}

function check(file) {
  const fm = frontmatter(readFileSync(file, "utf8"));
  if (!fm) return;

  const title = readKey(fm, "title");
  const book = readKey(fm, "book");
  const pageNumber = readKey(fm, "pageNumber");

  // Only enforce strict "פרק N" format for books that use Hebrew chapter titles.
  // Other books may use varied title patterns: "חזיון א", "פתיחה", "נספח א",
  // "4Q201 · 4QEnʾa", "פסוקים 1–15", "פֶּרֶק ח" (with niqqud), etc.
  if (!usesHebrewChapterTitles(book)) return;

  // Skip pages with legitimate non-"פרק" titles (appendices, part II page refs, etc.)
  const relPath = file.replace(/\\/g, "/");
  if (TITLE_EXCEPTIONS.has(relPath)) return;

  // Also skip pages whose titles match a known legitimate pattern
  if (LEGITIMATE_TITLE_PATTERNS.some(re => re.test(title))) return;

  // For Hebrew-chapter-title books, validate the title contains "פרק" and
  // that the chapterDisplayTitle filter would normalize it correctly.
  const stripped = (title || "").replace(/[\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7]/g, "");
  if (!stripped.includes("פרק")) {
    errors.push(`${file}: chapter title should include 'פרק' for book '${book}' (got '${title}')`);
    return;
  }

  const normalizedTitle = normalizedChapterDisplayTitle({ title, pageNumber, book });
  const expectedTitle = `פרק ${toHebrewNumeral(pageNumber)}`;

  if (normalizedTitle !== expectedTitle) {
    errors.push(`${file}: normalized chapter title should be '${expectedTitle}' (got '${normalizedTitle}')`);
  }
}

walk(ROOT);

if (errors.length) {
  console.error("Chapter-title verification failed:\n");
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log("Chapter-title verification passed.");
