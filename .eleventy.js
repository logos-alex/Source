const site = require("./src/_data/site.json");
const { displayBookTitle } = require("./lib/display-book-title.cjs");

// Lightweight inline-markdown renderer for YAML note fields.
// Processes: **bold**, *italic*, `code`, --- (hr), and [N] footnote refs.
function renderInlineMarkdown(text) {
  if (!text) return "";
  let result = String(text);
  // Bold: **text** → <strong>text</strong>
  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Horizontal rule: --- on its own line → <hr>
  result = result.replace(/^---$/gm, "<hr>");
  // Italic: *text* → <em>text</em>
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
  // Inline code: `text` → <code>text</code>
  result = result.replace(/`(.+?)`/g, "<code>$1</code>");
  // Links: [text](url) → <a href="url">text</a> (but not [N] footnote refs)
  result = result.replace(/\[([^\]\d][^\]]*)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return result;
}

// Normalize a URL for safe comparison (trailing slashes, etc.)
function normalizeUrlForCompare(value = "") {
  return String(value).replace(/\/+$/, "");
}

module.exports = function(eleventyConfig) {
  const getPageNumber = (item, { prefix = "", book } = {}) => {
    const explicitPageNumber = Number(item?.data?.pageNumber);
    if (Number.isInteger(explicitPageNumber) && explicitPageNumber >= 0) {
      return explicitPageNumber;
    }

    const itemUrl = item?.url || "";
    const inCurrentBook = book ? item?.data?.book === book : itemUrl.startsWith(prefix);
    const normalizedPrefix = normalizeUrlForCompare(prefix);
    const isIntroPage =
      inCurrentBook &&
      (
        item?.inputPath?.endsWith("/index.md") ||
        (itemUrl && !itemUrl.includes("/page-") && normalizeUrlForCompare(itemUrl) === normalizedPrefix)
      );

    return isIntroPage ? 0 : null;
  };

  eleventyConfig.addFilter("renderMarkdownInline", renderInlineMarkdown);

  eleventyConfig.addFilter("renderNoteRefs", (text) => {
    if (!text) return "";
    // Apply renderInlineMarkdown on raw markdown text (not yet rendered to HTML).
    let result = renderInlineMarkdown(text);
    const seenRefs = new Set();
    result = result.replace(/\[(\d+)\]/g, (_, noteNumber) => {
      const isFirstReference = !seenRefs.has(noteNumber);
      seenRefs.add(noteNumber);
      const idAttr = isFirstReference ? ` id="ref-${noteNumber}"` : "";
      return `<sup class="note-ref"><a${idAttr} href="#note-${noteNumber}" aria-label="הערה ${noteNumber}">[${noteNumber}]</a></sup>`;
    });
    return result;
  });

  // Custom filter to find an index by URL (with URL normalization for robustness)
  eleventyConfig.addFilter("findIndexByUrl", (items, url) => {
    if (!items || !url) return -1;
    const normalizedUrl = normalizeUrlForCompare(url);
    return items.findIndex(item => normalizeUrlForCompare(item.url || "") === normalizedUrl);
  });

  eleventyConfig.addFilter("findCollectionItemByUrl", (items, url) => {
    if (!items || !url) return null;
    const normalizedUrl = normalizeUrlForCompare(url);
    return items.find(item => normalizeUrlForCompare(item.url || "") === normalizedUrl) || null;
  });

  eleventyConfig.addFilter("displayBookTitle", displayBookTitle);

  // Book pages with memoization to avoid O(n²) behavior across repeated calls.
  const _bookPagesCache = new Map();
  eleventyConfig.addFilter("bookPages", (items, currentUrl, book, includeIndex = true) => {
    if (!items || !currentUrl) return [];
    const cacheKey = `${currentUrl}|${book}|${includeIndex ? 1 : 0}`;
    if (_bookPagesCache.has(cacheKey)) return _bookPagesCache.get(cacheKey);

    const prefix = currentUrl.replace(/[^/]+\/?$/, "");
    const byBook = (item) => book && item.data?.book === book;
    const byPrefix = (item) => item.url && item.url.startsWith(prefix);
    // When both book and currentUrl are provided, filter by BOTH book AND prefix.
    // This allows multi-version books (e.g. apocalypse-abraham with a/ and b/)
    // to share the same book id while still being navigated separately.
    const matches = (item) => book ? (byBook(item) && byPrefix(item)) : byPrefix(item);

    const result = items
      .filter(item => !item.data?.draft)
      .filter(item => matches(item))
      .map(item => ({ item, pageNumber: getPageNumber(item, { prefix, book }) }))
      .filter(({ pageNumber, item }) => {
        // Warn about items that look like book chapters but have no resolvable pageNumber.
        if (pageNumber === null) {
          const looksLikeBookItem = (book && item?.data?.book === book) || (item?.url || "").startsWith(prefix);
          if (looksLikeBookItem && !item?.inputPath?.endsWith("/index.md")) {
            console.warn(`[bookPages] Item without pageNumber in book="${book}": ${item?.inputPath} (url=${item?.url})`);
          }
          return false;
        }
        return true;
      })
      .filter(({ pageNumber }) => includeIndex ? true : pageNumber > 0)
      .sort((a, b) => {
        const ap = a.pageNumber;
        const bp = b.pageNumber;
        if (ap !== bp) return ap - bp;
        return (a.item.url || '').localeCompare(b.item.url || '');
      })
      .map(({ item }) => item);

    _bookPagesCache.set(cacheKey, result);
    return result;
  });

  const toHebrewNumeral = (num) => {
    const n = Number(num);
    if (!Number.isInteger(n) || n <= 0) return "";
    if (n >= 1000) {
      // For very large numbers, fall back to gematria with thousands separator (geresh)
      const thousands = Math.floor(n / 1000);
      const remainder = n % 1000;
      const thousandsPart = toHebrewNumeral(thousands) + "'";
      return thousandsPart + (remainder > 0 ? toHebrewNumeral(remainder) : "");
    }
    const units = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
    const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
    const hundreds = ["", "ק", "ר", "ש", "ת"];

    // Special: 15 = טו, 16 = טז (avoid divine name)
    if (n === 15) return "טו";
    if (n === 16) return "טז";

    if (n < 10) return units[n];
    if (n < 100) {
      const t = Math.floor(n / 10);
      const u = n % 10;
      return `${tens[t]}${units[u]}`;
    }
    if (n < 400) {
      const h = Math.floor(n / 100);
      const remainder = n % 100;
      return `${hundreds[h]}${remainder > 0 ? toHebrewNumeral(remainder) : ""}`;
    }
    // 400–999: combine multiple ת's
    const tavs = Math.floor(n / 400);
    const remainder = n % 400;
    return "ת".repeat(tavs) + (remainder > 0 ? toHebrewNumeral(remainder) : "");
  };

  // Books marked with `parallelLayout: true` in sources-catalog.json use
  // Hebrew chapter titles (e.g. "פרק א", "פרק ב") and parallel source/translation layout.
  let _parallelBooksCache = null;
  function getParallelBooks() {
    if (_parallelBooksCache) return _parallelBooksCache;
    _parallelBooksCache = new Set();
    try {
      const catalog = require("./src/_data/sources-catalog.json");
      for (const book of catalog) {
        if (book && book.parallelLayout === true) {
          _parallelBooksCache.add(book.id);
        }
      }
    } catch (err) {
      throw new Error(`sources-catalog.json is required for parallelLayout resolution: ${err.message}`);
    }
    return _parallelBooksCache;
  }

  const usesHebrewChapterTitles = (book) => getParallelBooks().has(book);

  eleventyConfig.addFilter("toHebrewNumeral", toHebrewNumeral);
  eleventyConfig.addFilter("usesHebrewChapterTitles", usesHebrewChapterTitles);

  eleventyConfig.addFilter("chapterDisplayTitle", (item, book) => {
    if (!item) return "";
    const rawTitle = item.data?.title || "";
    if (!usesHebrewChapterTitles(book)) return rawTitle;
    if (!rawTitle.includes("פרק")) return rawTitle;
    const pageNumber = Number(item.data?.pageNumber || 0);
    if (pageNumber > 0) {
      return `פרק ${toHebrewNumeral(pageNumber)}`;
    }
    return rawTitle;
  });

  eleventyConfig.addFilter("normalizeBookTitle", (value) => {
    if (!value) return "";

    return String(value)
      .replace("מבוא לחיבור ", "")
      .replace("מבוא לספר ", "")
      .replace("חזון דניאל (סורי-ארמי) – הקדמה", "חזון דניאל ארמי-סורי")
      .replace("חזון דניאל הסורי-ארמי: הקדמה", "חזון דניאל ארמי-סורי")
      .replace("דניאל הקטן (ארמית-סורית): הקדמה", "דניאל הקטן")
      .replace(": הקדמה", "")
      .replace("הקדמה", "")
      .replace("מבוא", "")
      .trim();
  });

  // Helper filter: check if a value exists in an array (works for both arrays and strings).
  eleventyConfig.addFilter("hasTag", (tags, tag) => {
    if (!tags) return false;
    if (Array.isArray(tags)) return tags.includes(tag);
    if (typeof tags === "string") return tags === tag;
    return false;
  });

  // ISO date string for JSON-LD / schema.org
  eleventyConfig.addFilter("toISOString", (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString();
  });

  // JSON stringify for safe embedding in <script type="application/ld+json">
  eleventyConfig.addFilter("jsonify", (value) => {
    return JSON.stringify(value || "");
  });

  // Passthrough copy for assets and static files
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy("src/manifest.json");

  return {
    pathPrefix: site.pathPrefix,
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
