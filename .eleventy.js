const { DateTime } = require("luxon");


module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/assets/");
  eleventyConfig.addPassthroughCopy("./src/google5ea0ab9870afd370.html");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");

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
