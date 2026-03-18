import { readFileSync } from 'node:fs';

const checks = [
  {
    file: 'src/texts/arabic/sefer-megilot/index.md',
    mustInclude: [
      '### שער הבריאה והתולדות',
      '### עדות מן המצור על דמיאטה',
      '← להמשך הסדרה: [ספר קלמנטוס (נוסח געז)]'
    ],
    mustNotInclude: [
      '### מסגרת הסיפור ושאלת הפתיחה',
      '### עדי הנוסח ומהדורת הבסיס',
      'להמשך: [ספר קלמנטוס — הנוסח הגעז (חלק שני)]'
    ]
  },
  {
    file: 'src/texts/geez/clementos/index.md',
    mustInclude: [
      '### המשך המסירה בנוסח הגעז',
      '### מקומו של החיבור במסורת האתיופית',
      '← לתחילת הסדרה: [כּיתאב אל־מג׳אל (נוסח ערבי)]'
    ],
    mustNotInclude: [
      'תרגום עברי נאמן · החלק השני בסדרת "שמונת הספרים של קלמנטוס"',
      '### מיקום החיבור בסדרה',
      'לתחילת הסדרה: [כּיתאב אל-מג\'אל — הנוסח הערבי (חלק ראשון)]'
    ]
  }
];

let hasError = false;

for (const check of checks) {
  const text = readFileSync(check.file, 'utf8');

  for (const needle of check.mustInclude) {
    if (!text.includes(needle)) {
      console.error(`Missing required text in ${check.file}: ${needle}`);
      hasError = true;
    }
  }

  for (const needle of check.mustNotInclude) {
    if (text.includes(needle)) {
      console.error(`Found forbidden legacy text in ${check.file}: ${needle}`);
      hasError = true;
    }
  }
}

if (hasError) {
  process.exit(1);
}

console.log('Intro revision verification passed.');
