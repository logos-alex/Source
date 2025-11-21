---
layout: base.njk
title: "כתבים ממקור עברי"
description: "כתבים אפוקליפטיים יהודיים בעברית - חזון אליהו וטקסטים נוספים מתקופת בית שני"
---

<div class="text-main category-listing">
  <h1>{{ title }}</h1>
  <div class="book-list">
    {% for item in collections.texts %}
      {% if item.data.source == 'hebrew' and item.data.pageNumber == 0 %}
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
