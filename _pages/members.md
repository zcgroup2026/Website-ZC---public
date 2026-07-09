---
permalink: /members/
title: "课题组成员"
layout: single
author_profile: false
---

{% include base_path %}

<!-- PI Card -->
<div class="pi-card">
  <img class="pi-card__avatar" src="{{ site.author.avatar | prepend: '/images/' | prepend: base_path }}" alt="{{ site.author.name }}">
  <div class="pi-card__info">
    <h2 class="pi-card__name">{{ site.author.name }}</h2>
    <p class="pi-card__title">{{ site.author.bio }}</p>
    <p class="pi-card__dept">{{ site.author.location }}</p>
  </div>
</div>

### 在读学生

<div class="member-grid">
  <a href="{{ site.baseurl }}/cui-haiyang/" class="member-card">
    <img class="member-card__avatar" src="{{ site.baseurl }}/assets/img/members/cui-haiyang.jpg" alt="崔海阳">
    <h3 class="member-card__name">崔海阳</h3>
    <span class="member-card__role role-master">硕士研究生</span>
  </a>
  <a href="{{ site.baseurl }}/dong-li/" class="member-card">
    <img class="member-card__avatar" src="{{ site.baseurl }}/assets/img/members/dong-li.jpg" alt="董力">
    <h3 class="member-card__name">董力</h3>
    <span class="member-card__role role-master">硕士研究生</span>
  </a>
  <a href="{{ site.baseurl }}/jiang-jingdong/" class="member-card">
    <img class="member-card__avatar" src="{{ site.baseurl }}/assets/img/members/jiang-jingdong.jpg" alt="姜景栋">
    <h3 class="member-card__name">姜景栋</h3>
    <span class="member-card__role role-phd">博士研究生</span>
  </a>
  <a href="{{ site.baseurl }}/jin-yiyang/" class="member-card">
    <img class="member-card__avatar" src="{{ site.baseurl }}/assets/img/members/jin-yiyang.jpg" alt="靳依扬">
    <h3 class="member-card__name">靳依扬</h3>
    <span class="member-card__role role-phd">博士研究生</span>
  </a>
</div>
