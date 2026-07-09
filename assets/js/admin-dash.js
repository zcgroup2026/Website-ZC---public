/**
 * Admin Dashboard - GitHub API powered CMS
 * Repository: zcgroup2026/Website-ZC---public
 */

(function() {
  'use strict';

  var REPO = 'zcgroup2026/Website-ZC---public';
  var BASEURL = '/Website-ZC---public';
  var API_BASE = 'https://api.github.com/repos/' + REPO + '/contents/';

  // Edit mode state
  var editState = { news: null, member: null };

  // ---- Auth ----
  function hasValidSession() {
    var session = localStorage.getItem('cailab_admin_session');
    var expiry = parseInt(localStorage.getItem('cailab_admin_expiry') || '0');
    return !!(session && Date.now() <= expiry);
  }

  function requireAuth() {
    if (!hasValidSession()) {
      var overlay = document.getElementById('auth-overlay');
      if (overlay) overlay.style.display = 'block';
      document.querySelectorAll('.dash-panel').forEach(function(p) { p.classList.remove('active'); });
      return false;
    }
    return true;
  }

  // ---- Token ----
  function getToken() { return localStorage.getItem('cailab_gh_token') || ''; }

  function showTokenBanner() {
    var banner = document.getElementById('token-banner');
    if (!banner) return;
    if (!getToken()) {
      banner.style.display = 'block';
    } else {
      banner.style.display = 'none';
      var tf = document.getElementById('gh-token');
      if (tf) tf.value = getToken();
    }
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

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) {
      d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
    }
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  // ---- GitHub API ----
  function ghGet(path) {
    return fetch(API_BASE + path, {
      headers: {
        'Authorization': 'token ' + getToken(),
        'Accept': 'application/vnd.github.v3+json'
      }
    }).then(function(r) {
      if (!r.ok) throw new Error('GitHub API error: ' + r.status);
      return r.json();
    });
  }

  function ghPut(path, content, message, sha) {
    if (sha) {
      var body = {
        message: message || 'update',
        content: b64encode(),
        branch: 'main',
        sha: sha
      };
      return fetch(API_BASE + path, {
        method: 'PUT',
        headers: {
          'Authorization': 'token ' + getToken(),
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).then(function(r) {
        if (!r.ok) throw new Error('GitHub API error: ' + r.status);
        return r.json();
      });
    }
    return ghGet(path).then(function(data) {
      return data.sha;
    }).catch(function() {
      return null;
    }).then(function(existingSha) {
      var body = {
        message: message || 'update',
        content: b64encode(),
        branch: 'main'
      };
      if (existingSha) body.sha = existingSha;
      return fetch(API_BASE + path, {
        method: 'PUT',
        headers: {
          'Authorization': 'token ' + getToken(),
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).then(function(r) {
        if (!r.ok) throw new Error('GitHub API error: ' + r.status);
        return r.json();
      });
    });
  }

  // ========== TAB SWITCHING ==========

  function switchTab(tabName) {
    if (!requireAuth()) return;

    document.querySelectorAll('.dash-tab').forEach(function(t) { t.classList.remove('active'); });
    var activeTab = document.querySelector('.dash-tab[data-tab="' + tabName + '"]');
    if (activeTab) activeTab.classList.add('active');

    document.querySelectorAll('.dash-panel').forEach(function(p) { p.classList.remove('active'); });
    var panel = document.getElementById(tabName);
    if (panel) panel.classList.add('active');

    history.replaceState(null, null, '#' + tabName);

    if (tabName === 'tab-members') loadMemberList();
    if (tabName === 'tab-news') loadNewsList();
  }

  document.querySelectorAll('.dash-tab').forEach(function(tab) {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      switchTab(this.dataset.tab);
    });
  });

  function initTab() {
    var hash = window.location.hash.replace('#', '');
    var validTabs = ['tab-news', 'tab-members', 'tab-settings'];
    if (validTabs.indexOf(hash) !== -1) {
      switchTab(hash);
    } else {
      switchTab('tab-news');
    }
  }

  // ========== NEWS ==========

  function newsFilename(slug, date) {
    return '_posts/' + date + '-' + slug + '.md';
  }

  function buildNewsContent(title, date, excerpt, content) {
    var lines = [
      '---',
      'title: "' + title + '"',
      'date: ' + date,
      'categories: news',
      'author_profile: false'
    ];
    if (excerpt && excerpt.trim()) {
      lines.push('excerpt: "' + excerpt.trim().replace(/"/g, '\\"') + '"');
    }
    lines.push('---');
    lines.push('');
    lines.push(content.trim());
    return lines.join('\n');
  }

  function parseNewsFrontmatter(raw) {
    var match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return null;
    var fm = match[1];
    var body = match[2].trim();
    var title = (fm.match(/title:\s*"([^"]*)"/) || [])[1] || '';
    var date = (fm.match(/date:\s*(\S+)/) || [])[1] || '';
    var excerpt = (fm.match(/excerpt:\s*"([^"]*)"/) || [])[1] || '';
    return { title: title, date: date, excerpt: excerpt, body: body };
  }

  function loadNewsList() {
    var listEl = document.getElementById('news-list');
    if (!listEl) return;
    listEl.innerHTML = '<p style="color:var(--global-text-color-light);">加载中...</p>';

    ghGet('_posts').then(function(files) {
      var posts = files
        .filter(function(f) { return f.name.endsWith('.md') && f.name !== '.gitkeep'; })
        .sort(function(a, b) { return b.name.localeCompare(a.name); });

      if (posts.length === 0) {
        listEl.innerHTML = '<p style="color:var(--global-text-color-light);">暂无新闻</p>';
        return;
      }

      var html = '';
      posts.forEach(function(p) {
        var content = b64decode();
        var parsed = parseNewsFrontmatter(content);
        var title = parsed ? parsed.title : p.name.replace('.md', '');
        html += '<div class="file-item">' +
          '<div class="file-item-info">' +
            '<span class="file-item-name">' + escHtml(title) + '</span>' +
            '<span class="file-item-date">' + escHtml(p.name.substring(0, 10)) + '</span>' +
          '</div>' +
          '<div class="file-item-actions">' +
            '<button class="btn-edit js-edit-news" data-name="' + escAttr(p.name) + '">编辑</button>' +
            '<button class="btn-sm js-delete-news" data-name="' + escAttr(p.name) + '" data-sha="' + escAttr(p.sha) + '">删除</button>' +
          '</div>' +
        '</div>';
      });
      listEl.innerHTML = html;

      listEl.querySelectorAll('.js-edit-news').forEach(function(btn) {
        btn.addEventListener('click', function() { loadNewsForEdit(this.dataset.name); });
      });

      listEl.querySelectorAll('.js-delete-news').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (!requireAuth()) return;
          var name = this.dataset.name;
          var sha = this.dataset.sha;
          if (!confirm('确定删除此新闻？')) return;
          deleteNews(name, sha);
        });
      });
    }).catch(function(err) {
      listEl.innerHTML = '<p style="color:#e53e3e;">加载失败：' + escHtml(err.message) + '</p>';
    });
  }

  function loadNewsForEdit(name) {
    if (!requireAuth() || !getToken()) { showMsg('news-msg', '请先配置 GitHub Token', 'error'); return; }
    var msgEl = document.getElementById('news-msg'); msgEl.style.display = 'none';

    ghGet('_posts/' + name).then(function(data) {
      var raw = b64decode();
      var parsed = parseNewsFrontmatter(raw);
      if (!parsed) { showMsg('news-msg', '无法解析新闻文件', 'error'); return; }

      document.getElementById('news-title').value = parsed.title;
      document.getElementById('news-date').value = formatDate(parsed.date);
      document.getElementById('news-content').value = parsed.body;
      document.getElementById('news-excerpt').value = parsed.excerpt;

      // Extract slug from filename: YYYY-MM-DD-slug.md
      var slug = name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');
      document.getElementById('news-slug').value = slug;

      // Update filename preview
      var previewEl = document.getElementById('news-filename-preview');
      if (previewEl) previewEl.textContent = '_posts/' + name;

      editState.news = { name: name, sha: data.sha, path: '_posts/' + name };
      setNewsEditMode(true);
    }).catch(function(err) {
      showMsg('news-msg', '加载新闻失败：' + err.message, 'error');
    });
  }

  function setNewsEditMode(on) {
    var submitEl = document.getElementById('news-submit');
    var slugEl = document.getElementById('news-slug');
    var cancelEl = document.getElementById('news-cancel-edit');
    if (on) {
      submitEl.textContent = '保存修改';
      slugEl.readOnly = true;
      slugEl.style.opacity = '0.6';
      if (cancelEl) cancelEl.classList.add('visible');
    } else {
      submitEl.textContent = '发布新闻';
      slugEl.readOnly = false;
      slugEl.style.opacity = '';
      if (cancelEl) cancelEl.classList.remove('visible');
      editState.news = null;
    }
  }

  function cancelNewsEdit() {
    document.getElementById('news-title').value = '';
    document.getElementById('news-slug').value = '';
    document.getElementById('news-content').value = '';
    document.getElementById('news-excerpt').value = '';
    var previewEl = document.getElementById('news-filename-preview');
    if (previewEl) previewEl.textContent = '';
    setNewsEditMode(false);
  }

  function deleteNews(name, sha) {
    var path = '_posts/' + name;
    fetch(API_BASE + path, {
      method: 'DELETE',
      headers: {
        'Authorization': 'token ' + getToken(),
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'update', sha: sha, branch: 'main' })
    }).then(function(r) {
      if (!r.ok) throw new Error('Delete failed: ' + r.status);
      showMsg('news-msg', '新闻已删除', 'success');
      loadNewsList();
    }).catch(function(err) {
      showMsg('news-msg', '删除失败：' + err.message, 'error');
    });
  }

  function setupNewsForm() {
    var slugEl = document.getElementById('news-slug');
    var dateEl = document.getElementById('news-date');
    var submitEl = document.getElementById('news-submit');
    var previewEl = document.getElementById('news-filename-preview');
    if (!slugEl || !dateEl || !submitEl) return;

    function updatePreview() {
      if (previewEl) {
        var date = dateEl.value;
        var slug = slugEl.value.trim();
        if (editState.news) {
          previewEl.textContent = '_posts/' + editState.news.name;
        } else {
          previewEl.textContent = (slug && date) ? '_posts/' + date + '-' + slug + '.md' : '';
        }
      }
    }
    slugEl.addEventListener('input', updatePreview);
    dateEl.addEventListener('input', updatePreview);

    submitEl.addEventListener('click', function() {
      if (!requireAuth()) return;
      var token = getToken();
      if (!token) { showMsg('news-msg', '请先在「设置」中配置 GitHub Token', 'error'); return; }

      var title = document.getElementById('news-title').value.trim();
      var date = dateEl.value;
      var slug = slugEl.value.trim().toLowerCase().replace(/[^\w-]/g, '-').replace(/-+/g, '-');
      var content = document.getElementById('news-content').value.trim();
      var excerpt = document.getElementById('news-excerpt').value.trim();

      if (!title || !date || !content) {
        showMsg('news-msg', '请填写标题、日期和内容', 'error');
        return;
      }
      if (!editState.news && !slug) {
        showMsg('news-msg', '请填写 URL 标识', 'error');
        return;
      }

      submitEl.disabled = true;
      submitEl.textContent = '保存中...';

      var path, fileContent, commitMsg;
      if (editState.news) {
        path = editState.news.path;
        fileContent = buildNewsContent(title, date, excerpt, content);
        commitMsg = 'update: ' + title;
      } else {
        path = newsFilename(slug, date);
        fileContent = buildNewsContent(title, date, excerpt, content);
        commitMsg = 'update: ' + title;
      }

      ghPut(path, fileContent, commitMsg, editState.news ? editState.news.sha : null)
        .then(function(result) {
          showMsg('news-msg', '新闻「' + title + '」' + (editState.news ? '已更新' : '发布成功') + '！', 'success');
          cancelNewsEdit();
          loadNewsList();
        }).catch(function(err) {
          showMsg('news-msg', '保存失败：' + err.message, 'error');
        }).finally(function() {
          submitEl.disabled = false;
          submitEl.textContent = editState.news ? '保存修改' : '发布新闻';
        });
    });
  }

  // ========== MEMBERS ==========

  function memberRoleLabel(role) {
    var map = { phd: '博士研究生', master: '硕士研究生', undergrad: '本科生', postdoc: '博士后' };
    return map[role] || role;
  }

  function memberRoleClass(role) {
    var map = { phd: 'role-phd', master: 'role-master', undergrad: 'role-master', postdoc: 'role-phd' };
    return map[role] || 'role-master';
  }

  function parseMemberFrontmatter(raw) {
    var match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return null;
    var fm = match[1];
    var body = match[2].trim();
    var title = (fm.match(/title:\s*"([^"]*)"/) || [])[1] || '';
    var permalink = (fm.match(/permalink:\s*(\S+)/) || [])[1] || '';
    return { title: title, permalink: permalink, body: body };
  }

  function loadMemberList() {
    var listEl = document.getElementById('member-list');
    if (!listEl) return;
    listEl.innerHTML = '<p style="color:var(--global-text-color-light);">加载中...</p>';

    ghGet('_pages').then(function(files) {
      var knownPages = ['404.md', 'about.md', 'admin.md', 'cv.md', 'dashboard.md',
        'join.md', 'members.md', 'news.md', 'portfolio.md', 'publications.html',
        'research.html', 'talks.html', 'teaching.html', 'year-archive.html', 'markdown.md.bak'];

      var members = files.filter(function(f) {
        return f.name.endsWith('.md') && f.name !== '.gitkeep' && knownPages.indexOf(f.name) === -1;
      });

      if (members.length === 0) {
        listEl.innerHTML = '<p style="color:var(--global-text-color-light);">暂无学生成员页面</p>';
        return;
      }

      var html = '';
      members.forEach(function(m) {
        var content = b64decode();
        var parsed = parseMemberFrontmatter(content);
        var displayName = parsed ? parsed.title : m.name.replace('.md', '');
        html += '<div class="file-item">' +
          '<div class="file-item-info"><span class="file-item-name">' + escHtml(displayName) + '</span></div>' +
          '<div class="file-item-actions">' +
            '<button class="btn-edit js-edit-member" data-name="' + escAttr(m.name) + '">编辑</button>' +
            '<button class="btn-sm js-delete-member" data-name="' + escAttr(m.name) + '" data-sha="' + escAttr(m.sha) + '">删除</button>' +
          '</div>' +
        '</div>';
      });
      listEl.innerHTML = html;

      listEl.querySelectorAll('.js-edit-member').forEach(function(btn) {
        btn.addEventListener('click', function() { loadMemberForEdit(this.dataset.name); });
      });

      listEl.querySelectorAll('.js-delete-member').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (!requireAuth()) return;
          var name = this.dataset.name;
          var sha = this.dataset.sha;
          if (!confirm('确定删除成员页面「' + name.replace('.md', '') + '」？')) return;
          deleteMember(name, sha);
        });
      });
    }).catch(function(err) {
      listEl.innerHTML = '<p style="color:#e53e3e;">加载失败：' + escHtml(err.message) + '</p>';
    });
  }

  function loadMemberForEdit(name) {
    if (!requireAuth() || !getToken()) { showMsg('member-msg', '请先配置 GitHub Token', 'error'); return; }
    var msgEl = document.getElementById('member-msg'); msgEl.style.display = 'none';

    ghGet('_pages/' + name).then(function(data) {
      var raw = b64decode();
      var parsed = parseMemberFrontmatter(raw);
      if (!parsed) { showMsg('member-msg', '无法解析成员文件', 'error'); return; }

      document.getElementById('member-name').value = parsed.title;
      document.getElementById('member-slug').value = parsed.permalink.replace(/^\/|\/$/g, '');
      document.getElementById('member-bio').value = parsed.body;

      editState.member = { name: name, sha: data.sha, path: '_pages/' + name };
      setMemberEditMode(true);
    }).catch(function(err) {
      showMsg('member-msg', '加载成员失败：' + err.message, 'error');
    });
  }

  function setMemberEditMode(on) {
    var submitEl = document.getElementById('member-submit');
    var slugEl = document.getElementById('member-slug');
    var cancelEl = document.getElementById('member-cancel-edit');
    if (on) {
      submitEl.textContent = '保存修改';
      slugEl.readOnly = true;
      slugEl.style.opacity = '0.6';
      if (cancelEl) cancelEl.classList.add('visible');
    } else {
      submitEl.textContent = '添加成员';
      slugEl.readOnly = false;
      slugEl.style.opacity = '';
      if (cancelEl) cancelEl.classList.remove('visible');
      editState.member = null;
    }
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
      headers: {
        'Authorization': 'token ' + getToken(),
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'update', sha: sha, branch: 'main' })
    }).then(function(r) {
      if (!r.ok) throw new Error('Delete failed: ' + r.status);
      showMsg('member-msg', '成员页面已删除', 'success');
      loadMemberList();
    }).catch(function(err) {
      showMsg('member-msg', '删除失败：' + err.message, 'error');
    });
  }

  function setupMemberForm() {
    var submitEl = document.getElementById('member-submit');
    if (!submitEl) return;

    submitEl.addEventListener('click', function() {
      if (!requireAuth()) return;
      var token = getToken();
      if (!token) { showMsg('member-msg', '请先在「设置」中配置 GitHub Token', 'error'); return; }

      var name = document.getElementById('member-name').value.trim();
      var slug = document.getElementById('member-slug').value.trim().toLowerCase().replace(/[^\w-]/g, '-').replace(/-+/g, '-');
      var bio = document.getElementById('member-bio').value.trim();
      var role = document.getElementById('member-role').value;
      var avatar = document.getElementById('member-avatar').value.trim();

      if (!name || !slug) {
        showMsg('member-msg', '请填写姓名和 URL 标识', 'error');
        return;
      }

      submitEl.disabled = true;
      submitEl.textContent = '保存中...';

      var path, pageContent;
      if (editState.member) {
        path = editState.member.path;
        pageContent = [
          '---',
          'title: "' + name + '"',
          'permalink: /' + slug + '/',
          'layout: single',
          'author_profile: false',
          'sidebar: false',
          '---',
          '',
          bio
        ].join('\n');
      } else {
        if (!bio || !avatar) { showMsg('member-msg', '请填写个人简介和头像文件名', 'error'); submitEl.disabled = false; submitEl.textContent = '添加成员'; return; }
        path = '_pages/' + slug + '.md';
        pageContent = [
          '---',
          'title: "' + name + '"',
          'permalink: /' + slug + '/',
          'layout: single',
          'author_profile: false',
          'sidebar: false',
          '---',
          '',
          '<div class="member-page-header">',
          '  <img src="{{ site.baseurl }}/assets/img/members/' + avatar + '"',
          '       alt="' + name + '"',
          '       style="width:180px; display:block; margin:0 auto 1.5em auto;">',
          '  <h1 style="text-align:center; font-size:1.5em; margin-bottom:0.3em;">' + name + '</h1>',
          '  <p style="text-align:center; color:var(--global-text-color-light);">' + memberRoleLabel(role) + '</p>',
          '</div>',
          '',
          '<hr>',
          '',
          bio
        ].join('\n');
      }

      ghPut(path, pageContent, 'update: ' + name, editState.member ? editState.member.sha : null)
        .then(function() {
          showMsg('member-msg', '成员「' + name + '」' + (editState.member ? '已更新' : '添加成功') + '！', 'success');
          cancelMemberEdit();
          loadMemberList();
        }).catch(function(err) {
          showMsg('member-msg', '保存失败：' + err.message, 'error');
        }).finally(function() {
          submitEl.disabled = false;
          submitEl.textContent = editState.member ? '保存修改' : '添加成员';
        });
    });
  }

  // ========== SETTINGS ==========

  function setupSettings() {
    var saveTokenEl = document.getElementById('save-token');
    if (saveTokenEl) {
      saveTokenEl.addEventListener('click', function() {
        if (!requireAuth()) return;
        var token = document.getElementById('gh-token').value.trim();
        if (!token) { showMsg('token-msg', '请输入 Token', 'error'); return; }
        localStorage.setItem('cailab_gh_token', token);
        showTokenBanner();
        showMsg('token-msg', 'Token 已保存', 'success');
      });
    }

    var changePwdEl = document.getElementById('change-password');
    if (changePwdEl) {
      changePwdEl.addEventListener('click', async function() {
        if (!requireAuth()) return;
        var pwd = document.getElementById('new-password').value.trim();
        var confirmPwd = document.getElementById('confirm-password').value.trim();
        if (!pwd || pwd.length < 6) { showMsg('pwd-msg', '密码至少需要 6 个字符', 'error'); return; }
        if (pwd !== confirmPwd) { showMsg('pwd-msg', '两次输入的密码不一致', 'error'); return; }
        var hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd));
        var hashHex = Array.from(new Uint8Array(hashBuffer)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
        localStorage.setItem('cailab_admin_pwd_hash', hashHex);
        showMsg('pwd-msg', '密码已修改成功', 'success');
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
      });
    }
  }

  // ========== CANCEL EDIT handlers ==========

  var newsCancelEl = document.getElementById('news-cancel-edit');
  if (newsCancelEl) {
    newsCancelEl.addEventListener('click', cancelNewsEdit);
  }

  var memberCancelEl = document.getElementById('member-cancel-edit');
  if (memberCancelEl) {
    memberCancelEl.addEventListener('click', cancelMemberEdit);
  }

  // ========== LOGOUT ==========

  var logoutEl = document.getElementById('dash-logout');
  if (logoutEl) {
    logoutEl.addEventListener('click', function() {
      localStorage.removeItem('cailab_admin_session');
      localStorage.removeItem('cailab_admin_expiry');
      window.location.href = BASEURL + '/admin/';
    });
  }

  // ========== INIT ==========

  showTokenBanner();

  var dateEl = document.getElementById('news-date');
  if (dateEl) {
    var today = new Date();
    dateEl.value = formatDate(today.toISOString().split('T')[0]);
  }

  setupNewsForm();
  setupMemberForm();
  setupSettings();

  if (hasValidSession()) {
    initTab();
  } else {
    var overlay = document.getElementById('auth-overlay');
    if (overlay) overlay.style.display = 'block';
    document.querySelectorAll('.dash-panel').forEach(function(p) { p.classList.remove('active'); });
  }

  window.addEventListener('hashchange', function() {
    var hash = window.location.hash.replace('#', '');
    if (['tab-news', 'tab-members', 'tab-settings'].indexOf(hash) !== -1) {
      switchTab(hash);
    }
  });

  // ========== HTML escape helpers ==========

    function b64decode(str) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var cleaned = String(str).replace(/[^A-Za-z0-9+/=]/g, '');
    var output = [];
    var i = 0;
    while (i < cleaned.length) {
      var a = chars.indexOf(cleaned[i++]);
      var b = chars.indexOf(cleaned[i++]);
      var c = chars.indexOf(cleaned[i++]);
      var d = chars.indexOf(cleaned[i++]);
      var b1 = (a << 2) | (b >> 4);
      var b2 = ((b & 15) << 4) | (c >> 2);
      var b3 = ((c & 3) << 6) | d;
      output.push(b1);
      if (c !== 64) output.push(b2);
      if (d !== 64) output.push(b3);
    }
    var bytes = new Uint8Array(output);
    return new TextDecoder('utf-8').decode(bytes);
  }

  function b64encode(str) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var bytes = new TextEncoder().encode(str);
    var output = '';
    for (var i = 0; i < bytes.length; i += 3) {
      var a = bytes[i];
      var b = i + 1 < bytes.length ? bytes[i + 1] : 0;
      var c = i + 2 < bytes.length ? bytes[i + 2] : 0;
      output += chars[a >> 2];
      output += chars[((a & 3) << 4) | (b >> 4)];
      output += i + 1 < bytes.length ? chars[((b & 15) << 2) | (c >> 6)] : '=';
      output += i + 2 < bytes.length ? chars[c & 63] : '=';
    }
    return output;
  }

  function escHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escAttr(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

})();