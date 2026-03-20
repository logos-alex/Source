import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src/texts";
const errors = [];
const booksWithHebrewChapterTitles = new Set([
  "apoc-daniel-syriac",
  "young-daniel-syriac",
]);

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
  if (!rawTitle.includes("פרק")) return rawTitle;
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

  if (!title.includes("פרק")) {
    errors.push(`${file}: chapter title should include 'פרק' (got '${title}')`);
    return;
  }

  if (!usesHebrewChapterTitles(book)) return;

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
