---
title: "分析测试仪器"
excerpt: "课题组分析测试仪器概览"
collection: portfolio
author_profile: false
---

<style>
.instrument-intro {
  max-width: 800px;
  margin: 0 auto 2.5em auto;
  text-align: center;
  color: var(--global-text-color-light);
  font-size: 1.05em;
  line-height: 1.7;
}
.instrument-category {
  font-size: 1.4em;
  font-weight: 700;
  margin: 2em 0 1em 0;
  padding-bottom: 0.4em;
  border-bottom: 2px solid var(--global-base-color);
}
.instrument-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2em;
  margin-bottom: 1.5em;
}
@media (max-width: 1200px) {
  .instrument-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 900px) {
  .instrument-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 500px) {
  .instrument-grid { grid-template-columns: 1fr; }
}
.instrument-card {
  background: var(--global-bg-color);
  border: 1px solid var(--global-border-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}
.instrument-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.instrument-card-img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  cursor: pointer;
  background: #f5f5f5;
}
.instrument-card-body {
  padding: 0.9em 1em 1em 1em;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.instrument-card-name {
  font-size: 0.95em;
  font-weight: 700;
  margin: 0 0 0.2em 0;
  line-height: 1.3;
  color: var(--global-text-color);
}
.instrument-card-abbr {
  display: inline-block;
  font-size: 0.8em;
  font-weight: 600;
  color: #006699;
  background: rgba(0,102,153,0.08);
  padding: 0.15em 0.5em;
  border-radius: 4px;
  margin-bottom: 0.5em;
  align-self: flex-start;
}
.instrument-card-desc {
  font-size: 0.82em;
  color: var(--global-text-color-light);
  line-height: 1.5;
  margin: 0;
}

.lightbox-overlay {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.85);
  z-index: 9999;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.lightbox-overlay.active {
  display: flex;
}
.lightbox-overlay img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
}
.lightbox-close {
  position: absolute;
  top: 20px;
  right: 30px;
  color: #fff;
  font-size: 2em;
  font-weight: 300;
  cursor: pointer;
  line-height: 1;
}
</style>

<div class="instrument-intro">
  课题组具备较完善的材料结构表征、光谱分析、显微成像、热分析、色谱质谱及电化学测试条件，可为材料制备、结构分析和性能研究提供实验支撑。
</div>

<div id="lightbox" class="lightbox-overlay" onclick="this.classList.remove('active')">
  <span class="lightbox-close">&times;</span>
  <img id="lightbox-img" src="" alt="">
</div>

{% for group in site.data.instruments %}
<h2 class="instrument-category" id="cat-{{ forloop.index }}">{{ group.category }}</h2>
<div class="instrument-grid">
  {% for inst in group.instruments %}
  <div class="instrument-card">
    <img 
      src="{{ site.baseurl }}/assets/images/instruments/{{ inst.image }}"
      alt="{{ inst.name }}{% if inst.abbr != '' %} ({{ inst.abbr }}){% endif %}"
      class="instrument-card-img"
      loading="lazy"
      onclick="document.getElementById('lightbox-img').src=this.src;document.getElementById('lightbox').classList.add('active')"
    >
    <div class="instrument-card-body">
      <div class="instrument-card-name">{{ inst.name }}</div>
      {% if inst.abbr != "" %}
      <span class="instrument-card-abbr">{{ inst.abbr }}</span>
      {% endif %}
      <p class="instrument-card-desc">{{ inst.desc }}</p>
    </div>
  </div>
  {% endfor %}
</div>
{% endfor %}
