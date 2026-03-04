import fs from 'node:fs';

const checks = [
  {
    file: '_site/updates/index.html',
    allOf: [
      '<div class="updates-grid" aria-label="רשימת עדכונים">',
      'updates-v2-2026-03-03'
    ],
    anyOf: [
      [
        '👤 נוספה קטגוריית דמות: קלמנס',
        '💬 נפתח אזור תגובות בעמודי תוכן'
      ],
      [
        '🧭 שדרוג ניווט ויציבות קישורים',
        '📝 כלי עבודה לעורכים'
      ]
    ]
  },
  {
    file: '_site/by-figure/index.html',
    allOf: [
      '/Source/by-figure/clement/',
      '>קלמנס<'
    ]
  },
  {
    file: '_site/texts/aramaic/apoc-daniel-syriac/index.html',
    allOf: [
      'id="disqus_thread"',
      'hebrew-aramaic-sources.disqus.com/embed.js'
    ]
  },
  {
    file: '_site/texts/aramaic/apoc-daniel-syriac/page-1/index.html',
    allOf: [
      'id="disqus_thread"',
      'hebrew-aramaic-sources.disqus.com/embed.js'
    ]
  }
];

let failures = 0;

for (const check of checks) {
  if (!fs.existsSync(check.file)) {
    console.error(`❌ Missing built file: ${check.file}`);
    failures++;
    continue;
  }

  const html = fs.readFileSync(check.file, 'utf8');

  for (const marker of check.allOf || []) {
    if (!html.includes(marker)) {
      console.error(`❌ Missing marker in ${check.file}: ${marker}`);
      failures++;
    }
  }

  if (check.anyOf?.length) {
    const matchedGroup = check.anyOf.some((group) => group.every((marker) => html.includes(marker)));
    if (!matchedGroup) {
      console.error(`❌ None of the accepted marker groups matched in ${check.file}`);
      failures++;
    }
  }
}

if (failures > 0) {
  console.error(`\nRelease-content verification failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('Release-content verification passed.');
