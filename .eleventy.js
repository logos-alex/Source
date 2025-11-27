const { DateTime } = require("luxon");


const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/assets/");
  eleventyConfig.addPassthroughCopy("./src/google5ea0ab9870afd370.html");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
  
  // Copy pagefind index files from root to dist
  eleventyConfig.addPassthroughCopy({
    "pagefind": "pagefind"
  });
  
  // Copy pagefind UI library from node_modules
  eleventyConfig.addPassthroughCopy({
    "./node_modules/pagefind/dist": "pagefind-lib"
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
      books[book].sort((a, b) => {
        // Extract version from URL (a or b from /texts/.../ a/page-X or /texts/.../b/page-X)
        const versionA = a.url.includes('/a/') ? 'a' : (a.url.includes('/b/') ? 'b' : 'z');
        const versionB = b.url.includes('/a/') ? 'a' : (b.url.includes('/b/') ? 'b' : 'z');
        
        // Sort by version first (a before b), then by pageNumber
        if (versionA !== versionB) {
          return versionA.localeCompare(versionB);
        }
        return a.data.pageNumber - b.data.pageNumber;
      });
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
