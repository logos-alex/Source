const { DateTime } = require("luxon");
const path = require("path");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/assets/");

  // Pagefind indexing
  eleventyConfig.on("eleventy.after", async function ({ dir }) {
    const inputPath = dir.output;
    const outputPath = path.join(dir.output, "pagefind");
    
    console.log("🔍 יוצר אינדקס Pagefind...");
    
    const pagefind = await import("pagefind");
    const { index } = await pagefind.createIndex();
    const { page_count } = await index.addDirectory({ path: inputPath });
    await index.writeFiles({ outputPath });
    
    console.log(`✅ Pagefind אינדקס: ${page_count} דפים`);
  });

  eleventyConfig.addCollection("textsByBook", (collectionApi) => {
    const books = {};
    // חשוב: השתמש ב-getFilteredByTag("texts") כדי לקחת רק את הדפים הנכונים
    collectionApi.getFilteredByTag("texts").forEach((item) => {
      const book = item.data.book;
      if (!book) return;
      if (!books[book]) books[book] = [];
      books[book].push(item);
    });
    for (const book in books) {
      books[book].sort((a, b) => a.data.pageNumber - b.data.pageNumber);
    }
    return books;
  });

  eleventyConfig.addFilter("date", (dateObj) => DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy"));
  eleventyConfig.addFilter("figureLink", (figure) => `/by-figure/${figure.toLowerCase().replace(/ /g, "-")}/`);
  eleventyConfig.addFilter("findIndexByUrl", (arr, url) => Array.isArray(arr) ? arr.findIndex(item => item.url === url) : -1);

  return {
    dir: { input: "src", output: "dist" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    serverOptions: {
      port: 5000,
      host: "0.0.0.0"
    }
  };
};
