import { readFileSync } from 'node:fs';

const checks = [
  {
    file: 'src/texts/arabic/sefer-megilot/index.md',
    mustInclude: [
      'הנוסח הערבי',
      '### שם החיבור ומסורת הייחוס'
    ],
    mustNotInclude: [
      'הנוסח הערבי · החלק הראשון בסדרת "שמונת הספרים של קלמנטוס"',
      '### שם החיבור וייחוסו',
      'להמשך: [ספר קלמנטוס — הנוסח הגעז (חלק שני)]'
    ]
  },
  {
    file: 'src/texts/geez/clementos/index.md',
    mustInclude: [
      'תרגום עברי נאמן למקור הגעז',
      '### מיקום החיבור במסירה הקלמנטינית'
    ],
    mustNotInclude: [
      'תרגום עברי נאמן · החלק השני בסדרת "שמונת הספרים של קלמנטוס"',
      'המשך ישיר של כּיתאב אל-מג\'אל — חלק ראשון',
      '### מיקום החיבור בסדרה'
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
