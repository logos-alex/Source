const site = require("./src/_data/site.json");

module.exports = function(eleventyConfig) {
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
      .filter(item => item.data?.pageNumber || item.url?.includes('/page-'))
      .filter(item => includeIndex ? true : Number(item.data?.pageNumber || 0) > 0)
      .sort((a, b) => {
        const ap = Number(a.data?.pageNumber || 0);
        const bp = Number(b.data?.pageNumber || 0);
        if (ap !== bp) return ap - bp;
        return (a.url || '').localeCompare(b.url || '');
      });
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
