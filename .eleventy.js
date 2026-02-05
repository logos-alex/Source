const site = require("./src/_data/site.json");

module.exports = function(eleventyConfig) {
  // Custom filter to find an index by URL
  eleventyConfig.addFilter("findIndexByUrl", (items, url) => {
    if (!items || !url) return -1;
    return items.findIndex(item => item.url === url);
  });

  // Passthrough copy for assets
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    pathPrefix: "/Source/",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
