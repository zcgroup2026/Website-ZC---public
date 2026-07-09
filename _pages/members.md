---
permalink: /members/
title: "课题组成员"
layout: single
author_profile: false
---

{% include base_path %}

<!-- PI Card -->
<div class="pi-card">
  <div class="pi-card__img-wrap">
    <img class="pi-card__avatar" src="{{ site.author.avatar | prepend: '/images/' | prepend: base_path }}" alt="{{ site.author.name }}">
  </div>
  <div class="pi-card__info">
    <h2 class="pi-card__name">{{ site.author.name }}</h2>
    <p class="pi-card__title">{{ site.author.bio }}</p>
    <p class="pi-card__dept">{{ site.author.location }}</p>
    <div class="pi-card__links">
      <a href="mailto:zjcai@berkeley.edu" class="pi-card__link-item"><i class="fas fa-envelope"></i> 邮箱</a>
      <a href="https://scholar.google.com/citations?user=4OFp18YAAAAJ&hl=en&oi=ao" target="_blank" rel="noopener" class="pi-card__link-item"><i class="ai ai-google-scholar"></i> Google Scholar</a>
      <a href="{{ site.baseurl }}/cv/" class="pi-card__link-item"><i class="fas fa-file-alt"></i> CV</a>
    </div>
  </div>
</div>

<div class="member-section-header">
  <h2 class="member-section-title">在读学生</h2>
  <span class="member-section-count">4 人</span>
</div>

<div class="member-grid">
  <a href="{{ site.baseurl }}/cui-haiyang/" class="member-card">
    <div class="member-card__img-wrap">
      <img class="member-card__avatar" src="{{ site.baseurl }}/assets/img/members/cui-haiyang.jpg" alt="崔海阳">
    </div>
    <h3 class="member-card__name">崔海阳</h3>
    <span class="member-card__role role-master">硕士研究生</span>
    <span class="member-card__dept">2026 级</span>
  </a>
  <a href="{{ site.baseurl }}/dong-li/" class="member-card">
    <div class="member-card__img-wrap">
      <img class="member-card__avatar" src="{{ site.baseurl }}/assets/img/members/dong-li.jpg" alt="董力">
    </div>
    <h3 class="member-card__name">董力</h3>
    <span class="member-card__role role-master">硕士研究生</span>
    <span class="member-card__dept">2026 级</span>
  </a>
  <a href="{{ site.baseurl }}/jiang-jingdong/" class="member-card">
    <div class="member-card__img-wrap">
      <img class="member-card__avatar" src="{{ site.baseurl }}/assets/img/members/jiang-jingdong.jpg" alt="姜景栋">
    </div>
    <h3 class="member-card__name">姜景栋</h3>
    <span class="member-card__role role-phd">博士研究生</span>
    <span class="member-card__dept">2026 级</span>
  </a>
  <a href="{{ site.baseurl }}/jin-yiyang/" class="member-card">
    <div class="member-card__img-wrap">
      <img class="member-card__avatar" src="{{ site.baseurl }}/assets/img/members/jin-yiyang.jpg" alt="靳依扬">
    </div>
    <h3 class="member-card__name">靳依扬</h3>
    <span class="member-card__role role-phd">博士研究生</span>
    <span class="member-card__dept">2026 级</span>
  </a>
</div>