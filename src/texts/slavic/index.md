---
layout: base.njk
title: "כתבים ממקור סלאבי"
permalink: /texts/slavic/
---

<div class="text-main category-listing">
  <h1>כתבים ממקור סלאבי</h1>
  <p>בכתבי היד הסלאביים השתמרו גרסאות ייחודיות לחיבורים אפוקריפיים. כאן תמצאו את התרגומים והביאורים הזמינים.</p>
  
  <div class="book-list">
    {% for item in collections.texts %}
      {% if item.data.source == "slavic" and item.data.draft != true %}
      {% if item.data.pageNumber == 0 or item.data.pageNumber == blank %}
      {% unless item.data.tags contains "sub-intro" %}
        <div class="book-card">
          <h3><a href="{{ item.url | url }}">{{ item.data.title }}</a></h3>
          <p style="margin-bottom: 15px;">{{ item.data.description }}</p>
          <p><small>ייחוס: <a href="{{ '/by-figure/' | append: item.data.figure | append: '/' | url }}">{{ figures[item.data.figure] }}</a></small></p>
        </div>
      {% endunless %}
      {% endif %}
      {% endif %}
    {% endfor %}
  </div>
</div>
