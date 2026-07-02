---
layout: archive
title: "课题组动态"
permalink: /news/
author_profile: false
---

{% include base_path %}

{% for post in site.posts %}
  <div style="margin-bottom: 2em; padding-bottom: 1.5em; border-bottom: 1px solid var(--global-border-color);">
    <h2 style="margin: 0 0 0.3em 0; font-size: 1.2em;">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h2>
    <p style="font-size: 0.85em; color: var(--global-text-color-light); margin: 0 0 0.8em 0;">
      <i class="fa fa-calendar" aria-hidden="true"></i> {{ post.date | date: "%Y-%m-%d" }}
    </p>
    <div>{{ post.excerpt | markdownify }}</div>
  </div>
{% endfor %}
