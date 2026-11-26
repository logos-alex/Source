// סטטיסטיקות הספרייה — מחושבות מן הקטלוג בעת הבנייה.
// מספרי דף־הבית נכתבו בעבר ידנית והתיישנו בכל תוספת (ארבעה → שישה → שנים־עשר → שלושה־עשר).
// מכאן ואילך הם נגזרים מ־sources-catalog.json, ואינם יכולים לסתור אותו.
const catalog = require("./sources-catalog.json");

const UNITS = {
  m: ["אפס", "אחד", "שניים", "שלושה", "ארבעה", "חמישה", "שישה", "שבעה", "שמונה", "תשעה"],
  f: ["אפס", "אחת", "שתיים", "שלוש", "ארבע", "חמש", "שש", "שבע", "שמונה", "תשע"],
};

const TEENS = {
  m: [
    "עשרה",
    "אחד עשר",
    "שנים עשר",
    "שלושה עשר",
    "ארבעה עשר",
    "חמישה עשר",
    "שישה עשר",
    "שבעה עשר",
    "שמונה עשר",
    "תשעה עשר",
  ],
  f: [
    "עשר",
    "אחת עשרה",
    "שתים עשרה",
    "שלוש עשרה",
    "ארבע עשרה",
    "חמש עשרה",
    "שש עשרה",
    "שבע עשרה",
    "שמונה עשרה",
    "תשע עשרה",
  ],
};

const TENS = [
  "",
  "",
  "עשרים",
  "שלושים",
  "ארבעים",
  "חמישים",
  "שישים",
  "שבעים",
  "שמונים",
  "תשעים",
];

// מספר במילים לפי מין שם־העצם: "m" לחיבורים (שלושה עשר חיבורים), "f" ללשונות (שמונה לשונות).
function numberWords(value, gender = "m") {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0 || n >= 100) return String(value);
  const g = gender === "f" ? "f" : "m";
  if (n < 10) return UNITS[g][n];
  if (n < 20) return TEENS[g][n - 10];
  const tens = TENS[Math.floor(n / 10)];
  const units = n % 10;
  return units ? `${tens} ו${UNITS[g][units]}` : tens;
}

module.exports = function () {
  const published = catalog.filter((entry) => !entry.comingSoon);
  const inPrep = catalog.filter((entry) => entry.comingSoon);
  const languages = new Set(catalog.map((entry) => entry.lang).filter(Boolean));
  const publishedLanguages = new Set(published.map((entry) => entry.lang).filter(Boolean));
  const publishedFigures = new Set(published.map((entry) => entry.figure).filter(Boolean));
  const figureStatus = {};

  for (const entry of catalog) {
    if (!entry.figure) continue;
    figureStatus[entry.figure] ||= { published: 0, inPrep: 0 };
    if (entry.comingSoon) figureStatus[entry.figure].inPrep += 1;
    else figureStatus[entry.figure].published += 1;
  }

  return {
    total: catalog.length,
    published: published.length,
    inPrep: inPrep.length,
    languages: languages.size,
    publishedLanguages: publishedLanguages.size,
    publishedFigures: publishedFigures.size,
    figureStatus,
    publishedHe: numberWords(published.length, "m"),
    inPrepHe: numberWords(inPrep.length, "m"),
    languagesHe: numberWords(languages.size, "f"),
  };
};
