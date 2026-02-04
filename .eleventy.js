
const sourcesData = require('./src/_data/sources.json');

module.exports = function(eleventyConfig) {

  // Custom filter to find the index of a page in a collection by its URL
  eleventyConfig.addFilter("findIndexByUrl", (items, url) => {
    return items.findIndex(item => item.url === url);
  });

  // Create a custom collection for each text source dynamically
  for (const source of sourcesData.sources) {
    for (const versionKey in source.versions) {
      const version = source.versions[versionKey];
      const collectionName = `${source.id}-${versionKey}`;
      const textPath = `src/texts/${source.lang}/${source.id}/${versionKey}`;

      eleventyConfig.addCollection(collectionName, function(collectionApi) {
        // Use a glob pattern to get all markdown files in the specific version's directory
        return collectionApi.getFilteredByGlob(`${textPath}/*.md`).sort((a, b) => {
          // Sort by filename to ensure correct order
          return a.inputPath.localeCompare(b.inputPath, undefined, { numeric: true, sensitivity: 'base' });
        });
      });
    }
  }

  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy("src/google5ea0ab9870afd370.html");
  eleventyConfig.addPassthroughCopy({"pagefind": "pagefind"});


  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
