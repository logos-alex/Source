import fs from 'node:fs';

const checks = [
  {
    file: '_site/updates/index.html',
    includes: [
      '👤 הרחבת ציר "לפי דמות" (כולל קלמנס)',
      '💬 תגובות Disqus הופעלו לעמודי תוכן'
    ]
  },
  {
    file: '_site/by-figure/index.html',
    includes: [
      '/Source/by-figure/clement/',
      '>קלמנס<'
    ]
  },
  {
    file: '_site/texts/aramaic/apoc-daniel-syriac/index.html',
    includes: [
      'id="disqus_thread"',
      'hebrew-aramaic-sources.disqus.com/embed.js'
    ]
  },
  {
    file: '_site/texts/aramaic/apoc-daniel-syriac/page-1/index.html',
    includes: [
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
  for (const marker of check.includes) {
    if (!html.includes(marker)) {
      console.error(`❌ Missing marker in ${check.file}: ${marker}`);
      failures++;
    }
  }
}

if (failures > 0) {
  console.error(`\nRelease-content verification failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('Release-content verification passed.');
