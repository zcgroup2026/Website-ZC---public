---
title: "崔海阳"
permalink: /cui-haiyang/
layout: single
author_profile: false
sidebar: false
role: master
year: 2026
education: "海南大学 学士"
email: "1665540605@qq.com"
research: ""
---

<a href="{{ site.baseurl }}/members/" class="profile-back-link">&larr; 返回成员列表</a>

<div class="profile-layout">
  <div class="profile-sidebar">
    <div class="profile-photo-wrap">
      <img src="{{ site.baseurl }}/assets/img/members/cui-haiyang.jpg" alt="崔海阳">
    </div>
    <h2 class="profile-name">崔海阳</h2>
    <span class="profile-role role-master">硕士研究生</span>
    <span class="profile-year">2026 级</span>
  </div>
  <div class="profile-main">
    <div class="profile-info-card">
      <h3>基本信息</h3>
      <dl>
        <dt>身份</dt><dd>硕士研究生</dd>
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