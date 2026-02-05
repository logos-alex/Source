const site = require("./src/_data/site.json");

module.exports = function(eleventyConfig) {
  // Custom filter to find an index by URL
  eleventyConfig.addFilter("findIndexByUrl", (items, url) => {
    if (!items || !url) return -1;
    return items.findIndex(item => item.url === url);
  });

  // Passthrough copy for assets
  eleventyConfig.addPassthroughCopy("src/assets");

  // Robust path-prefix filter for internal links
  eleventyConfig.addFilter("prefixUrl", (value) => {
    if (!value) return value;
    if (typeof value !== "string") return value;
    if (/^(https?:)?\/\//.test(value) || value.startsWith("#") || value.startsWith("mailto:") || value.startsWith("tel:")) return value;

    const configuredPrefix = (site.pathPrefix || "/Source/").replace(/\/+$/, "");
    if (value === "/") return `${configuredPrefix}/`;
    if (value.startsWith(configuredPrefix + "/") || value === configuredPrefix) return value;
    if (value.startsWith("/")) return `${configuredPrefix}${value}`;
    return value;
  });

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
