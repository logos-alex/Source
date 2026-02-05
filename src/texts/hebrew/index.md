---
layout: base.njk
title: "כתבים ממקור עברי"
permalink: /texts/hebrew/
---

<div class="text-main category-listing">
  <h1>כתבים ממקור עברי</h1>
  <p>החיבורים שבקטגוריה זו עברו ונשתמרו בעברית, ומשקפים שכבות שונות של מסורת ופרשנות.</p>
  
  <div class="book-list">
    {% for item in collections.texts %}
      {% if item.data.source == "hebrew" and not item.data.draft and item.data.pageNumber == 0 and "sub-intro" not in item.data.tags %}
        <div class="book-card">
          <h3><a href="{{ item.url | prefixUrl }}">{{ item.data.title | replace: "הקדמה", "" }}</a></h3>
          <p style="margin-bottom: 15px;">{{ item.data.description }}</p>
          <p><small>יחוס: <a href="{{ '/by-figure/' | append: item.data.figure | append: '/' | prefixUrl }}">{{ figures[item.data.figure] or item.data.figure }}</a></small></p>
        </div>
      {% endif %}
    {% endfor %}
  </div>
</div>
