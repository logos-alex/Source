---
layout: base.njk
title: ברוכים הבאים
bodyClass: home-page
permalink: /
---
<div class="text-main">
    <div class="beta-notice">
      <strong>⚠️ אתר בהתהוות:</strong> המאגר בתהליך בנייה מתמשך. נוסחים, ביאורים ותיקונים מתווספים לאורך הזמן.
    </div>

    <h2>ברוכים הבאים לאוצר הכתבים הגנוזים</h2>
    <p>מה קורה כאשר כתבי קודש נדחקים לשוליים, נעלמים מן העין ומן הלב? מה מסתתר בחיבורים שלא מצאו את דרכם אל הקאנון המקובל?</p>
    <p>כאן נאספים כתבים שנדחקו לשוליים של המסורת: חיבורים אפוקריפיים ופסאודו־אפיגרפיים שלא נכנסו לקאנון אך השפיעו על הדמיון הדתי והתרבותי של תקופת הבית השני ולאחריה. מטרתנו היא לאסוף, לתרגם ולבאר כתבים אלו בדגש על חיבורים שטרם ראו אור בעברית, תוך הצגת שפת המקור לצד תרגום עברי חדש וביאור קצר.</p>

    <hr style="border-color: var(--border-color); margin: 40px auto; width: 50%;">

    <h3>מה תמצאו כאן?</h3>
    <ul>
      <li>טקסטים אפוקריפיים ופסאודו־אפיגרפיים בעברית, בארמית ובסלאבית.</li>
      <li>תרגומים חדשים לצד שפת המקור להשוואה נוחה.</li>
      <li>הקדמות, הערות שוליים וביאורים קצרים להקשר ולרקע.</li>
    </ul>

    <hr style="border-color: var(--border-color); margin: 40px auto; width: 50%;">

    <h3>קפיצה מהירה לכתבים:</h3>
    <ul class="quick-links-list">{% for item in collections.texts %}{% if item.data.isIntro %}<li><strong><a href="{{ item.url }}">{{ item.data.title | replace: ": הקדמה", "" | replace: " – הקדמה", "" }}</a></strong>{% if item.data.source %} <small>({{ item.data.source | replace: "hebrew", "עברית" | replace: "aramaic", "ארמית" | replace: "slavic", "סלאבית" }})</small>{% endif %}</li>{% endif %}{% endfor %}</ul>

    <div class="quick-actions" aria-label="ניווט מהיר">
      <a href="/search/">🔍 חיפוש במאגר</a>
      <a href="/texts/">📜 לפי מקור</a>
      <a href="/by-figure/">👤 לפי יחוס</a>
    </div>

    <hr style="border-color: var(--border-color); margin: 40px auto; width: 50%;">

    <h3>בקרוב במאגר:</h3>
    <p>אנו עמלים על הוספת הכתבים הבאים, ועוד רבים אחרים:</p>
    <ul style="list-style-type: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
      <li>✨ חזון עזרא (לטיני)</li>
      <li>✨ חזון עזרא (ארמי)</li>
      <li>✨ סולם יעקב (סלאבי)</li>
      <li>✨ עליית ישעיהו (סלאבי)</li>
      <li>✨ ספר אליהו (עברי)</li>
      <li>✨ חזון דניאל (עברי)</li>
    </ul>
</div>
