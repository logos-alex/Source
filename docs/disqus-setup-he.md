# הפעלת Disqus באתר

מערכת התגובות פעילה באמצעות ה-Shortname:
`hebrew-aramaic-sources`

## איפה התגובות מופיעות?
- בעמודי תוכן (פרקי טקסט).
- בעמודי מבוא של חיבורים.

## איפה לא מציגים תגובות?
- עמוד הבית, חיפוש, דפי ניווט כלליים ועמודי מערכת.

## קונפיגורציה מרכזית
ההגדרה נמצאת ב-`src/_data/site.json`:
```json
{
  "disqusShortname": "hebrew-aramaic-sources"
}
```

## בדיקה מהירה
- לוודא שבדפי תוכן נטען:
`https://hebrew-aramaic-sources.disqus.com/embed.js`
