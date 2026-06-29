---
layout: single
permalink: /
title: "Welcome To Cai Group"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<div class="home-section">

## 个人简介

蔡子健博士现任中国科学院大学化学科学学院副教授。  
本科毕业于中国科学技术大学化学与材料科学学院，博士毕业于加州大学伯克利分校材料科学与工程系，师从 Gerbrand Ceder 教授，开展关于无序岩盐型正极材料的研究。博士毕业后，继续在伯克利担任博士后研究员。

在加入国科大之前，曾在三星半导体先进材料研究院担任高级工程师，负责管理电池正极和固态电解质材料研发项目，并开发了用于筛选富锂正极材料和卤化物固态电解质的自动化实验室合成平台。

</div>

<div class="home-section">

## 课题组介绍

课题组将致力于利用"AI for Science"范式进行电池材料的设计与合成。课题组通过建设人工智能自动化实验室，并与理论模拟和先进原位表征手段相结合，旨在快速高效开发新型储能材料。

</div>

<div class="home-section">

## 最新动态

{% for post in site.posts limit: 3 %}
  <div style="margin-bottom: 1.5em;">
    <strong>{{ post.date | date: "%Y-%m-%d" }}</strong> 
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
  </div>
{% endfor %}

</div>
