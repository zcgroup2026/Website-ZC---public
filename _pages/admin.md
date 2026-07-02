---
layout: single
title: "管理员入口"
permalink: /admin/
author_profile: false
---

<style>
  .admin-container { max-width: 420px; margin: 3em auto; }
  .admin-card {
    padding: 2.5em 2em;
    border: 1px solid var(--global-border-color);
    background: var(--global-bg-color);
  }
  .admin-card h2 { font-size: 1.4em; margin: 0 0 1.2em 0; padding: 0; border: none; text-align: center; }
  .admin-field { margin-bottom: 1.2em; }
  .admin-field label { display: block; font-size: 0.85em; font-weight: 600; margin-bottom: 0.4em; color: var(--global-text-color-light); }
  .admin-field input {
    width: 100%; padding: 0.7em 0.8em; font-size: 1em;
    border: 1px solid var(--global-border-color); background: var(--global-bg-color);
    color: var(--global-text-color); box-sizing: border-box;
  }
  .admin-field input:focus { outline: none; border-color: var(--global-masthead-bg-color); }
  .admin-btn {
    width: 100%; padding: 0.75em; font-size: 1em; font-weight: 600;
    border: none; cursor: pointer; background: var(--global-masthead-bg-color);
    color: #fff; letter-spacing: 0.5px; margin-top: 0.5em;
  }
  .admin-btn:hover { opacity: 0.9; }
  .admin-error { color: #e53e3e; font-size: 0.85em; text-align: center; margin-top: 0.8em; display: none; }
  .admin-hint { font-size: 0.8em; color: var(--global-text-color-light); text-align: center; margin-top: 1.5em; }
</style>

<div class="admin-container">
  <div class="admin-card">
    <h2>🔐 管理员登录</h2>
    <div class="admin-field">
      <label for="admin-password">密码</label>
      <input type="password" id="admin-password" placeholder="请输入管理员密码" autofocus>
    </div>
    <button class="admin-btn" id="admin-login-btn">登 录</button>
    <p class="admin-error" id="admin-error">密码错误，请重试</p>
  </div>
</div>

<script src="{{ site.baseurl }}/assets/js/admin.js"></script>
