---
layout: text-page.njk
title: "דניאל הקטן (ארמית-סורית) - הקדמה"
book: young-daniel-syriac
source: aramaic
figure: daniel
pageNumber: 0
draft: false
tags: ["texts", "aramaic", "daniel"]
permalink: /texts/aramaic/young-daniel-syriac/
description: "תרגום עברי וביאור לדניאל הקטן, חיבור ארמי-סורי קצר המכיל נבואות על מלכים ומלחמות באחרית הימים."
---

# חזון דניאל הצעיר

טקסט אפוקליפטי המיוחס לדניאל, שמקורו בשפה הארמית (סורית). הטקסט מציג חזיונות על אחרית הימים, מלחמות ומלכויות, וגאולה עתידית.

דף זה כולל את המקור הארמי לצד תרגום עברי מודרני.

## פרקי הספר
<details>
  <summary>תוכן העניינים</summary>
  <ul>
    {% for page in collections.all %}
      {% if page.data.book == "young-daniel-syriac" and page.data.pageNumber and page.data.pageNumber > 0 %}
        <li><a href="{{ page.url | url }}">פרק {{ page.data.pageNumber }}</a></li>
      {% endif %}
    {% endfor %}
  </ul>
</details>
