/**
 * Admin Dashboard - GitHub API powered CMS
 * Repository: zcgroup2026/Website-ZC---public
 */

(function() {
  'use strict';

  var REPO = 'zcgroup2026/Website-ZC---public';
  var BASEURL = '/Website-ZC---public';
  var API_BASE = 'https://api.github.com/repos/' + REPO + '/contents/';

  var editState = { news: null, member: null };

  // ---- base64 (pure JS, no atob/btoa) ----
  var B64CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  function b64decode(str) {
    str = String(str).replace(/[^A-Za-z0-9+/=]/g, '');
    var out = [];
    var i = 0;
    while (i < str.length) {
      var a = B64CHARS.indexOf(str[i++]);
      var b = B64CHARS.indexOf(str[i++]);
      var c = B64CHARS.indexOf(str[i++]);
      var d = B64CHARS.indexOf(str[i++]);
      out.push((a << 2) | (b >> 4));
      if (c !== 64) out.push(((b & 15) << 4) | (c >> 2));
      if (d !== 64) out.push(((c & 3) << 6) | d);
    }
    return new TextDecoder('utf-8').decode(new Uint8Array(out));
  }

  function b64encode(str) {
    var bytes = new TextEncoder().encode(str);
    var out = '';
    for (var i = 0; i < bytes.length; i += 3) {
      var a = bytes[i];
      var b = i + 1 < bytes.length ? bytes[i + 1] : 0;
      var c = i + 2 < bytes.length ? bytes[i + 2] : 0;
      out += B64CHARS[a >> 2];
      out += B64CHARS[((a & 3) << 4) | (b >> 4)];
      out += i + 1 < bytes.length ? B64CHARS[((b & 15) << 2) | (c >> 6)] : '=';
      out += i + 2 < bytes.length ? B64CHARS[c & 63] : '=';
    }
    return out;
  }

  // ---- Auth ----
  function hasValidSession() {
    var s = localStorage.getItem('cailab_admin_session');
    var e = parseInt(localStorage.getItem('cailab_admin_expiry') || '0');
    return !!(s && Date.now() <= e);
  }

  function requireAuth() {
    if (!hasValidSession()) {
      var ov = document.getElementById('auth-overlay');
      if (ov) ov.style.display = 'block';
      document.querySelectorAll('.dash-panel').forEach(function(p) { p.classList.remove('active'); });
      return false;
    }
    return true;
  }

  // ---- Token ----
  function getToken() { return localStorage.getItem('cailab_gh_token') || ''; }

  function showTokenBanner() {
    var b = document.getElementById('token-banner');
    if (!b) return;
    b.style.display = getToken() ? 'none' : 'block';
    var tf = document.getElementById('gh-token');
    if (tf && getToken()) tf.value = getToken();
  }

  // ---- Helpers ----
  function showMsg(id, text, type) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = 'msg msg-' + type;
    el.style.display = 'block';
    setTimeout(function() { el.style.display = 'none'; }, 5000);
  }

  function fmtDate(d) {
    if (!d) return '';
    var dt = new Date(d + 'T00:00:00');
    if (isNaN(dt.getTime())) { dt = new Date(d); if (isNaN(dt.getTime())) return d; }
    return dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0');
  }

  // ---- GitHub API ----
  function ghGet(path) {
    return fetch(API_BASE + path, {
      headers: { 'Authorization': 'token ' + getToken(), 'Accept': 'application/vnd.github.v3+json' }
    }).then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  function ghPut(path, fileContent, msg, existingSha) {
    var body = {
      message: msg || 'update',
      content: b64encode(fileContent),
      branch: 'main'
    };
    if (existingSha) body.sha = existingSha;

    function doPut(sha) {
      if (sha) body.sha = sha;
      return fetch(API_BASE + path, {
        method: 'PUT',
        headers: { 'Authorization': 'token ' + getToken(), 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
    }

    if (existingSha) return doPut(null);
    return ghGet(path).then(function(d) { return d.sha; }).catch(function() { return null; }).then(doPut);
  }

  // ---- parse frontmatter ----
  var FM_RE = /^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]+([\s\S]*)$/;

  function parseFrontmatter(raw) {
    var m = raw.match(FM_RE);
    if (!m) return null;
    var fm = m[1], body = m[2].trim();
    var title = (fm.match(/title:\s*"([^"]*)"/) || [])[1] || '';
    var date = (fm.match(/date:\s*(\S+)/) || [])[1] || '';
    var excerpt = (fm.match(/excerpt:\s*"([^"]*)"/) || [])[1] || '';
    var permalink = (fm.match(/permalink:\s*(\S+)/) || [])[1] || '';
    return { title: title, date: date, excerpt: excerpt, permalink: permalink, body: body };
  }

  // ---- Tab switching ----
  function switchTab(tabName) {
    if (!requireAuth()) return;
    document.querySelectorAll('.dash-tab').forEach(function(t) { t.classList.remove('active'); });
    var at = document.querySelector('.dash-tab[data-tab="' + tabName + '"]');
    if (at) at.classList.add('active');
    document.querySelectorAll('.dash-panel').forEach(function(p) { p.classList.remove('active'); });
    var pn = document.getElementById(tabName);
    if (pn) pn.classList.add('active');
    history.replaceState(null, null, '#' + tabName);
    if (tabName === 'tab-members') loadMemberList();
    if (tabName === 'tab-news') loadNewsList();
  }

  document.querySelectorAll('.dash-tab').forEach(function(tab) {
    tab.addEventListener('click', function(e) { e.preventDefault(); switchTab(this.dataset.tab); });
  });

  function initTab() {
    var hash = window.location.hash.replace('#', '');
    switchTab(['tab-news','tab-members','tab-settings'].indexOf(hash) !== -1 ? hash : 'tab-news');
  }

  // ==================== NEWS ====================

  function loadNewsList() {
    var list = document.getElementById('news-list');
    if (!list) return;
    list.innerHTML = '<p style="color:var(--global-text-color-light);">加载中...</p>';
    ghGet('_posts').then(function(files) {
      var posts = files.filter(function(f) { return f.name.endsWith('.md'); }).sort(function(a,b) { return b.name.localeCompare(a.name); });
      if (!posts.length) { list.innerHTML = '<p style="color:var(--global-text-color-light);">暂无新闻</p>'; return; }
      var html = '';
      posts.forEach(function(p) {
        var raw = b64decode(p.content);
        var fm = parseFrontmatter(raw);
        var title = fm ? fm.title : p.name.replace('.md','');
        html += '<div class="file-item"><div class="file-item-info"><span class="file-item-name">' + escHtml(title) + '</span><span class="file-item-date">' + escHtml(p.name.substring(0,10)) + '</span></div><div class="file-item-actions"><button class="btn-edit js-edit-news" data-name="' + escAttr(p.name) + '">编辑</button><button class="btn-sm js-delete-news" data-name="' + escAttr(p.name) + '" data-sha="' + escAttr(p.sha) + '">删除</button></div></div>';
      });
      list.innerHTML = html;
      list.querySelectorAll('.js-edit-news').forEach(function(b) { b.addEventListener('click', function() { editNews(this.dataset.name); }); });
      list.querySelectorAll('.js-delete-news').forEach(function(b) {
        b.addEventListener('click', function() {
          if (!requireAuth()) return;
          if (!confirm('确定删除此新闻？')) return;
          deleteNews(this.dataset.name, this.dataset.sha);
        });
      });
    }).catch(function(e) { list.innerHTML = '<p style="color:#e53e3e;">加载失败：' + escHtml(e.message) + '</p>'; });
  }

  function editNews(name) {
    if (!requireAuth() || !getToken()) { showMsg('news-msg','请先配置 GitHub Token','error'); return; }
    document.getElementById('news-msg').style.display = 'none';
    ghGet('_posts/' + name).then(function(d) {
      var raw = b64decode(d.content);
      var fm = parseFrontmatter(raw);
      if (!fm) { showMsg('news-msg','无法解析新闻文件','error'); return; }
      document.getElementById('news-title').value = fm.title;
      document.getElementById('news-date').value = fmtDate(fm.date);
      document.getElementById('news-content').value = fm.body;
      document.getElementById('news-excerpt').value = fm.excerpt;
      var slug = name.replace(/^\d{4}-\d{2}-\d{2}-/,'').replace('.md','');
      document.getElementById('news-slug').value = slug;
      var pv = document.getElementById('news-filename-preview');
      if (pv) pv.textContent = '_posts/' + name;
      editState.news = { name: name, sha: d.sha, path: '_posts/' + name };
      setNewsEditMode(true);
    }).catch(function(e) { showMsg('news-msg','加载失败：'+e.message,'error'); });
  }

  function setNewsEditMode(on) {
    var sub = document.getElementById('news-submit');
    var sl = document.getElementById('news-slug');
    var cl = document.getElementById('news-cancel-edit');
    sub.textContent = on ? '保存修改' : '发布新闻';
    sl.readOnly = on;
    sl.style.opacity = on ? '0.6' : '';
    if (cl) { cl.classList.toggle('visible', on); }
    if (!on) editState.news = null;
  }

  function cancelNewsEdit() {
    document.getElementById('news-title').value = '';
    document.getElementById('news-slug').value = '';
    document.getElementById('news-content').value = '';
    document.getElementById('news-excerpt').value = '';
    var pv = document.getElementById('news-filename-preview');
    if (pv) pv.textContent = '';
    setNewsEditMode(false);
  }

  function deleteNews(name, sha) {
    fetch(API_BASE + '_posts/' + name, {
      method: 'DELETE',
      headers: { 'Authorization': 'token ' + getToken(), 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'update', sha: sha, branch: 'main' })
    }).then(function(r) { if (!r.ok) throw new Error('HTTP '+r.status); showMsg('news-msg','已删除','success'); loadNewsList(); })
      .catch(function(e) { showMsg('news-msg','删除失败：'+e.message,'error'); });
  }

  function setupNewsForm() {
    var sl = document.getElementById('news-slug');
    var dt = document.getElementById('news-date');
    var sub = document.getElementById('news-submit');
    var pv = document.getElementById('news-filename-preview');
    if (!sl || !dt || !sub) return;
    function upd() { if (pv) pv.textContent = editState.news ? '_posts/' + editState.news.name : (sl.value.trim() && dt.value) ? '_posts/' + dt.value + '-' + sl.value.trim() + '.md' : ''; }
    sl.addEventListener('input', upd);
    dt.addEventListener('input', upd);
    sub.addEventListener('click', function() {
      if (!requireAuth() || !getToken()) { showMsg('news-msg','请先配置 Token','error'); return; }
      var title = document.getElementById('news-title').value.trim();
      var date = dt.value;
      var slug = sl.value.trim().toLowerCase().replace(/[^\w-]/g,'-').replace(/-+/g,'-');
      var body = document.getElementById('news-content').value.trim();
      var ex = document.getElementById('news-excerpt').value.trim();
      if (!title || !date || !body) { showMsg('news-msg','请填写标题、日期和内容','error'); return; }
      if (!editState.news && !slug) { showMsg('news-msg','请填写 URL 标识','error'); return; }
      sub.disabled = true; sub.textContent = '保存中...';
      var path = editState.news ? editState.news.path : '_posts/' + date + '-' + slug + '.md';
      var fc = '---\ntitle: "' + title + '"\ndate: ' + date + '\ncategories: news\nauthor_profile: false\n';
      if (ex) fc += 'excerpt: "' + ex.replace(/"/g,'\\"') + '"\n';
      fc += '---\n\n' + body;
      ghPut(path, fc, 'update: ' + title, editState.news ? editState.news.sha : null)
        .then(function() {
          showMsg('news-msg','新闻「'+title+'」'+(editState.news?'已更新':'发布成功')+'！','success');
          cancelNewsEdit(); loadNewsList();
        }).catch(function(e) { showMsg('news-msg','保存失败：'+e.message,'error'); })
        .finally(function() { sub.disabled = false; sub.textContent = editState.news ? '保存修改' : '发布新闻'; });
    });
  }

  // ==================== MEMBERS ====================

  var KNOWN = ['404.md','about.md','admin.md','cv.md','dashboard.md','join.md','members.md','news.md','portfolio.md','publications.html','research.html','talks.html','teaching.html','year-archive.html','markdown.md.bak'];

  function loadMemberList() {
    var list = document.getElementById('member-list');
    if (!list) return;
    list.innerHTML = '<p style="color:var(--global-text-color-light);">加载中...</p>';
    ghGet('_pages').then(function(files) {
      var members = files.filter(function(f) { return f.name.endsWith('.md') && KNOWN.indexOf(f.name) === -1; });
      if (!members.length) { list.innerHTML = '<p style="color:var(--global-text-color-light);">暂无学生成员页面</p>'; return; }
      var html = '';
      members.forEach(function(m) {
        var raw = b64decode(m.content);
        var fm = parseFrontmatter(raw);
        var name = fm ? fm.title : m.name.replace('.md','');
        html += '<div class="file-item"><div class="file-item-info"><span class="file-item-name">' + escHtml(name) + '</span></div><div class="file-item-actions"><button class="btn-edit js-edit-member" data-name="' + escAttr(m.name) + '">编辑</button><button class="btn-sm js-delete-member" data-name="' + escAttr(m.name) + '" data-sha="' + escAttr(m.sha) + '">删除</button></div></div>';
      });
      list.innerHTML = html;
      list.querySelectorAll('.js-edit-member').forEach(function(b) { b.addEventListener('click', function() { editMember(this.dataset.name); }); });
      list.querySelectorAll('.js-delete-member').forEach(function(b) {
        b.addEventListener('click', function() {
          if (!requireAuth()) return;
          if (!confirm('确定删除「' + this.dataset.name.replace('.md','') + '」？')) return;
          deleteMember(this.dataset.name, this.dataset.sha);
        });
      });
    }).catch(function(e) { list.innerHTML = '<p style="color:#e53e3e;">加载失败：' + escHtml(e.message) + '</p>'; });
  }

  function editMember(name) {
    if (!requireAuth() || !getToken()) { showMsg('member-msg','请先配置 GitHub Token','error'); return; }
    document.getElementById('member-msg').style.display = 'none';
    ghGet('_pages/' + name).then(function(d) {
      var raw = b64decode(d.content);
      var fm = parseFrontmatter(raw);
      if (!fm) { showMsg('member-msg','无法解析成员文件','error'); return; }
      document.getElementById('member-name').value = fm.title;
      document.getElementById('member-slug').value = fm.permalink.replace(/^\/|\/$/g,'');
      document.getElementById('member-bio').value = fm.body;
      editState.member = { name: name, sha: d.sha, path: '_pages/' + name };
      setMemberEditMode(true);
    }).catch(function(e) { showMsg('member-msg','加载失败：'+e.message,'error'); });
  }

  function setMemberEditMode(on) {
    var sub = document.getElementById('member-submit');
    var sl = document.getElementById('member-slug');
    var cl = document.getElementById('member-cancel-edit');
    sub.textContent = on ? '保存修改' : '添加成员';
    sl.readOnly = on;
    sl.style.opacity = on ? '0.6' : '';
    if (cl) cl.classList.toggle('visible', on);
    if (!on) editState.member = null;
  }

  function cancelMemberEdit() {
    document.getElementById('member-name').value = '';
    document.getElementById('member-slug').value = '';
    document.getElementById('member-bio').value = '';
    document.getElementById('member-avatar').value = '';
    setMemberEditMode(false);
  }

  function deleteMember(name, sha) {
    fetch(API_BASE + '_pages/' + name, {
      method: 'DELETE',
      headers: { 'Authorization': 'token ' + getToken(), 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'update', sha: sha, branch: 'main' })
    }).then(function(r) { if (!r.ok) throw new Error('HTTP '+r.status); showMsg('member-msg','已删除','success'); loadMemberList(); })
      .catch(function(e) { showMsg('member-msg','删除失败：'+e.message,'error'); });
  }

  function setupMemberForm() {
    var sub = document.getElementById('member-submit');
    if (!sub) return;
    sub.addEventListener('click', function() {
      if (!requireAuth() || !getToken()) { showMsg('member-msg','请先配置 Token','error'); return; }
      var name = document.getElementById('member-name').value.trim();
      var slug = document.getElementById('member-slug').value.trim().toLowerCase().replace(/[^\w-]/g,'-').replace(/-+/g,'-');
      var bio = document.getElementById('member-bio').value.trim();
      var role = document.getElementById('member-role').value;
      var avatar = document.getElementById('member-avatar').value.trim();
      if (!name || !slug) { showMsg('member-msg','请填写姓名和 URL 标识','error'); return; }
      if (!editState.member && (!bio || !avatar)) { showMsg('member-msg','请填写个人简介和头像文件名','error'); return; }
      sub.disabled = true; sub.textContent = '保存中...';
      var path = editState.member ? editState.member.path : '_pages/' + slug + '.md';
      var fc;
      if (editState.member) {
        fc = '---\ntitle: "' + name + '"\npermalink: /' + slug + '/\nlayout: single\nauthor_profile: false\nsidebar: false\n---\n\n' + bio;
      } else {
        var roleMap = { phd:'博士研究生', master:'硕士研究生', undergrad:'本科生', postdoc:'博士后' };
        fc = '---\ntitle: "' + name + '"\npermalink: /' + slug + '/\nlayout: single\nauthor_profile: false\nsidebar: false\n---\n\n<a href="{{ site.baseurl }}/members/" class="profile-back-link">&larr; 返回成员列表</a>\n\n<div class="profile-layout">\n  <div class="profile-sidebar">\n    <div class="profile-photo-wrap">\n      <img src="{{ site.baseurl }}/assets/img/members/' + avatar + '" alt="' + name + '">\n    </div>\n    <h2 class="profile-name">' + name + '</h2>\n    <span class="profile-role role-' + (role==='phd'?'phd':'master') + '">' + (roleMap[role]||role) + '</span>\n    <span class="profile-year">2026 级</span>\n  </div>\n  <div class="profile-main">\n    <div class="profile-info-card">\n      <h3>基本信息</h3>\n' + bio + '\n    </div>\n  </div>\n</div>';
      }
      ghPut(path, fc, 'update: ' + name, editState.member ? editState.member.sha : null)
        .then(function() {
          showMsg('member-msg','成员「'+name+'」'+(editState.member?'已更新':'添加成功')+'！','success');
          cancelMemberEdit(); loadMemberList();
        }).catch(function(e) { showMsg('member-msg','保存失败：'+e.message,'error'); })
        .finally(function() { sub.disabled = false; sub.textContent = editState.member ? '保存修改' : '添加成员'; });
    });
  }

  // ==================== SETTINGS ====================

  function setupSettings() {
    var st = document.getElementById('save-token');
    if (st) st.addEventListener('click', function() {
      if (!requireAuth()) return;
      var t = document.getElementById('gh-token').value.trim();
      if (!t) { showMsg('token-msg','请输入 Token','error'); return; }
      localStorage.setItem('cailab_gh_token', t);
      showTokenBanner();
      showMsg('token-msg','Token 已保存','success');
    });
    var cp = document.getElementById('change-password');
    if (cp) cp.addEventListener('click', async function() {
      if (!requireAuth()) return;
      var p = document.getElementById('new-password').value.trim();
      var pc = document.getElementById('confirm-password').value.trim();
      if (!p || p.length < 6) { showMsg('pwd-msg','密码至少6位','error'); return; }
      if (p !== pc) { showMsg('pwd-msg','两次不一致','error'); return; }
      var h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(p));
      var hex = Array.from(new Uint8Array(h)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
      localStorage.setItem('cailab_admin_pwd_hash', hex);
      showMsg('pwd-msg','密码已修改','success');
      document.getElementById('new-password').value = '';
      document.getElementById('confirm-password').value = '';
    });
  }

  // ---- cancel edit handlers ----
  var ncl = document.getElementById('news-cancel-edit');
  if (ncl) ncl.addEventListener('click', cancelNewsEdit);
  var mcl = document.getElementById('member-cancel-edit');
  if (mcl) mcl.addEventListener('click', cancelMemberEdit);

  // ---- logout ----
  var lo = document.getElementById('dash-logout');
  if (lo) lo.addEventListener('click', function() {
    localStorage.removeItem('cailab_admin_session');
    localStorage.removeItem('cailab_admin_expiry');
    window.location.href = BASEURL + '/admin/';
  });

  // ---- esc helpers ----
  function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function escAttr(s) { return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

  // ---- init ----
  showTokenBanner();
  var dt = document.getElementById('news-date');
  if (dt) dt.value = fmtDate(new Date().toISOString().split('T')[0]);
  setupNewsForm();
  setupMemberForm();
  setupSettings();

  if (hasValidSession()) {
    initTab();
  } else {
    var ov = document.getElementById('auth-overlay');
    if (ov) ov.style.display = 'block';
    document.querySelectorAll('.dash-panel').forEach(function(p) { p.classList.remove('active'); });
  }

  window.addEventListener('hashchange', function() {
    var h = window.location.hash.replace('#', '');
    if (['tab-news','tab-members','tab-settings'].indexOf(h) !== -1) switchTab(h);
  });

})();