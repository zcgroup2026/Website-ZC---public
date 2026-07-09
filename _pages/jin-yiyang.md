---
title: "靳依扬"
permalink: /jin-yiyang/
layout: single
author_profile: false
sidebar: false
role: phd
year: 2026
education: "哈尔滨工业大学 学士 | 哈尔滨工业大学 硕士"
email: "yiyang.jin@outlook.com"
research: ""
---

<a href="{{ site.baseurl }}/members/" class="profile-back-link">&larr; 返回成员列表</a>

<div class="profile-layout">
  <div class="profile-sidebar">
    <div class="profile-photo-wrap">
      <img src="{{ site.baseurl }}/assets/img/members/jin-yiyang.jpg" alt="靳依扬">
    </div>
    <h2 class="profile-name">靳依扬</h2>
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