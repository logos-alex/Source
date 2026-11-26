---
layout: base.njk
title: 'כתבים לפי ייחוס'
description: 'ספריית אפוקריפה: כתבים חיצוניים לתורה, לנביאים ולכתובים, וכתבי תלמידי ישוע, לפי ייחוסם לדמויות המקרא.'
draft: false
bodyClass: figure-index-page
permalink: /by-figure/
---

<div class="text-main category-listing">
  <header class="text-header">
    <p class="text-header__eyebrow">מפתח הדמויות</p>
    <h1>כתבים לפי ייחוס</h1>
    <p>החיבורים מקובצים כאן לפי הדמויות והמסורות שאליהן יוחסו. בכל מדף תמצאו את הכתבים שנשתמרו — ולצדם חיבורים המצויים עדיין בהכנה.</p>
  </header>

  <div class="figure-index-sections">
    {% for sectionKey in bibleSectionOrder %}
      {% set section = bibleSections.sections[sectionKey] %}
      <section class="figure-index-shelf" data-figure-section="{{ sectionKey }}">
        <h2>{{ section.title }}</h2>
        <p>{{ section.subtitle }}</p>
        <div class="figure-index-grid">
          {% for figureKey in section.figures %}
            {% set figureStatus = libraryStats.figureStatus[figureKey] %}
            <a class="figure-index-person" data-figure-key="{{ figureKey }}" href="{{ ('/by-figure/' + figureKey + '/') | url }}">
              <strong>{{ figures[figureKey] or figureKey }}</strong>
              <small>{% if figureStatus and figureStatus.published > 0 %}לעיון{% elif figureStatus and figureStatus.inPrep > 0 %}בהכנה{% else %}למפתח{% endif %} ←</small>
            </a>
          {% endfor %}
        </div>
      </section>
    {% endfor %}
  </div>
</div>
