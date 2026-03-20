---
layout: base.njk
title: "כתבים ממקור ארמי"
permalink: /texts/aramaic/
---

<div class="text-main category-listing">
  <h1>כתבים ממקור ארמי</h1>
  <p>ארמית היא לשון המקור של חיבורים רבים מתקופת הבית השני והמרחב הסורי־ארמי. כאן מרוכזים הטקסטים שהשתמרו בה.</p>
  
  <div class="book-list">
    {% for item in collections.texts %}
      {% if item.data.source == "aramaic" and item.data.draft != true %}
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
