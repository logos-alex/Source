# הנחיות תוכן ו-Frontmatter

## מטרת המסמך
ליישר סטנדרט אחיד לעריכת תכנים במאגר, כדי להבטיח ניווט תקין, אינדוקס מלא, ועקביות תצוגה.

## 1) פרקי תוכן (`page-*.md`)
שדות חובה:
- `layout: text-page`
- `title`
- `book`
- `source`
- `figure`
- `pageNumber` (מספר שלם חיובי)

שדות מומלצים:
- `version`
- `notes`
- `draft`

כללים:
- `pageNumber` חייב להיות רציף בתוך כל ספר (ללא חורים/כפילויות).
- שמות `source` ו-`figure` חייבים להיות תואמים למילונים ב-`src/_data/languages.json` ו-`src/_data/figures.json`.

## 2) דף מבוא ספר (`index.md` בתוך ספר)
שדות חובה:
- `layout`
- `title`
- `book`
- `source`
- `figure`
- `permalink`

## 3) דף שפה (`src/texts/<language>/index.md`)
שדות חובה:
- `layout`
- `title`
- `permalink`

## 4) כללי עריכה טקסטואליים
- אין לשנות נוסח מקור ללא תיעוד מפורש.
- אם תרגום עדיין לא מאומת, לציין זאת בבירור בסוף הפרק.
- להשתמש בניסוח עקבי לכותרות פרקים (למשל: `פרק 1`, `פרק 2`...).

## 5) בדיקות לפני PR
להריץ תמיד:
```bash
npm run ci:verify
```

הפקודה כוללת:
- בדיקת frontmatter
- בדיקת מבנה רציפות פרקים
<<<<<<< HEAD
- בדיקת תאימות לקטלוג הספרים (book IDs)
- בדיקת אחידות כותרות פרקים
- build מלא
- בדיקת pathPrefix
- בדיקת קישורים שבורים בתוצר build
- בדיקת סימוני placeholder/TODO לא רצויים


## 6) יצירת פרק חדש (Scaffold)
להאצה ועקביות, ניתן ליצור תבנית פרק חדשה כך:
```bash
npm run new:chapter -- <texts/book/path> <pageNumber> <title> <source> <figure> [version]
```
דוגמה:
```bash
npm run new:chapter -- aramaic/apoc-daniel-syriac 32 "פרק 32" aramaic daniel main
```


## 7) דוח סטטוס תוכן
למיפוי מהיר של היקף עבודה תוכני (כמו פרקים ללא תרגום מאומת):
```bash
npm run report:content
```
התוצר נכתב ל-`docs/content-status-he.md`.
=======
- build מלא
- בדיקת pathPrefix
>>>>>>> origin/main
