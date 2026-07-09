---
permalink: /members/
title: "课题组成员"
layout: single
author_profile: false
---

{% include base_path %}

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

<div class="people-section">
  <div class="people-section__header">
    <h2>博士研究生</h2>
  </div>
  <div class="people-grid">
    <a href="{{ site.baseurl }}/jiang-jingdong/" class="people-card">
      <div class="people-card__img">
        <img src="{{ site.baseurl }}/assets/img/members/jiang-jingdong.jpg" alt="姜景栋">
      </div>
      <h3 class="people-card__name">姜景栋</h3>
      <span class="people-card__year">2026 级</span>
      <p class="people-card__brief">山东科技大学 学士 · 中国科学院电工研究所 硕士</p>
    </a>
    <a href="{{ site.baseurl }}/jin-yiyang/" class="people-card">
      <div class="people-card__img">
        <img src="{{ site.baseurl }}/assets/img/members/jin-yiyang.jpg" alt="靳依扬">
      </div>
      <h3 class="people-card__name">靳依扬</h3>
      <span class="people-card__year">2026 级</span>
      <p class="people-card__brief">哈尔滨工业大学 学士 · 哈尔滨工业大学 硕士</p>
    </a>
  </div>
</div>

<div class="people-section">
  <div class="people-section__header">
    <h2>硕士研究生</h2>
  </div>
  <div class="people-grid">
    <a href="{{ site.baseurl }}/cui-haiyang/" class="people-card">
      <div class="people-card__img">
        <img src="{{ site.baseurl }}/assets/img/members/cui-haiyang.jpg" alt="崔海阳">
      </div>
      <h3 class="people-card__name">崔海阳</h3>
      <span class="people-card__year">2026 级</span>
      <p class="people-card__brief">海南大学 学士</p>
    </a>
    <a href="{{ site.baseurl }}/dong-li/" class="people-card">
      <div class="people-card__img">
        <img src="{{ site.baseurl }}/assets/img/members/dong-li.jpg" alt="董力">
      </div>
      <h3 class="people-card__name">董力</h3>
      <span class="people-card__year">2026 级</span>
      <p class="people-card__brief">海南大学 学士</p>
    </a>
  </div>
</div>