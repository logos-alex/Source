const site = require("./src/_data/site.json");

module.exports = function(eleventyConfig) {
  const normalizeUrl = (value = "") => String(value).replace(/\/+$/, "");
  const getPageNumber = (item, { prefix = "", book } = {}) => {
    const explicitPageNumber = Number(item?.data?.pageNumber);
    if (Number.isInteger(explicitPageNumber) && explicitPageNumber >= 0) {
      return explicitPageNumber;
    }

    const itemUrl = item?.url || "";
    const inCurrentBook = book ? item?.data?.book === book : itemUrl.startsWith(prefix);
    const normalizedPrefix = normalizeUrl(prefix);
    const isIntroPage =
      inCurrentBook &&
      (
        item?.inputPath?.endsWith("/index.md") ||
        (itemUrl && !itemUrl.includes("/page-") && normalizeUrl(itemUrl) === normalizedPrefix)
      );

    return isIntroPage ? 0 : null;
  };

  eleventyConfig.addFilter("renderNoteRefs", (html) => {
    if (!html) return "";
    const seenRefs = new Set();
    return String(html).replace(/\[(\d+)\]/g, (_, noteNumber) => {
      const isFirstReference = !seenRefs.has(noteNumber);
      seenRefs.add(noteNumber);
      const idAttr = isFirstReference ? ` id="ref-${noteNumber}"` : "";
      return `<sup class="note-ref"><a${idAttr} href="#note-${noteNumber}" aria-label="הערה ${noteNumber}">[${noteNumber}]</a></sup>`;
    });
  });

  // Custom filter to find an index by URL
  eleventyConfig.addFilter("findIndexByUrl", (items, url) => {
    if (!items || !url) return -1;
    return items.findIndex(item => item.url === url);
  });

  
  eleventyConfig.addFilter("bookPages", (items, currentUrl, book, includeIndex = true) => {
    if (!items || !currentUrl) return [];
    const prefix = currentUrl.replace(/[^/]+\/?$/, "");
    const byBook = (item) => book && item.data?.book === book;
    const byPrefix = (item) => item.url && item.url.startsWith(prefix);

    return items
      .filter(item => !item.data?.draft)
      .filter(item => book ? byBook(item) : byPrefix(item))
      .map(item => ({ item, pageNumber: getPageNumber(item, { prefix, book }) }))
      .filter(({ pageNumber }) => pageNumber !== null)
      .filter(({ pageNumber }) => includeIndex ? true : pageNumber > 0)
      .sort((a, b) => {
        const ap = a.pageNumber;
        const bp = b.pageNumber;
        if (ap !== bp) return ap - bp;
        return (a.item.url || '').localeCompare(b.item.url || '');
      })
      .map(({ item }) => item);
  });



  const toHebrewNumeral = (num) => {
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
  };

  eleventyConfig.addFilter("toHebrewNumeral", toHebrewNumeral);

  eleventyConfig.addFilter("chapterDisplayTitle", (item, book) => {
    if (!item) return "";
    const rawTitle = item.data?.title || "";
    if (book !== "apoc-daniel-syriac") return rawTitle;
    if (!rawTitle.includes("פרק")) return rawTitle;
    if (/פרק\s+[א-ת״'"׳]+/.test(rawTitle)) return rawTitle;
    const pageNumber = Number(item.data?.pageNumber || 0);
    if (pageNumber > 0) {
      return `פרק ${toHebrewNumeral(pageNumber)}`;
    }
    return rawTitle;
  });
  // Passthrough copy for assets and static files
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/_redirects");

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
