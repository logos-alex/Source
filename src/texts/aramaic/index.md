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
      {% if item.data.source == "aramaic" and not item.data.draft and item.data.pageNumber == 0 and "sub-intro" not in item.data.tags %}
        <div class="book-card">
          <h3><a href="{{ item.url }}">{{ item.data.title | replace: "חזון דניאל הסורי-ארמי: הקדמה", "חזון דניאל (הארמי-סורי)" | replace: "דניאל הקטן (ארמית-סורית): הקדמה", "דניאל הקטן" | replace: "הקדמה", "" }}</a></h3>
          <p style="margin-bottom: 15px;">{{ item.data.description }}</p>
          <p><small>יחוס: <a href="{{ '/by-figure/' | append: item.data.figure | append: '/' | url }}">{{ figures[item.data.figure] }}</a></small></p>
        </div>
      {% endif %}
    {% endfor %}
  </div>
</div>
