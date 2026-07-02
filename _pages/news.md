---
layout: archive
title: "课题组动态"
permalink: /news/
author_profile: false
---

{% include base_path %}

<div class="news-grid">
{% for post in site.posts %}
  <article class="news-card">
    <div class="news-card__meta">
      <span class="news-card__date">
        <i class="fas fa-calendar-alt" aria-hidden="true"></i>
        {{ post.date | date: "%Y年%m月%d日" }}
      </span>
    </div>
    <h2 class="news-card__title">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h2>
    <div class="news-card__excerpt">
      {{ post.excerpt | strip_html | truncate: 120 }}
    </div>
    <a href="{{ post.url | relative_url }}" class="news-card__readmore">
      阅读全文 <i class="fas fa-arrow-right" aria-hidden="true"></i>
    </a>
  </article>
{% endfor %}
</div>

{% if site.posts.size == 0 %}
  <p style="text-align: center; color: var(--global-text-color-light); padding: 3em 0;">
    暂无新闻动态，敬请期待。
  </p>
{% endif %}
