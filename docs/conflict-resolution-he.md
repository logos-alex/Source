# פתרון קונפליקטים כשכפתור "Resolve conflicts" אפור

כאשר GitHub מזהה קונפליקטים מורכבים (למשל `package.json`, Workflows, מחיקות/הוספות רבות והרבה קבצים יחד), הכפתור עלול להופיע אך לא להיות לחיץ.
במקרה כזה פותרים דרך טרמינל.

> חשוב: בדיקות ירוקות (CI) לא מבטלות קונפליקט מיזוג. אפשר להיות "Passing" ובכל זאת חסום למיזוג עד פתרון קונפליקטים בענף עצמו.

## תהליך מהיר

```bash
git checkout <your-branch>
git pull origin <your-branch>
npm run resolve:main-conflicts
```

> אפשר גם להריץ ידנית עם remote אחר:
>
> ```bash
> REMOTE_NAME=origin bash scripts/resolve-conflicts-main.sh main
> ```

הסקריפט ינסה:
1. למזג `main` לענף העבודה.
2. לפתור אוטומטית קבצים מוכרים מתוך rollout ה-CI/Disqus/updates.
3. להציג קבצים שנותרו לפתרון ידני (אם יש).
4. להריץ `npm run build` ו-`npm run ci:verify`.

## אם נשארו קונפליקטים ידניים

פתרון ידני ב-VS Code, ואז:

```bash
git add .
git commit -m "Resolve merge conflicts with main"
git push origin <your-branch>
```

## Auto-commit אופציונלי

```bash
AUTO_COMMIT=1 npm run resolve:main-conflicts
```

## פקודה אחת (Auto-commit + Auto-push)

```bash
npm run resolve:main-conflicts:push
```

אם נותרו קונפליקטים ידניים, הסקריפט יעצור ויציג בדיוק אילו קבצים לסגור ידנית לפני commit/push.
