---
permalink: /members/
title: "课题组成员"
layout: single
author_profile: false
---

{% include base_path %}


<style>
.people-card__img img { height: auto !important; object-fit: initial !important; }
.people-item__img img { width: 180px !important; height: 180px !important; }
</style>


{% assign phd_students = site.pages | where: "role", "phd" %}
{% assign master_students = site.pages | where: "role", "master" %}

<div class="people-section">
  <div class="people-section__header">
    <h2>导师</h2>
  </div>
  <div class="people-list">
    <div class="people-item">
      <div class="people-item__img">
        <img src="{{ site.author.avatar | prepend: '/images/' | prepend: base_path }}" alt="{{ site.author.name }}">
      </div>
      <div class="people-item__body">
        <h3 class="people-item__name">{{ site.author.name }}</h3>
        <p class="people-item__role">{{ site.author.bio }}</p>
        <p class="people-item__dept">{{ site.author.location }}</p>
        <div class="people-item__links">
          <a href="mailto:zjcai@berkeley.edu"><i class="fas fa-envelope"></i> 邮箱</a>
          <a href="https://scholar.google.com/citations?user=4OFp18YAAAAJ&hl=en&oi=ao" target="_blank" rel="noopener"><i class="ai ai-google-scholar"></i> Google Scholar</a>
          <a href="{{ site.baseurl }}/cv/"><i class="fas fa-file-alt"></i> CV</a>
        </div>
      </div>
    </div>
  </div>
</div>

{% if phd_students.size > 0 %}
<div class="people-section">
  <div class="people-section__header">
    <h2>博士研究生</h2>
  </div>
  <div class="people-grid">
    {% for student in phd_students %}
    <a href="{{ student.url | relative_url }}" class="people-card">
      <div class="people-card__img">
        {% assign slug = student.permalink | remove_first: "/" | remove: "/" %}
        <img src="{{ site.baseurl }}/assets/img/members/{{ slug }}.jpg" alt="{{ student.title }}">
      </div>
      <h3 class="people-card__name">{{ student.title }}</h3>
      <span class="people-card__year">{{ student.year }} 级</span>
      
    </a>
    {% endfor %}
  </div>
</div>
{% endif %}

{% if master_students.size > 0 %}
<div class="people-section">
  <div class="people-section__header">
    <h2>硕士研究生</h2>
  </div>
  <div class="people-grid">
    {% for student in master_students %}
    <a href="{{ student.url | relative_url }}" class="people-card">
      <div class="people-card__img">
        {% assign slug = student.permalink | remove_first: "/" | remove: "/" %}
        <img src="{{ site.baseurl }}/assets/img/members/{{ slug }}.jpg" alt="{{ student.title }}">
      </div>
      <h3 class="people-card__name">{{ student.title }}</h3>
      <span class="people-card__year">{{ student.year }} 级</span>
      
    </a>
    {% endfor %}
  </div>
</div>
{% endif %}