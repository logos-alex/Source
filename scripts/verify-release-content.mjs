import fs from "node:fs";

const updates = JSON.parse(fs.readFileSync("src/_data/updates.json", "utf8"));
const site = JSON.parse(fs.readFileSync("src/_data/site.json", "utf8"));

const sitePrefix = normalizePrefix(site.pathPrefix || "/");

function normalizePrefix(prefix) {
  if (!prefix || prefix === "/") {
    return "";
  }

  return prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
}

function withSitePrefix(pathname) {
  return `${sitePrefix}${pathname}`;
}

function readBuiltFile(file) {
  if (!fs.existsSync(file)) return null;
  if (!fs.existsSync(file)) {
    throw new Error(`Missing built file: ${file}`);
  }

  return fs.readFileSync(file, "utf8");
}

function expectIncludes(html, marker, description, file, failures) {
  if (!html.includes(marker)) {
    console.error(`❌ Missing ${description} in ${file}: ${marker}`);
    failures.count += 1;
  }
}

function expectMatch(html, pattern, description, file, failures) {
  if (!pattern.test(html)) {
    console.error(`❌ Missing ${description} in ${file}: ${pattern}`);
    failures.count += 1;
  }
}

function expectMinimumCount(
  html,
  pattern,
  minimum,
  description,
  file,
  failures,
) {
  const matches = html.match(pattern) || [];
  if (matches.length < minimum) {
    console.error(
      `❌ Expected at least ${minimum} ${description} in ${file}, found ${matches.length}`,
    );
    failures.count += 1;
  }
}

const failures = { count: 0 };

try {
  const updatesFile = "_site/updates/index.html";
  const updatesHtml = readBuiltFile(updatesFile);

  expectMatch(
    updatesHtml,
    /<div\s+class="updates-grid"[^>]*aria-label="רשימת עדכונים"[\s\S]*?>/,
    "updates grid container",
    updatesFile,
    failures,
  );
  expectIncludes(
    updatesHtml,
    `data-release-series="${updates.release.series}"`,
    "release series marker",
    updatesFile,
    failures,
  );
  expectIncludes(
    updatesHtml,
    `data-release-id="${updates.release.id}"`,
    "release id marker",
    updatesFile,
    failures,
  );
  expectIncludes(
    updatesHtml,
    `data-min-cards="${updates.release.minimumCardCount}"`,
    "minimum-card marker",
    updatesFile,
    failures,
  );
  expectMinimumCount(
    updatesHtml,
    /<article\b[^>]*class="[^"]*\bupdate-card\b[^"]*"[^>]*data-update-id="[^"]+"/g,
    updates.release.minimumCardCount,
    "release cards with stable ids",
    updatesFile,
    failures,
  );

  for (const item of updates.items) {
    expectIncludes(
      updatesHtml,
      `data-update-id="${item.id}"`,
      `update id '${item.id}'`,
      updatesFile,
      failures,
    );

    const joinedFlags = (item.flags || []).join(" ");
    if (joinedFlags) {
      expectIncludes(
        updatesHtml,
        `data-update-flags="${joinedFlags}"`,
        `flag set for update '${item.id}'`,
        updatesFile,
        failures,
      );
    }

    for (const link of item.links || []) {
      expectIncludes(
        updatesHtml,
        `data-critical-link="${link.id}"`,
        `critical link id '${link.id}'`,
        updatesFile,
        failures,
      );
      expectIncludes(
        updatesHtml,
        `href="${withSitePrefix(link.href)}"`,
        `critical link href '${link.href}'`,
        updatesFile,
        failures,
      );
    }
  }
} catch (error) {
  console.error(`❌ ${error.message}`);
  failures.count += 1;
}

for (const check of [
  {
    file: "_site/by-figure/index.html",
    markers: [
      'data-figure-key="talmidei-yeshua"',
      `href="${withSitePrefix("/by-figure/talmidei-yeshua/")}"`,
    ],
  },
  {
    file: "_site/texts/aramaic/apoc-daniel-syriac/index.html",
    markers: ['id="comments-section"', 'id="disqus_thread"'],
  },
  {
    file: "_site/texts/aramaic/apoc-daniel-syriac/page-1/index.html",
    markers: ['id="comments-section"', 'id="disqus_thread"'],
  },
]) {
  try {
    const html = readBuiltFile(check.file);
    if (!html) continue;
    for (const marker of check.markers) {
      expectIncludes(html, marker, "release marker", check.file, failures);
    }
  } catch (error) {
    console.error(`❌ ${error.message}`);
    failures.count += 1;
  }
}

// „בקרוב במאגר” אינו רשאי למנות חיבור שכבר פעיל — רשומה כזו סותרת את הספרייה פנים אל פנים.
try {
  const catalog = JSON.parse(
    fs.readFileSync("src/_data/sources-catalog.json", "utf8"),
  );
  const publishedTitles = catalog
    .filter((entry) => !entry.comingSoon && entry.title)
    .map((entry) => String(entry.title).trim());

  for (const group of updates.upcoming?.groups || []) {
    for (const text of group.texts || []) {
      const label = String(text).trim();
      const stale = publishedTitles.find(
        (title) => label === title || label.startsWith(`${title} —`),
      );
      if (stale) {
        console.error(
          `❌ updates.json "upcoming" lists an already-published work: "${label}" (catalog title: "${stale}")`,
        );
        failures.count += 1;
      }
    }
  }
} catch (error) {
  console.error(`❌ ${error.message}`);
  failures.count += 1;
}

// דף הבית הוא שער עריכתי: פתיחה מן המקורות, מבוא, חיבורים נבחרים ודרכי עיון.
try {
  const homeFile = "_site/index.html";
  const home = readBuiltFile(homeFile);
  const markers = [
    'id="home-title"',
    'אוצר הכתבים הגנוזים',
    'class="home-opening-panel"',
    '<summary>ותרגומו</summary>',
    'class="home-preface"',
    'data-home-featured="apocalypse-abraham"',
    'data-home-featured="apoc-daniel-syriac"',
    'data-home-featured="maale-yeshayahu"',
    'data-home-featured="tsavaat-yaakov"',
    'class="home-navigation"',
    'class="home-latest"',
    'חיפוש בכתבים',
  ];
  for (const marker of markers) {
    expectIncludes(home, marker, "homepage entry element", homeFile, failures);
  }

  const featuredCount = (home.match(/class="home-work-card" data-home-featured=/g) || []).length;
  if (featuredCount !== 4) {
    console.error("❌ Expected four curated homepage works, found " + featuredCount);
    failures.count += 1;
  }
} catch (error) {
  console.error("❌ " + error.message);
  failures.count += 1;
}

// מפתח הייחוסים חייב להציג גם את הדמויות שכבר יש להן חיבורים פעילים.
try {
  const figureFile = "_site/by-figure/index.html";
  const figuresHtml = readBuiltFile(figureFile);
  for (const key of ["yitzchak", "yaakov", "eliyahu"]) {
    expectIncludes(
      figuresHtml,
      `data-figure-key="${key}"`,
      `published figure '${key}' in the index`,
      figureFile,
      failures,
    );
  }
  expectIncludes(
    figuresHtml,
    "בהכנה",
    "preparation status in the figure index",
    figureFile,
    failures,
  );
} catch (error) {
  console.error("❌ " + error.message);
  failures.count += 1;
}

// קישורי מדפי התנ״ך בפוטר מפנים לעוגנים בספרייה, לא לעמודי דמויות שאינם קיימים.
try {
  const homeFile = "_site/index.html";
  const home = readBuiltFile(homeFile);
  for (const key of ["torah", "neviim", "ketuvim", "talmidei-yeshua"]) {
    expectIncludes(
      home,
      `href="${withSitePrefix("/texts/#" + key)}"`,
      `footer/library link for section '${key}'`,
      homeFile,
      failures,
    );
  }
} catch (error) {
  console.error("❌ " + error.message);
  failures.count += 1;
}

if (failures.count > 0) {
  console.error(
    `\nRelease-content verification failed with ${failures.count} issue(s).`,
  );
  process.exit(1);
}

console.log("Release-content verification passed.");
