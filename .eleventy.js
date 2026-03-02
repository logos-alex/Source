const site = require("./src/_data/site.json");

module.exports = function(eleventyConfig) {
  // Custom filter to find an index by URL
  eleventyConfig.addFilter("findIndexByUrl", (items, url) => {
    if (!items || !url) return -1;
    return items.findIndex(item => item.url === url);
  });

  
  eleventyConfig.addFilter("bookPages", (items, currentUrl, book) => {
    if (!items || !currentUrl) return [];
    const prefix = currentUrl.replace(/[^/]+\/?$/, "");
    return items
      .filter(item => !item.data?.draft)
      .filter(item => (book && item.data?.book === book) || (item.url && item.url.startsWith(prefix)))
      .filter(item => item.data?.pageNumber || item.url?.includes('/page-'))
      .sort((a, b) => {
        const ap = Number(a.data?.pageNumber || 0);
        const bp = Number(b.data?.pageNumber || 0);
        if (ap !== bp) return ap - bp;
        return (a.url || '').localeCompare(b.url || '');
      });
  });

  // Passthrough copy for assets
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    pathPrefix: "/Source/",
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
