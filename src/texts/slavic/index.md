---
layout: base.njk
title: "כתבים ממקור סלאבי"
---

<div class="text-main category-listing">
  <h1>{{ title }}</h1>
  <div class="book-list">
    {# 
      הלולאה עוברת על כל הדפים שתויגו כת "texts".
      זה אוסף ש-Eleventy יוצר אוטומטית.
    #}
    {% for item in collections.texts %}
      {# 
        התנאי בודק שני דברים:
        1. האם המקור הוא "סלאבי"?
        2. האם זהו עמוד המבוא של ספר (pageNumber == 0 )?
      #}
      {% if item.data.source == 'slavic' and item.data.pageNumber == 0 %}
        <a href="{{ item.url | url }}" class="book-card">
          <h3>{{ item.data.title }}</h3>
          {% if item.data.description %}
            <p>{{ item.data.description }}</p>
          {% endif %}
        </a>
      {% endif %}
    {% endfor %}
  </div>
</div>
