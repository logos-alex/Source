---
title: "חזון דניאל הצעיר"
book: "דניאל הצעיר"
figure: "דניאל"
source: "ארמית"
layout: "book-index.njk"
permalink: "/texts/aramaic/young-daniel-syriac/"
---

# חזון דניאל הצעיר

טקסט אפוקליפטי המיוחס לדניאל, שמקורו בשפה הארמית (סורית). הטקסט מציג חזיונות על אחרית הימים, מלחמות ומלכויות, וגאולה עתידית.

דף זה כולל את המקור הארמי לצד תרגום עברי מודרני.

## פרקי הספר
<ul>
  {% for page in collections.all %}
    {% if page.data.book == "דניאל הצעיר" and page.data.pageNumber %}
      <li><a href="{{ page.url }}">פרק {{ page.data.pageNumber }}</a></li>
    {% endif %}
  {% endfor %}
</ul>
