import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const filters = new Map();
const passthroughCopies = [];
const eleventyConfig = {
  addFilter(name, fn) {
    filters.set(name, fn);
  },
  addPassthroughCopy(path) {
    passthroughCopies.push(path);
  }
};

require("../.eleventy.js")(eleventyConfig);

const displayBookTitle = filters.get("displayBookTitle");
const bookPages = filters.get("bookPages");

if (typeof displayBookTitle !== "function") {
  throw new Error("Could not load the displayBookTitle filter from .eleventy.js");
}

if (typeof bookPages !== "function") {
  throw new Error("Could not load the bookPages filter from .eleventy.js");
}

const specialBookTitle = displayBookTitle({
  data: {
    book: "apoc-daniel-syriac",
    title: "חזון דניאל (סורי-ארמי) – הקדמה"
  }
});

if (specialBookTitle !== "חזון דניאל ארמי-סורי") {
  throw new Error(
    `displayBookTitle returned '${specialBookTitle}' for apoc-daniel-syriac instead of 'חזון דניאל ארמי-סורי'`
  );
}

const trimmedIntroTitle = displayBookTitle("מבוא לספר לדוגמה");
if (trimmedIntroTitle !== "לדוגמה") {
  throw new Error(`displayBookTitle returned '${trimmedIntroTitle}' for a prefixed intro title instead of 'לדוגמה'`);
}

if (!passthroughCopies.includes("src/assets")) {
  throw new Error("Expected .eleventy.js to keep passthrough copy configured for src/assets");
}

console.log("Eleventy filter verification passed.");
