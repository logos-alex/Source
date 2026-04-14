---
layout: base.njk
title: "כתבים ממקור געז"
description: "חיבורים שהשתמרו במסורת האתיופית הקלאסית (געז), מסורת עשירה ששמרה טקסטים אפוקריפיים ייחודיים לאורך הדורות."
permalink: /texts/geez/
---

<div class="text-main category-listing">
  <h1>כתבים ממקור געז</h1>
  <p>כאן יוצגו חיבורים שהשתמרו במסורת האתיופית הקלאסית (געז), מסורת עשירה ששמרה טקסטים אפוקריפיים ייחודיים לאורך הדורות.</p>

  <div class="book-list">
    {% for item in collections.texts %}
      {% if item.data.source == "geez" and item.data.draft != true %}
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
</div>
