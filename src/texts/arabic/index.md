---
layout: base.njk
title: "כתבים ממקור ערבי"
permalink: /texts/arabic/
---

<div class="text-main category-listing">
  <h1>כתבים ממקור ערבי</h1>
  <p>בקטגוריה זו ירוכזו חיבורים שהשתמרו בערבית יהודית וערבית נוצרית־מזרחית, כולל מסורות מתורגמות ומעובדות מן העולם הסורי־ארמי.</p>

  <div class="book-list">
    {% for item in collections.texts %}
      {% if item.data.source == "arabic" and item.data.draft != true %}
      {% if item.data.pageNumber == 0 or not item.data.pageNumber %}
      {% if "sub-intro" not in (item.data.tags or []) %}
        <div class="book-card">
          <h3><a class="book-card__primary-link" href="{{ item.url | url }}">{{ item | displayBookTitle }}</a></h3>
          <p style="margin-bottom: 15px;">{{ item.data.description }}</p>
          <p><small>ייחוס: <a class="book-card__meta-link" href="{{ ('/by-figure/' + item.data.figure + '/') | url }}">{{ figures[item.data.figure] or item.data.figure }}</a></small></p>
        </div>
      {% endif %}
      {% endif %}
      {% endif %}
    {% endfor %}
  </div>
</div>
