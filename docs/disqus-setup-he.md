# הפעלת Disqus באתר

כרגע מערכת התגובות קיימת בקוד אך כבויה, כי בקובץ `src/_data/site.json` הערך `disqusShortname` ריק.

## למה זה לא עובד כרגע?
- בתבניות `text-page.njk` ו-`book-index.njk` התגובות נטענות רק אם `site.disqusShortname` מוגדר.
- כאשר הערך ריק, מוצגת הודעה: "מערכת התגובות כבויה כרגע בהגדרות האתר".

## איך מפעילים?
1. להיכנס ל-Disqus וליצור אתר חדש (או להשתמש באתר קיים).
2. לקחת את ה-Shortname של האתר.
3. לעדכן בקובץ `src/_data/site.json`:
```json
{
  "disqusShortname": "YOUR_SHORTNAME"
}
```
4. להריץ build ולפרוס:
```bash
npm run ci:verify
```

## בדיקה מהירה לאחר הפעלה
- להיכנס לאחד מעמודי התוכן ולוודא שמופיע `<div id="disqus_thread">` ושהסקריפט נטען מ-
  `https://YOUR_SHORTNAME.disqus.com/embed.js`.

## הערות חשובות
- מומלץ להגדיר ב-Disqus את ה-domain הראשי המדויק של האתר.
- אם בעתיד יוחלף הדומיין, כדאי לעדכן זאת גם ב-Disqus כדי למנוע פיצול thread IDs.
