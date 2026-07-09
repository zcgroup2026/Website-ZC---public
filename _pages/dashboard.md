---
layout: single
title: "管理后台"
permalink: /dashboard/
author_profile: false
---

<style>
  .dash-wrap { max-width: 900px; margin: 1em auto; }
  .dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2em; }
  .dash-header h1 { font-size: 1.4em; margin: 0; }
  .dash-logout { font-size: 0.85em; color: var(--global-link-color); cursor: pointer; text-decoration: underline; }
  .dash-tabs { display: flex; gap: 0; border-bottom: 2px solid var(--global-border-color); margin-bottom: 2em; }
  .dash-tab {
    display: block; padding: 0.7em 1.5em; font-size: 0.9em; font-weight: 600;
    text-decoration: none; color: var(--global-text-color-light);
    border-bottom: 2px solid transparent; margin-bottom: -2px;
  }
  .dash-tab:hover { color: var(--global-text-color); }
  .dash-tab.active { color: var(--global-masthead-bg-color); border-bottom-color: var(--global-masthead-bg-color); }
  .dash-panel { display: none; }
  .dash-panel.active { display: block; }
  .token-banner { padding: 1em 1.2em; margin-bottom: 1.5em; background: #fffbeb; border: 1px solid #fbbf24; font-size: 0.85em; }
  .token-banner code { background: #fef3c7; padding: 0.15em 0.4em; }
  .token-banner a { font-weight: 600; }

  /* Forms */
  .dash-form { padding: 1.5em; border: 1px solid var(--global-border-color); margin-bottom: 2em; background: var(--global-bg-color); }
  .dash-form h2 { font-size: 1.15em; margin: 0 0 1.2em 0; padding: 0; border: none; }
  .form-row { margin-bottom: 1em; }
  .form-row label { display: block; font-size: 0.85em; font-weight: 600; margin-bottom: 0.35em; color: var(--global-text-color-light); }
  .form-row input, .form-row textarea, .form-row select {
    width: 100%; padding: 0.6em 0.7em; font-size: 0.95em;
    border: 1px solid var(--global-border-color); background: var(--global-bg-color);
    color: var(--global-text-color); box-sizing: border-box; font-family: inherit;
  }
  .form-row textarea { min-height: 100px; resize: vertical; }
  .form-row input:focus, .form-row textarea:focus, .form-row select:focus { outline: none; border-color: var(--global-masthead-bg-color); }
  .form-row-half { display: flex; gap: 1em; }
  .form-row-half > * { flex: 1; }
  .btn-primary {
    padding: 0.65em 1.8em; font-size: 0.9em; font-weight: 600;
    border: none; cursor: pointer; background: var(--global-masthead-bg-color); color: #fff;
  }
  .btn-primary:hover { opacity: 0.9; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-danger { padding: 0.65em 1.8em; font-size: 0.9em; font-weight: 600; border: none; cursor: pointer; background: #e53e3e; color: #fff; }

  .msg { padding: 0.7em 1em; margin: 1em 0; font-size: 0.85em; display: none; }
  .msg-success { background: #f0fff4; border: 1px solid #48bb78; color: #276749; }
  .msg-error { background: #fff5f5; border: 1px solid #fc8181; color: #9b2c2c; }
  .msg-info { background: #ebf8ff; border: 1px solid #63b3ed; color: #2a4365; }

  /* File list */
  .file-list { margin-bottom: 1.5em; }
  .file-item { display: flex; justify-content: space-between; align-items: center; padding: 0.7em 1em; border: 1px solid var(--global-border-color); margin-bottom: 0.5em; }
  .file-item-info { font-size: 0.9em; }
  .file-item-name { font-weight: 600; }
  .file-item-date { font-size: 0.8em; color: var(--global-text-color-light); margin-left: 0.5em; }
  .btn-sm { padding: 0.3em 0.8em; font-size: 0.8em; cursor: pointer; border: 1px solid #e53e3e; color: #e53e3e; background: none; }
  .btn-edit { padding: 0.3em 0.8em; font-size: 0.8em; cursor: pointer; border: 1px solid var(--global-masthead-bg-color); color: var(--global-masthead-bg-color); background: none; margin-right: 0.4em; }
  .btn-edit:hover { background: var(--global-masthead-bg-color); color: #fff; }
  .file-item-actions { display: flex; gap: 0.4em; flex-shrink: 0; }
  .cancel-edit { font-size: 0.85em; color: var(--global-text-color-light); cursor: pointer; text-decoration: underline; margin-left: 1em; display: none; }
  .cancel-edit.visible { display: inline; }
  .btn-sm:hover { background: #e53e3e; color: #fff; }

  .preview-box { padding: 1em; border: 1px dashed var(--global-border-color); margin-top: 0.5em; background: var(--global-footer-bg-color); font-size: 0.85em; display: none; }
  .preview-box h3 { margin: 0 0 0.5em 0; font-size: 0.9em; color: var(--global-text-color-light); }

  /* Settings */
  .settings-row { display: flex; gap: 1em; align-items: flex-end; }
  .settings-row .form-row { flex: 1; margin-bottom: 0; }

  /* Auth overlay */
  .auth-overlay { display: none; text-align: center; padding: 4em 2em; }
  .auth-overlay a { font-weight: 600; }
</style>

<div class="dash-wrap">
  <div id="token-banner" class="token-banner" style="display:none">
    ⚠️ 尚未配置 GitHub Token。请前往 <a href="https://github.com/settings/tokens" target="_blank">GitHub Settings → Tokens</a> 创建一个 <code>repo</code> 权限的 token，粘贴到下方。
  </div>

  <div class="dash-header">
    <h1>🛠️ 管理后台</h1>
    <span class="dash-logout" id="dash-logout">退出登录</span>
  </div>

  <div class="dash-tabs" id="dash-tabs">
    <a class="dash-tab active" href="#tab-news" data-tab="tab-news">📰 新闻管理</a>
    <a class="dash-tab" href="#tab-members" data-tab="tab-members">👥 成员管理</a>
    <a class="dash-tab" href="#tab-settings" data-tab="tab-settings">⚙️ 设置</a>
  </div>

  <!-- ====== Auth required overlay ====== -->
  <div class="auth-overlay" id="auth-overlay">
    <p style="font-size:1.2em; margin-bottom:1em;">🔐 请先登录</p>
    <p><a href="/Website-ZC---public/admin/">点击此处前往管理员登录</a></p>
  </div>

  <!-- ====== News Tab ====== -->
  <div class="dash-panel active" id="tab-news">
    <div class="dash-form">
      <h2>发布新新闻</h2>
      <div class="form-row">
        <label>新闻标题</label>
        <input type="text" id="news-title" placeholder="例如：课题组在Nature发表最新成果">
      </div>
      <div class="form-row-half">
        <div class="form-row">
          <label>日期</label>
          <input type="date" id="news-date">
        </div>
        <div class="form-row">
          <label>URL 标识（英文短名）</label>
          <input type="text" id="news-slug" placeholder="例如：new-paper-in-nature">
        </div>
      </div>
      <div class="form-row">
        <label>新闻内容（支持 Markdown）</label>
        <textarea id="news-content" placeholder="在这里输入新闻正文..."></textarea>
      </div>
      <div class="form-row">
        <label>摘要（留空则自动截取前 120 字）</label>
        <input type="text" id="news-excerpt" placeholder="可选，简短摘要">
      </div>
      <div style="display:flex; gap:1em; align-items:center;">
        <button class="btn-primary" id="news-submit">发布新闻</button>
        <span class="cancel-edit" id="news-cancel-edit">取消编辑</span>
        <span style="font-size:0.85em; color:var(--global-text-color-light);" id="news-filename-preview"></span>
      </div>
      <div class="msg" id="news-msg"></div>
    </div>
    <div class="file-list" id="news-list" style="margin-top:1.5em;"><p style="color:var(--global-text-color-light);">加载中...</p></div>
  </div>

  <!-- ====== Members Tab ====== -->
  <div class="dash-panel" id="tab-members">
    <div class="dash-form">
      <h2 id="member-form-title">添加课题组成员</h2>
      <div class="form-row">
        <label>姓名</label>
        <input type="text" id="member-name" placeholder="例如：张三">
      </div>
      <div class="form-row-half">
        <div class="form-row">
          <label>英文名 / URL 标识</label>
          <input type="text" id="member-slug" placeholder="例如：zhang-san">
        </div>
        <div class="form-row">
          <label>身份</label>
          <select id="member-role">
            <option value="phd">博士研究生</option>
            <option value="master">硕士研究生</option>
            <option value="undergrad">本科生</option>
            <option value="postdoc">博士后</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <label>入学年份</label>
        <input type="text" id="member-year" placeholder="例如：2026">
      </div>
      <div class="form-row">
        <label>学习经历</label>
        <input type="text" id="member-education" placeholder="例如：北京大学 学士 | 清华大学 硕士">
      </div>
      <div class="form-row">
        <label>邮箱</label>
        <input type="text" id="member-email" placeholder="例如：zhangsan@ucas.ac.cn">
      </div>
      <div class="form-row">
        <label>研究方向</label>
        <input type="text" id="member-research" placeholder="例如：锂离子电池正极材料">
      </div>
      <div class="form-row" id="member-avatar-row">
        <label>头像文件名（请先将图片上传至 <code>assets/img/members/</code>）</label>
        <input type="text" id="member-avatar" placeholder="例如：zhang-san.jpg">
      </div>
      <button class="btn-primary" id="member-submit">添加成员</button>
      <span class="cancel-edit" id="member-cancel-edit">取消编辑</span>
      <div class="msg" id="member-msg"></div>
    </div>

    <h3 style="font-size:1.1em; margin-bottom:0.8em;">现有成员页面</h3></h3>
    <div class="file-list" id="member-list"><p style="color:var(--global-text-color-light);">加载中...</p></div>
  </div>

  <!-- ====== Settings Tab ====== -->
  <div class="dash-panel" id="tab-settings">
    <div class="dash-form">
      <h2>GitHub 配置</h2>
      <div class="settings-row">
        <div class="form-row">
          <label>GitHub Personal Access Token</label>
          <input type="password" id="gh-token" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx">
        </div>
        <button class="btn-primary" id="save-token" style="flex-shrink:0;">保存 Token</button>
      </div>
      <p style="font-size:0.8em; color:var(--global-text-color-light); margin-top:0.5em;">
        Token 需要 <code>repo</code> 权限。创建地址：<a href="https://github.com/settings/tokens/new?scopes=repo" target="_blank">GitHub Token 生成</a>
        （Token 仅保存在您的浏览器本地，不会上传到服务器。）
      </p>
      <div class="msg" id="token-msg"></div>
    </div>

    <div class="dash-form">
      <h2>修改管理员密码</h2>
      <div class="form-row-half">
        <div class="form-row">
          <label>新密码</label>
          <input type="password" id="new-password" placeholder="输入新密码">
        </div>
        <div class="form-row">
          <label>确认新密码</label>
          <input type="password" id="confirm-password" placeholder="再次输入">
        </div>
      </div>
      <button class="btn-primary" id="change-password">修改密码</button>
      <div class="msg" id="pwd-msg"></div>
    </div>
  </div>
</div>

<script src="{{ site.baseurl }}/assets/js/admin-dash.js?v=7"></script>
