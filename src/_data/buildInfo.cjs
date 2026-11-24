const { execSync } = require("node:child_process");
const { existsSync } = require("node:fs");

function safeExec(command) {
  try {
    return execSync(command, { encoding: "utf8", timeout: 2000 }).trim();
  } catch (_) {
    return "unknown";
  }
}

// ---------------------------------------------------------------------------
// תולדות הקבצים מהיסטוריית הגיט — בקריאה אחת לכל האתר.
//
// תאריך הקובץ בדיסק אינו תאריך של התוכן: בשרת (ובכל הוצאה טרייה) הוא רגע
// ההוצאה מן הגיט. עד 24.11.2026 כל עמוד הכריז בנתוני ה־SEO ששונה ברגע הפריסה.
// מכאן ואילך: תאריך שינוי = הקומיט האחרון שנגע בקובץ, תאריך פרסום = הקומיט
// הראשון שבו הופיע. אין היסטוריה (למשל שיבוט רדוד) — אין תאריך; לא ממציאים.
// ---------------------------------------------------------------------------
const _historyByPath = new Map(); // "src/a/b.md" -> { first, last } (ISO 8601)
let _historyLoaded = false;

function normalizeRepoPath(filePath) {
  return String(filePath)
    .replace(/\\/g, "/")
    .replace(/^\.\//, "");
}

function loadGitHistory() {
  if (_historyLoaded) return;
  _historyLoaded = true;
  let out = "";
  try {
    out = execSync(
      'git -c core.quotepath=false log --format=@%cI --name-only --no-renames -- src',
      {
        encoding: "utf8",
        timeout: 15000,
        maxBuffer: 64 * 1024 * 1024,
        stdio: ["pipe", "pipe", "ignore"],
      },
    );
  } catch (_) {
    return; // אין גיט או אין היסטוריה — כל התאריכים יישארו ריקים
  }

  let date = null;
  for (const rawLine of out.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line[0] === "@") {
      date = line.slice(1);
      continue;
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}/.test(date)) continue;
    const entry = _historyByPath.get(line);
    if (entry) {
      entry.first = date; // הקומיטים מודפסים מן החדש אל הישן
    } else {
      _historyByPath.set(line, { first: date, last: date });
    }
  }
}

// נתיב שאינו תחת src/ (או שיבוט שבו אין רשומה): שאילת פר־קובץ, ואם אין — אין תאריך.
function singleFileDate(filePath, extraArgs) {
  let result = null;
  try {
    const iso = execSync(
      `git -c core.quotepath=false log ${extraArgs} --format=%cI -- "${filePath}"`,
      {
        encoding: "utf8",
        timeout: 2000,
        stdio: ["pipe", "pipe", "ignore"],
      },
    )
      .trim()
      .split(/\r?\n/)
      .filter((line) => /^\d{4}-\d{2}-\d{2}/.test(line));
    if (iso.length) result = extraArgs ? iso[iso.length - 1] : iso[0];
  } catch (_) {
    result = null;
  }
  return result;
}

function dateFor(filePath, which) {
  if (!filePath || !existsSync(filePath)) return null;
  const key = normalizeRepoPath(filePath);
  if (key.startsWith("src/")) {
    loadGitHistory();
    const entry = _historyByPath.get(key);
    if (entry) return entry[which];
  }
  return singleFileDate(
    filePath,
    which === "first" ? "--diff-filter=A" : "-1",
  );
}

function getGitLastModified(filePath) {
  return dateFor(filePath, "last");
}

function getGitFirstAdded(filePath) {
  return dateFor(filePath, "first");
}

module.exports = {
  commitShort: safeExec("git rev-parse --short HEAD"),
  branch: safeExec("git rev-parse --abbrev-ref HEAD"),
  builtAtUTC: new Date().toISOString(),
  buildYear: new Date().getFullYear(),
  getGitLastModified,
  getGitFirstAdded,
};
