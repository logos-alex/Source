---
layout: base.njk
title: "כתבים ממקור לטיני"
description: "חיבורים שהשתמרו בתרגום לטיני, בהם גרסאות לטיניות של ספרות אפוקריפית יהודית ונוצרית קדומה."
permalink: /texts/latin/
---

<div class="text-main category-listing">
  <h1>כתבים ממקור לטיני</h1>
  <p>במסורת הלטינית השתמרו תרגומים ועיבודים של חיבורים אפוקריפיים, בעיקר מן העולם הנוצרי־מערבי. כאן ייאספו הטקסטים הלטיניים ככל שיתווספו.</p>

  <div class="book-list">
    {% for item in collections.texts %}
      {% if item.data.source == "latin" and item.data.draft != true %}
      {% if item.data.pageNumber == 0 or not item.data.pageNumber %}
      {% if "sub-intro" not in (item.data.tags or []) %}
        <div class="book-card">
          <h3><a class="book-card__primary-link" href="{{ item.url | url }}">{{ item | displayBookTitle }}</a></h3>
          <p class="book-card__description">{{ item.data.description }}</p>
          <p><small>ייחוס: <a class="book-card__meta-link" href="{{ ('/by-figure/' + item.data.figure + '/') | url }}">{{ figures[item.data.figure] or item.data.figure }}</a></small></p>
        </div>
      {% endif %}
      {% endif %}
      {% endif %}
    {% endfor %}
  </div>

  <p class="c-muted--italic">טקסטים לטיניים יתווספו בהמשך. בינתיים, חזרו ל<a href="{{ '/' | url }}">דף הבית</a> כדי לצפות בכתבים הזמינים, או עיינו ב<a href="{{ '/texts/' | url }}">כל המקורות</a>.</p>
</div>
