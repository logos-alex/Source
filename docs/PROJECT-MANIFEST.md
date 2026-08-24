# אפוקריפה — מסמך הכיוון וההבנה
## להעברה ל-AI/סביבת עבודה חדשה

> מסמך זה מכיל את מלוא הידע המובנה על פרויקט אפוקריפה — כיוון עריכה, ארכיטקטורה טכנית, אמות מידה, והיסטוריית החלטות. קרא אותו במלואו לפני כל עבודה על הפרויקט.

---

## 1. מהו אפוקריפה

**אפוקריפה — התנ״ך האפוקריפי** הוא ארכיון דיגיטלי עברי של חיבורים חיצוניים (אפוקריפיים) מ־8 שפות מקור: סלאבית, ארמית, יוונית, לטינית, סורית, ערבית, ארמנית, עברית (וגעז). האתר מציג מהדורות עבריות של חיבורים שאבדו במקורם העברי ונשתמרו בתרגומים בשפות אחרות.

### מיתוג

| רכיב | ערך |
|---|---|
| **לוגו ויזואלי** | ΛΟΓΙΑ (יוונית — נשמר כאלמנט גרפי מזהה) |
| **שם ראשי** | אפוקריפה |
| **כותרת משנה** | התנ״ך האפוקריפי |
| **תג נוסף** | בית המדרש לספרים חיצוניים |
| **תיאור** | "אפוקריפה הוא ניסיון להשיב, ולו בחלקם, קולות אלה אל לשון מוצאם" |
| **ערוץ YouTube (מתוכנן)** | "אפוקריפה" (שם קצר וקולח) |

### היסטוריית מיתוג

הפרויקט נקרא בעבר "LOGIA — אוצר הכתבים הגנוזים". באוגוסט 2026 שונה המיתוג ל"אפוקריפה — התנ״ך האפוקריפי". הלוגו היווני ΛΟΓIA נשמר כאלמנט ויזואלי. הסיבות לשינוי:
- "אפוקריפה" קצר, קולח, זכיר
- המונח APOKRIFI מופיע ממש בכתבי־היד הסלאביים עצמם
- "התנ״ך האפוקריפי" מבהיר את היקף הפרויקט
- "בית המדרש לספרים חיצוניים" נותן טון מסורתי

### פרטים טכניים

- **URL חי:** https://logos-alex.github.io/Source/
- **מאגר GitHub:** https://github.com/logos-alex/Source
- **טכנולוגיה:** Eleventy 3 (Nunjucks templates), Pagefind search, GitHub Pages
- **שפת ממשק:** עברית (RTL)
- **מספר חיבורים בקטלוג:** 30
- **חיבורים מפורסמים (עם תוכן מלא):** 2 — חזון אברהם (3 נוסחים, סלאבית) + מעשה יצחק (4 פרקים, ערבית — בתרגום עברי ראשון מתוך Arabe 5072)
- **חיבורים בהכנה:** 28 — `comingSoon: true`

---

## 2. כיוון עריכה — הכללים החשובים ביותר

### 2.1. מסגרת מסורתית־כבודה, לא אקדמית־ביקורתית

הכיוון שנקבע: **מסורתי/כבוד**, לא אקדמי־ביקורתי. החיבורים מוצגים בכבוד, כחלק ממורשת ישראל, לא כ"טקסטים לניתוח ביקורתי".

### 2.2. מה אסור (רשימה שלילית)

| אסור | למה | תחליף |
|---|---|---|
| "פסאודאפיגרף" / "פסבדואפיגרף" | טרמינולוגיה אקדמית־ביקורתית | "חיבור המיוחס ל־X" |
| "שחזור פילולוגי" / "retroversion" | מסגרת אקדמית | "הועתק ללשון עברי" |
| "הנדסה לאחור" | מסגרת אקדמית | "הועתק ללשון עברי" |
| "רגיסטר" (בהקשר לשוני) | מסגרת אקדמית | תיאור נייטרלי |
| "מתודולוגיה" / "הערה מתודולוגית" | מסגרת אקדמית | להסיר לחלוטין |
| שמות חוקרים (Kulik, Rubinkiewicz, Porfiriev, Tikhonravov, Box, James, Ginzberg, Flusser, Kalemkiar, Bogaert, Schwegler, Lagarde, Migne, טישנדורף, Volters, DiTommaso, La Porta) | מסגרת אקדמית | להסיר לחלוטין |
| "מהדורה ביקורתית" / "מהדורה מדעית" | מסגרת אקדמית | "נוסח מתוקן" |
| סעיפי "מראי מקום עיקריים" | מסגרת אקדמית | להסיר לחלוטין |
| "OpenITI" כמקור | מקור בעייתי | שם השפה בלבד |
| "Dynamic Geonic Rendering" | טרמינולוגיה מתיימרת | "הועתק ללשון עברי" |
| פנייה ישירה לקולגה ("אם תרצה", "כפי שביקשת") | לא מתאים לפרסום | להסיר לחלוטין |
| גוף ראשון ("תרגמתי", "השארתי", "שובצתי") | לא מתאים לפרסום | סביל נייטרלי ("הובא", "הושאר", "שובץ") |

### 2.3. נוסחת התרגום האחידה

כל חיבור חייב לכלול את הנוסחה הזו במבוא שלו:

> **"הועתק ללשון עברי מלשון X — אפוקריפה"**

כאשר X = שפת המקור (סלאבית, ארמית, יוונית, לטינית, סורית, ערבית, ארמנית, עברית, געז).

### 2.4. מעמד החיבור — Badge system

- **`rarity: unpublished`** — רק לחיבורים שמתפרסמים לראשונה מתוך כתב־יד שלא הודפס מעולם. **לא** לחיבורים שהם תרגום משפה אחרת (כמו חזון אברהם — זה תרגום מסלאבית, לא כתב־יד חדש).

### 2.5. עמדה לגבי המונח "אפוקריפה"

הפרויקט משתמש במונח "אפוקריפה" במובן הרחב ביותר — "ספרים חיצוניים" במובן המסורתי־יהודי. ההבחנה האקדמית המודרנית בין "אפוקריפה" ל"פסאודאפיגרפיה" אינה רלוונטית לפרויקט. במסורת היהודית, כל החיבורים החיצוניים נקראו "ספרים חיצוניים" ללא הבחנה. המונח APOKRIFI מופיע ממש בכתבי־היד הסלאביים עצמם.

### 2.6. סגנון מבואות — מסגרת "מסע החיבור", לא מסגרת פילולוגית

המבואות מציגים את **מסעו של החיבור** — כיצד חיבור שנולד בלשון הקודש נישא בין הלשונות ושב אל העברית — ולא משפט פילולוגי על "המקור".

| אסור / מיותר | למה | תחליף |
|---|---|---|
| "החיבור נכתב במקורו בערבית / בסלאבית / ביוונית" | מציג את שפת השרידה כשפת החיבור, בניגוד לרוח הפרויקט | "מובא כאן על פי נוסח ששרד בלשון X" / נוסחת ההעתקה |
| "העד הקרוב ביותר לנוסחנו הוא..." | לשון אקדמית־ביקורתית | "כאן מובא החיבור על פי נוסח ששרד בכתב־יד Y, ובו הוא נקרא Z" |
| "אותה כותרת שממנה נטלנו את שם חיבורנו" | גוף ראשון + מסגרת ביקורתית | "אותה כותרת שממנה נטל חיבור זה את שמו" |
| פרטי קטלוג טכניים (דפים 92א–98ב, ידי מעתיק, בעלים) | מיותר לקורא; מסגרת ארכיונית | להשמיט, אלא אם יש בהם משמעות תוכנית |
| "מהדורה מודפסת לא נמצאה... בתרגום עברי ראשון" | נימוק ערך אקדמי | "נוסח זה לא הודפס מעולם, והוא מובא כאן בלשון עברי לראשונה — אפוקריפה" |

**הכלל:** כל אזכור של שפת השרידה או של כתב־היד נעשה דרך סיפור מסע החיבור ("שרד ב...", "מובא על פי...", "הועתק מלשון..."), לא דרך הצהרה על "המקור". כותרות סעיפים: "מסעו של החיבור", "על פי איזה עד מובא הנוסח", "מקומו במסורת ישראל" — לא "מקור החיבור".

---

## 3. ארכיטקטורה טכנית

### 3.1. מבנה תיקיות

```
Source/
├── .eleventy.js              # קונפיגורציית Eleventy + פילטרים
├── src/
│   ├── _includes/            # תבניות Nunjucks
│   │   ├── base.njk          # תבנית בסיס (head, header, footer, JSON-LD)
│   │   ├── text-page.njk     # תבנית עמוד פרק (parallel layout, version tabs)
│   │   ├── category-page.njk # תבנית מבוא חיבור/נוסח
│   │   ├── version-tabs.njk  # טאבי ניווט בין נוסחים
│   │   └── disqus.njk        # תגובות (lazy-loaded)
│   ├── _data/
│   │   ├── sources-catalog.json          # קטלוג 29 החיבורים
│   │   ├── apocalypse-abraham-alignment.json  # טבלת התאמה בין נוסחים
│   │   ├── apocalypse-abraham-spans.json # spans להדגשה מדויקת
│   │   ├── figures.json      # דמויות (אברהם, דניאל, חנוך, וכו')
│   │   ├── languages.json    # שפות מקור
│   │   └── site.json         # הגדרות אתר
│   ├── assets/
│   │   ├── style.css         # CSS יחיד (~66KB מיניפיי)
│   │   ├── js/site.js        # JS יחיד (~42KB מיניפיי)
│   │   └── fonts/            # רק woff2 (TTF נמחקו — 1.2MB חיסכון)
│   ├── texts/
│   │   ├── slavic/
│   │   │   └── apocalypse-abraham/
│   │   │       ├── index.md              # מבוא ראשי (3 כרטיסי נוסחים)
│   │   │       ├── a/                            # מבוא נוסח א' + page-1..17 + page-18 (נספח)
│   │   │       ├── b/                    # מבוא נוסח ב' + 17 פרקים + נספח
│   │   │       └── c/                    # מבוא נוסח ג' + 17 פרקים + נספח
│   │   ├── aramaic/          # חיבורים ארמיים/סוריים
│   │   ├── greek/            # חיבורים יווניים
│   │   ├── latin/            # חיבורים לטיניים
│   │   ├── arabic/           # חיבורים ערביים
│   │   ├── armenian/         # חיבורים ארמניים
│   │   ├── geez/             # חיבורים געזים
│   │   └── hebrew/           # חיבורים עבריים
│   ├── index.njk             # דף הבית
│   ├── about.njk             # אודות
│   ├── privacy.njk           # פרטיות (עותק נפרד של base.njk — דורש תחזוקה מקבילה!)
│   ├── contact.njk           # צור קשר
│   ├── license.njk           # רישיון
│   ├── search.njk            # חיפוש
│   ├── updates.njk           # עדכונים
│   └── updates-feed.njk      # RSS feed
├── scripts/                  # 16 סקריפטי CI verification
│   ├── ci-verify.mjs         # רץ את כל 16 הבדיקות
│   └── ...
└── docs/
    └── content-status-he.md  # דוח מצב תוכן
```

### 3.2. Frontmatter תקני

**עמוד פרק (page-N.md):**
```yaml
---
layout: text-page
title: "פרק א"
book: apocalypse-abraham
source: slavic
figure: abraham
pageNumber: 1
version: a
permalink: /texts/slavic/apocalypse-abraham/a/page-1/
tags:
  - texts
  - slavic
  - abraham
description: "פרק א מתוך חזון אברהם, נוסח א'."
---
```

**מבוא חיבור ראשי (index.md):**
```yaml
---
layout: base.njk
title: "חזון אברהם"
book: apocalypse-abraham
version: main
source: slavic
figure: abraham
pageNumber: 0
draft: false
comingSoon: false
templateEngineOverride: njk    # חשוב! מונע עטיפת <p> מיותרת
tags:
  - slavic
  - abraham
  - texts
permalink: /texts/slavic/apocalypse-abraham/
description: "תיאור נייטרלי, ללא שפה אקדמית"
---
```

### 3.3. פילטרים מותאמים ב-.eleventy.js

- `bookPages(items, currentUrl, book, includeIndex=true)` — מחזיר עמודי פרקים של חיבור+נוסח מסוים
- `bookCatalogEntry(bookId)` — מחזיר רשומת קטלוג
- `hasMultipleVersions(bookId)` — האם לחיבור יש מספר נוסחים
- `displayBookTitle(input)` — כותרת תצוגה של חיבור
- `usesHebrewChapterTitles(bookId)` — האם החיבור משתמש בכותרות "פרק X"
- `toHebrewNumeral(n)` — המרת מספר לספרות עבריות
- `chapterDisplayTitle(item, book)` — כותרת תצוגה של פרק
- `getGlobalData(key)` — קורא קובץ מ-_data לפי שם
- `dump(value)` — JSON.stringify
- `jsonify(value)` — JSON.stringify (לשימוש ב-JSON-LD — חייב להיות עם `| safe`!)
- `stripLeadingSlash(url)`
- `keys(obj)`, `length(val)`, `regexMatch(str, pattern, flags)`, `push(arr, value)`

### 3.4. JSON-LD — אזהרה חשובה

בכל תבנית שמכילה JSON-LD (`base.njk`, `privacy.njk`), כל פלט של `jsonify` חייב להיות עם `| safe`:
```njk
"headline": {{ title | jsonify | safe }},      ← לא jsonify לבד!
"description": {{ pageDescription | jsonify | safe }},
```

בלי `| safe`, Eleventy מבצע HTML-escape וה-JSON נשבר (`&quot;` במקום `"`).

**ערכים קשיחים ב-JSON-LD** שמכילים גרשיים (כמו `התנ"ך`) חייבים להשתמש בגרשיים עבריות (`התנ״ך` — U+05F4) במקום גרשיים רגילות (`"`), אחרת ה-JSON נשבר.

---

## 4. מערכת התצוגה המקבילית של נוסחים

### 4.1. רכיבים

1. **version-tabs.njk** — טאבי ניווט בראש כל עמוד פרק (מבוא כללי + נוסח א/ב/ג)
2. **version-parallel-controls** — בקרים: טוגל "תצוגה מקבילית" + בורר נוסח + טוגל "הדגש הבדלים"
3. **version-parallel-panel** — פאנל צדדי שטוען את הפרק המקביל מהנוסח שנבחר
4. **version-parallel-panel__footer** — סטטיסטיקה + הערת השוואה

### 4.2. טבלת התאמה (alignment)

קובץ: `src/_data/<book-id>-alignment.json`

מבנה:
```json
{
  "sections": {
    "section_key": {
      "title": "שם הקטע בעברית",
      "a": 2,           // מספר פרק בנוסח א', או null אם חסר
      "b": 2,           // מספר פרק בנוסח ב'
      "c": 1,           // מספר פרק בנוסח ג'
      "note": "הסבר קצר",
      "comparison_note": "הערת השוואה מפורטת (2-4 משפטים)"
    }
  }
}
```

כללים:
- כל קטע מקבל **שם תוכני** בעברית (לא "קטע 1")
- `null` = קטע חסר בנוסח זה
- `comparison_note` מסביר **הבדלים משמעותיים** — לא ספירת מילים

### 4.3. אלגוריתם ה-diff

ב-site.js:
1. `normalizeHebrew(text)` — מסיר ניקוד (U+0591–U+05BD, U+05BF, U+05C1–U+05C5, U+05C7) לפני השוואה
2. `diffWords(textA, textB)` — LCS מילולי, מחזיר מערך `{text, type}` כאשר type = `common` | `add` | `remove`
3. `renderDiff(container, textA, textB, side)` — מצייר: `diff-remove` (אדום+קו מחיקה), `diff-add` (ירוק+מודגש)

### 4.4. הצגת סטטיסטיקה

מתחת לפאנל המקבילי:
```
הבדלים בקטע זה: X מילים ייחודיות לנוסח א' · Y מילים ייחודיות לנוסח ב' · Z% שונים
```

### 4.5. הצגת הערת השוואה

בלוק מודגש עם פס צד בצבע accent:
```
הערת השוואה: [טקסט ההערה מתוך alignment.json]
```

---

## 5. CI Verification — 16 בדיקות

הרצה: `npm run ci:verify`

| # | סקריפט | מה בודק |
|---|---|---|
| 1 | verify-frontmatter.mjs | frontmatter תקין בכל קבצי md |
| 2 | verify-text-structure.mjs | מבנה טקסט תקין |
| 3 | verify-catalog-consistency.mjs | קטלוג תואם קבצים |
| 4 | verify-chapter-titles.mjs | כותרות פרקים אחידות ("פרק X") |
| 5 | verify-permalinks.mjs | permalinks תקינים |
| 6 | verify-placeholders.mjs | אין placeholders שלא מולאו |
| 7 | verify-intro-revisions.mjs | מבואות תקינים |
| 8 | verify-third-party-controls.mjs | שליטה על שירותי צד שלישי |
| 9 | report-content-status.mjs --check | דוח מצב תוכן מעודכן |
| 10 | eleventy --pathprefix=/Source/ | בנייה מצליחה |
| 11 | verify-display-book-titles.mjs | כותרות תצוגה תקינות |
| 12 | pagefind | אינדקס חיפוש נבנה |
| 13 | verify-release-content.mjs | תוכן פרסום תקין |
| 14 | verify-intro-navigation.mjs | ניווט מבואות תקין |
| 15 | verify-path-prefix.mjs | קידומת נתיב /Source/ תקינה |
| 16 | verify-built-links.mjs | אין קישורים שבורים |

כל 16 חייבות לעבור לפני push.

---

## 6. תהליך עבודה — Deploy לאתר החי

### 6.1. גישה ל-GitHub

הטוקן: קריאה מקובץ `~/.hermes/gh-token` במחשב המשתמש. אין להטמיעו בקוד או במסמכים.

### 6.2. סדרת פעולות ל-deploy

```bash
# 1. שיבוט רענן
export GH_TOKEN='<token>'
rm -rf /tmp/Source-clone
git clone --depth 1 "https://x-access-token:${GH_TOKEN}@github.com/logos-alex/Source.git" /tmp/Source-clone

# 2. העתקת קבצים שהשתנו מהעבודה המקומית
cp -r <local-source>/src/ /tmp/Source-clone/src/
# (או קבצים ספציפיים)

# 3. Commit + push
cd /tmp/Source-clone
git config user.email "logia-bot@users.noreply.github.com"
git config user.name "LOGIA Bot"
git add -A
git commit -m "תיאור השינוי"
git push "https://x-access-token:${GH_TOKEN}@github.com/logos-alex/Source.git" main

# 4. המתנה ל-GitHub Actions (60 שניות)
sleep 60
curl -sL "https://api.github.com/repos/logos-alex/Source/actions/runs?per_page=1" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['workflow_runs'][0]['status'], d['workflow_runs'][0]['conclusion'])"

# 5. ניקוי
unset GH_TOKEN
```

### 6.3. אימות אתר חי

```bash
curl -sL "https://logos-alex.github.io/Source/<path>?v=$(date +%s)" | grep -c "<pattern>"
```

---

## 7. היסטוריית החלטות מרכזיות

### 7.1. "דף חלק" (Clean Slate)

בשלב מסוים הוחלט למחוק את כל תוכן הפרקים ולהתחיל מחדש, כדי להבטיח אחידות. כל 661 קבצי הפרקים הישנים נמחקו, והמבנה (קטלוג, תבניות, סקריפטים) נשמר.

### 7.2. חזון אברהם — 3 נוסחים

החיבור הראשון שפורסם. שלושה נוסחים עבריים שונים של אותו חיבור, המבוססים על עדויות שונות של התרגום הסלאבי:
שלושת הנוסחים **מיושרים 1:1:1 ל־17 פרקים + נספח** (פרק N בכל שלושת הנוסחים = אותו קטע עלילה; טבלת ההתאמה בדף המבוא הראשי):
- **נוסח א'** — "נוסח היוחסין": משמר את רשימת היוחסין המלאה
- **נוסח ב'** — "הנוסח המפורש": עדים מילוליים; כולל את סיומו המפורש (עשר המכות + "דן אנכי")
- **נוסח ג'** — "נוסח הפתיחה": על פי כתב־היד הסולובצקי; כולל פתיחת החיבור, 'הצהרת־האל השנייה' והסיום

### 7.3. שינוי מיתוג (אוגוסט 2026)

הפרויקט נקרא בעבר "LOGIA — אוצר הכתבים הגנוזים". שונה ל"אפוקריפה — התנ״ך האפוקריפי". הלוגו היווני ΛΟΓIA נשמר כאלמנט ויזואלי.

### 7.4. תיקון JSON-LD (יולי־אוגוסט 2026)

התגלה שכל עמודי התוכן הכילו JSON-LD שבור בגלל HTML-escaping. תוקן על ידי הוספת `| safe` לכל `jsonify` ב-`base.njk` וב-`privacy.njk`. גם `articleSection` שונה להשתמש בכותרת עברית (דרך `bookCatalogEntry`) במקום ב-slug.

### 7.5. מחיקת פונטים TTF

7 קבצי TTF (1.2MB) נמחקו כי האתר טוען פונטים מ-Google Fonts. נשמרו רק woff2 למקרה של חזרה ל-self-hosted.

### 7.6. תיאורי קטלוג — ניקוי שפה אקדמית

18 ערכי קטלוג נוקו משפה אקדמית־ביקורתית והוחלפו בנוסחת התרגום האחידה.

---

## 8. דפוסי עבודה ו"gotchas"

### 8.1. YAML וגרשיים

תיאורים ב-frontmatter שמכילים `"` (כמו `קב"ה`) שוברים את ה-YAML. **תחליף:** השתמש בגרש בודד (`קב׳ה`) או ב-`&#34;`.

### 8.2. JSON-LD וגרשיים בעברית

ערכים קשיחים ב-JSON-LD שמכילים גרשיים (כמו `התנ"ך`) חייבים להשתמש בגרשיים עבריות (`התנ״ך` — U+05F4) במקום גרשיים רגילות (`"`), אחרת ה-JSON נשבר.

### 8.3. templateEngineOverride: njk

במבוא ראשי של חיבור עם כרטיסי נוסחים (כמו חזון אברהם), חובה להוסיף `templateEngineOverride: njk` ל-frontmatter. בלי זה, Eleventy מעבד Markdown ועוטף כל `<a>` בתג `<p>`, מה שיוצר "ריבועים ריקים" בגריד.

### 8.4. csso ו-[hidden]

מקמץ ה-CSS (csso) עלול להשחית בוררים כמו `[hidden]`. **פתרון:** השתמש במחלקה על אלמנט האב במקום `[hidden]` על האלמנט עצמו. למשל:
```css
.version-parallel-panel { display: none; }
.text-main--with-parallel > .version-parallel-panel { display: block; }
```

### 8.5. Nunjucks rejectattr באג

`rejectattr("data.pageNumber", "equalto", 0)` לא עובד ב-Nunjucks עם השוואת integer. **פתרון:** השתמש ב-`bookPages(..., false)` שכבר מסנן pageNumber:0.

### 8.6. ניקוד ו-regex

כשכותבים regex על טקסט עברי עם ניקוד, חובה לאפשר תווי ניקוד אופציונליים בין אותיות:
```python
N = "\u05B0-\u05C7"  # כל הדיאקריטיקה העברית
pattern = re.escape(char) + f"[{N}]*"  # לכל אות
```

### 8.7. pathPrefix

האתר מוגדר עם `pathprefix=/Source/`. כל הקישורים הפנימיים חייבים לכלול את הקידומת הזו. ב-Nunjucks השתמש ב-`{{ url | url }}` שמוסיף אוטומטית.

### 8.8. privacy.njk — עותק נפרד של base.njk

`privacy.njk` הוא עותק כמעט מלא של `base.njk` (לא משתמש ב-`{% extends "base.njk" %}`). כל שינוי ב-`base.njk` חייב להיעשות גם ב-`privacy.njk`. זו נקודת תחזוקה בעייתית — אם משהו משתנה ב-base, צריך לזכור לעדכן גם את privacy.

---

## 9. סגנון עיצוב (Design System)

### 9.1. משתני CSS עיקריים

```css
--c-bg, --c-surface, --c-text, --c-text-2, --c-text-muted
--c-accent, --c-accent-ink
--c-border, --c-border-soft
--r-sm, --r-md, --r-lg
--s-1 עד --s-7 (רווחים)
--fs-xs, --fs-sm, --fs-base, --fs-lg
--transition
--shadow-lg
```

### 9.2. תמיכה בערכת נושא כהה

`[data-theme="dark"]` על `<html>`. כל צבעי ה-diff צריכים גרסה כהה:
```css
[data-theme="dark"] .diff-remove { background: #4a2222; color: #ffcccc; }
[data-theme="dark"] .diff-add { background: #224a22; color: #ccffcc; }
```

### 9.3. RTL

האתר כולו RTL. השתמש ב-`margin-inline-start`, `padding-inline-start`, `border-inline-start` במקום `margin-left` וכו'.

---

## 10. חיבורים עתידיים — תכנון

### 10.1. סדר עדיפויות (לפי הערכת חשיבות)

1. **חזון דניאל (ארמי־סורי)** — apoc-daniel-syriac
2. **ספר זרובבל** — sefer-zerubbabel
3. **חזון עזרא (יווני)** — apokalypsis-esdras
4. **הומיליות הקלמנטינה** — clementine-homilies-greek
5. **ספר חנוך** — sefer-hanoch-a, enoch-qumran-aramaic

### 10.2. כשמפרסמים חיבור חדש

1. כתוב קבצי page-N.md עם תוכן נקי (ללא שפה אקדמית)
2. כתוב מבוא (index.md) עם נוסחת התרגום
3. אם יש מספר נוסחים — בנה קובץ alignment.json
4. עדכן `comingSoon: false` בקטלוג
5. הרץ `npm run ci:verify` — כל 16 חייבות לעבור
6. עדכן `docs/content-status-he.md` על ידי `npm run report:content`
7. Deploy ל-GitHub

---

## 11. הערות ל-AI הבא

1. **קרא את המסמך הזה במלואו** לפני כל עבודה.
2. **המשתמש רגיש מאוד לכיוון העריכה** — אל תסטה מהנוסחה המסורתית־כבודה. אם יש ספק, שאל.
3. **תמיד הרץ CI לפני push** — `npm run ci:verify`.
4. **תיעד כל שינוי משמעותי** ב-worklog או ב-commit message.
5. **המשתמש מעדיף תשובות כנות** — אם משהו לא אפשרי או לא מומלץ, תגיד. אל תבטיח ואז תיכשל.
6. **המשתמש מעריך הערכות ריאליות** של זמן ומורכבות לפני תחילת עבודה.
7. **כשעובדים על תוכן חדש**, קרא את המקור במלואו לפני שאתה כותב — אל תסתמך על הצצות.
8. **הערות השוואה** צריכות להסביר **משמעות** של הבדלים, לא רק לספור אותם.
9. **הטוקן של GitHub** — נשמר במחשב המשתמש בקובץ `~/.hermes/gh-token`; קרא אותו משם (`TOKEN=$(cat ~/.hermes/gh-token)`), אל תטמיע אותו בקוד או במסמכים, ואל תשלח את ערכו בצ'אט.
10. **אם משהו לא ברור**, שאל — אל תנחש. המשתמש מעדיף שאלות על פני טעויות.
11. **`privacy.njk` הוא עותק נפרד של `base.njk`** — כל שינוי ב-base חייב להיעשות גם ב-privacy.
12. **המונח "אפוקריפה"** משמש במובן הרחב ביותר ("ספרים חיצוניים"), לא בהבחנה האקדמית המודרנית.

---

## 12. קישורים חשובים

- **אתר חי:** https://logos-alex.github.io/Source/
- **מאגר GitHub:** https://github.com/logos-alex/Source
- **GitHub Actions:** https://github.com/logos-alex/Source/actions
- **הגדרות GitHub Pages:** https://github.com/logos-alex/Source/settings/pages
- **טוקנים:** https://github.com/settings/tokens

---

*מסמך זה עודכן: אוגוסט 2026 (30 חיבורים; מעשה יצחק מפורסם; יישור 17 פרקים; §2.6 — סגנון מבואות; מסמך זה נמצא בריפו: docs/PROJECT-MANIFEST.md). מצב נוכחי: חזון אברהם (3 נוסחים) מפורסם + תצוגה מקבילית + הדגשת הבדלים + 31 הערות השוואה + מיתוג חדש "אפוקריפה" + כל JSON-LD תקין (270/270) + CI 16/16 עובר.*
