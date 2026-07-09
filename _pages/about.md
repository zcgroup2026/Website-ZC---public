---
layout: single
permalink: /
title: "Welcome To Cai Group"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<!-- ====== 滚动轮播 ====== -->
<div class="hero-carousel" id="heroCarousel">
  <div class="hero-slide active" style="background-image: url('{{ site.baseurl }}/images/talk1.png');">
    <div class="hero-slide__overlay">
      <h2 class="hero-slide__title">人工智能自动化实验室</h2>
      <p class="hero-slide__desc">面向高通量新材料发现，构建"自驱动"的机器人合成与表征平台</p>
    </div>
  </div>
  <div class="hero-slide" style="background-image: url('{{ site.baseurl }}/images/talk2.png');">
    <div class="hero-slide__overlay">
      <h2 class="hero-slide__title">先进锂离子电池材料</h2>
      <p class="hero-slide__desc">结合先进表征与理论预测，开发高性能正极材料与固态电解质</p>
    </div>
  </div>
  <div class="hero-slide" style="background-image: url('{{ site.baseurl }}/images/yq1.png');">
    <div class="hero-slide__overlay">
      <h2 class="hero-slide__title">课题组实验室设备</h2>
      <p class="hero-slide__desc">完善的合成、表征与电化学测试平台，支撑前沿材料研究</p>
    </div>
  </div>

  <button class="hero-arrow hero-arrow--left" id="heroPrev" aria-label="上一张">&#10094;</button>
  <button class="hero-arrow hero-arrow--right" id="heroNext" aria-label="下一张">&#10095;</button>

  <div class="hero-dots" id="heroDots">
    <span class="hero-dot active" data-index="0"></span>
    <span class="hero-dot" data-index="1"></span>
    <span class="hero-dot" data-index="2"></span>
  </div>
</div>

<!-- ====== 研究领域卡片 ====== -->
<div class="home-section" markdown="1">

## 研究方向

</div>

<div class="research-grid" style="margin-top: 0; margin-bottom: 2em;">
{% for post in site.research %}
  {% include research-card.html %}
{% endfor %}
</div>

<div class="home-section" markdown="1">

## 个人简介

蔡子健博士现任中国科学院大学化学科学学院副教授。  
本科毕业于中国科学技术大学化学与材料科学学院，博士毕业于加州大学伯克利分校材料科学与工程系，师从 Gerbrand Ceder 教授，开展关于无序岩盐型正极材料的研究。博士毕业后，继续在伯克利担任博士后研究员。

在加入国科大之前，曾在三星半导体先进材料研究院担任高级工程师，负责管理电池正极和固态电解质材料研发项目，并开发了用于筛选富锂正极材料和卤化物固态电解质的自动化实验室合成平台。

</div>

<div class="home-section" markdown="1">

## 课题组介绍

课题组将致力于利用"AI for Science"范式进行电池材料的设计与合成。课题组通过建设人工智能自动化实验室，并与理论模拟和先进原位表征手段相结合，旨在快速高效开发新型储能材料。

</div>

<div class="home-section" markdown="1">

## 最新动态

</div>

<div class="home-news-list">
{% for post in site.posts limit: 3 %}
  <a href="{{ post.url | relative_url }}" class="home-news-item">
    <span class="home-news-item__date">{{ post.date | date: "%Y-%m-%d" }}</span>
    <span class="home-news-item__title">{{ post.title }}</span>
    <span class="home-news-item__arrow">&rarr;</span>
  </a>
{% endfor %}
</div>

<div style="text-align: right; margin-top: 0.8em;">
  <a href="{{ site.baseurl }}/news/" class="home-view-all">查看全部动态 &rarr;</a>
</div>

<script src="{{ site.baseurl }}/assets/js/carousel.js"></script>