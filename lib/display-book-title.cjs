const SPECIAL_DISPLAY_TITLES_BY_BOOK = new Map([
  ["apoc-daniel-syriac", "חזון דניאל ארמי-סורי"],
  ["young-daniel-syriac", "דניאל הקטן"],
]);

const SPECIAL_DISPLAY_TITLES_BY_RAW_TITLE = new Map([
  ["חזון דניאל (סורי-ארמי) – הקדמה", "חזון דניאל ארמי-סורי"],
  ["חזון דניאל הסורי-ארמי: הקדמה", "חזון דניאל ארמי-סורי"],
  ["דניאל הקטן (ארמית-סורית): הקדמה", "דניאל הקטן"],
]);

function pickTitleAndBook(input, fallbackTitle = "") {
  if (typeof input === "string") {
    return { title: input, book: "" };
  }

  if (input && typeof input === "object") {
    return {
      title: input.data?.title || input.title || fallbackTitle || "",
      book: input.data?.book || input.book || "",
    };
  }

  return { title: fallbackTitle || "", book: "" };
}

function displayBookTitle(input, fallbackTitle = "") {
  const { title, book } = pickTitleAndBook(input, fallbackTitle);
  const rawTitle = String(title || "").trim();

  if (!rawTitle && !book) return "";

  if (book && SPECIAL_DISPLAY_TITLES_BY_BOOK.has(book)) {
    return SPECIAL_DISPLAY_TITLES_BY_BOOK.get(book);
  }

  if (SPECIAL_DISPLAY_TITLES_BY_RAW_TITLE.has(rawTitle)) {
    return SPECIAL_DISPLAY_TITLES_BY_RAW_TITLE.get(rawTitle);
  }

  return rawTitle
    .replace(/^מבוא לחיבור\s+/, "")
    .replace(/^מבוא לספר\s+/, "")
    .replace(/: \u05d4\u05e7\u05d3\u05de\u05d4$/, "")
    .replace(/\s*\u2013\s*\u05d4\u05e7\u05d3\u05de\u05d4$/, "")
    .replace(/\s+\u05d4\u05e7\u05d3\u05de\u05d4$/, "")
    .replace(/^מבוא\s*/, "")
    .trim();
}

module.exports = {
  displayBookTitle,
  SPECIAL_DISPLAY_TITLES_BY_BOOK,
  SPECIAL_DISPLAY_TITLES_BY_RAW_TITLE,
};
