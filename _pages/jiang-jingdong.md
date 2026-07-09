---
title: "姜景栋"
permalink: /jiang-jingdong/
layout: single
author_profile: false
sidebar: false
role: phd
year: 2026
education: "山东科技大学 学士 | 中国科学院电工研究所 硕士"
email: "Jingdong_jiang@outlook.com"
research: ""
---

<a href="{{ site.baseurl }}/members/" class="profile-back-link">&larr; 返回成员列表</a>

<div class="profile-layout">
  <div class="profile-sidebar">
    <div class="profile-photo-wrap">
      <img src="{{ site.baseurl }}/assets/img/members/jiang-jingdong.jpg" alt="姜景栋">
    </div>
    <h2 class="profile-name">姜景栋</h2>
    <span class="profile-role role-phd">博士研究生</span>
    <span class="profile-year">2026 级</span>
  </div>
  <div class="profile-main">
    <div class="profile-info-card">
      <h3>基本信息</h3>
      <dl>
        <dt>身份</dt><dd>博士研究生</dd>
        <dt>入学年份</dt><dd>2026</dd>
        <dt>学习经历</dt><dd>{{ page.education }}</dd>
        <dt>邮箱</dt><dd><a href="mailto:{{ page.email }}">{{ page.email }}</a></dd>
        {% if page.research != "" %}
        <dt>研究方向</dt><dd>{{ page.research }}</dd>
        {% endif %}
      </dl>
    </div>
  </div>
</div>