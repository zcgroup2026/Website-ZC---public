/**
 * Admin Dashboard - GitHub API powered CMS
 * Repository: zcgroup2026/Website-ZC---public
 */

(function() {
  'use strict';

  var REPO = 'zcgroup2026/Website-ZC---public';
  var BASEURL = '/Website-ZC---public';
  var API_BASE = 'https://api.github.com/repos/' + REPO + '/contents/';

  // ---- Auth Check ----
  function checkAuth() {
    var session = localStorage.getItem('cailab_admin_session');
    var expiry = parseInt(localStorage.getItem('cailab_admin_expiry') || '0');
    if (!session || Date.now() > expiry) {
      window.location.href = BASEURL + '/admin/';
      return false;
    }
    return true;
  }

  if (!checkAuth()) { return; }

  // ---- Token ----
  function getToken() { return localStorage.getItem('cailab_gh_token') || ''; }

  function showTokenBanner() {
    var banner = document.getElementById('token-banner');
    if (!getToken()) {
      banner.style.display = 'block';
    } else {
      banner.style.display = 'none';
      // Pre-fill token field
      var tf = document.getElementById('gh-token');
      if (tf) tf.value = getToken();
    }
  }

  // ---- Helpers ----
  function showMsg(id, text, type) {
    var el = document.getElementById(id);
    el.textContent = text;
    el.className = 'msg msg-' + type;
    el.style.display = 'block';
    setTimeout(function() { el.style.display = 'none'; }, 5000);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function slugify(text) {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .trim();
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

  function ghPut(path, content, message) {
    // First check if file exists (get its SHA)
    return ghGet(path).then(function(data) {
      return data.sha;
    }).catch(function() {
      return null;
    }).then(function(sha) {
      var body = {
        message: message || 'update',
        content: btoa(unescape(encodeURIComponent(content))),
        branch: 'main'
      };
      if (sha) body.sha = sha;
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

  function ghDelete(path, message) {
    return ghGet(path).then(function(data) {
      return fetch(API_BASE + path, {
        method: 'DELETE',
        headers: {
          'Authorization': 'token ' + getToken(),
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message || 'update',
          sha: data.sha,
          branch: 'main'
        })
      }).then(function(r) {
        if (!r.ok) throw new Error('GitHub API error: ' + r.status);
        return r.json();
      });
    });
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

  function loadNewsList() {
    var listEl = document.getElementById('news-list');
    listEl.innerHTML = '<p style="color:var(--global-text-color-light);">加载中...</p>';

    ghGet('_posts').then(function(files) {
      // Filter .md files, reverse chronological
      var posts = files
        .filter(function(f) { return f.name.endsWith('.md') && f.name !== '.gitkeep'; })
        .sort(function(a, b) { return b.name.localeCompare(a.name); });

      if (posts.length === 0) {
        listEl.innerHTML = '<p style="color:var(--global-text-color-light);">暂无新闻</p>';
        return;
      }

      var html = '';
      posts.forEach(function(p) {
        // Decode content to get title
        var content = decodeURIComponent(escape(atob(p.content)));
        var titleMatch = content.match(/title:\s*"([^"]*)"/);
        var title = titleMatch ? titleMatch[1] : p.name.replace('.md', '');
        html += '<div class="file-item">' +
          '<div class="file-item-info">' +
            '<span class="file-item-name">' + title + '</span>' +
            '<span class="file-item-date">' + p.name.substring(0, 10) + '</span>' +
          '</div>' +
          '<button class="btn-sm" onclick="if(confirm(\\'确定删除新闻「' + title + '」？\\')) window._deleteNews(\\'' + p.name + '\\', \\'' + p.sha + '\\')">删除</button>' +
        '</div>';
      });
      listEl.innerHTML = html;
    }).catch(function(err) {
      listEl.innerHTML = '<p style="color:#e53e3e;">加载失败：' + err.message + '</p>';
    });
  }

  // Expose delete function to inline onclick
  window._deleteNews = function(name, sha) {
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
  };

  // Preview filename
  document.getElementById('news-slug').addEventListener('input', function() {
    var date = document.getElementById('news-date').value;
    var slug = this.value.trim();
    var preview = document.getElementById('news-filename-preview');
    if (slug && date) {
      preview.textContent = '_posts/' + date + '-' + slug + '.md';
    } else {
      preview.textContent = '';
    }
  });
  document.getElementById('news-date').addEventListener('input', function() {
    document.getElementById('news-slug').dispatchEvent(new Event('input'));
  });

  document.getElementById('news-submit').addEventListener('click', function() {
    var token = getToken();
    if (!token) {
      showMsg('news-msg', '请先在「设置」中配置 GitHub Token', 'error');
      return;
    }

    var title = document.getElementById('news-title').value.trim();
    var date = document.getElementById('news-date').value;
    var slug = document.getElementById('news-slug').value.trim().toLowerCase().replace(/[^\w-]/g, '-').replace(/-+/g, '-');
    var content = document.getElementById('news-content').value.trim();
    var excerpt = document.getElementById('news-excerpt').value.trim();

    if (!title || !date || !slug || !content) {
      showMsg('news-msg', '请填写标题、日期、URL 标识和内容', 'error');
      return;
    }

    var path = newsFilename(slug, date);
    var fileContent = buildNewsContent(title, date, excerpt, content);

    ghPut(path, fileContent, 'update: ' + title).then(function() {
      showMsg('news-msg', '新闻「' + title + '」发布成功！片刻后刷新网站即可看到。', 'success');
      // Clear form
      document.getElementById('news-title').value = '';
      document.getElementById('news-content').value = '';
      document.getElementById('news-excerpt').value = '';
      document.getElementById('news-filename-preview').textContent = '';
      loadNewsList();
    }).catch(function(err) {
      showMsg('news-msg', '发布失败：' + err.message, 'error');
    });
  });

  // ========== MEMBERS ==========

  function memberRoleLabel(role) {
    var map = { phd: '博士研究生', master: '硕士研究生', undergrad: '本科生', postdoc: '博士后' };
    return map[role] || role;
  }

  function memberRoleClass(role) {
    var map = { phd: 'role-phd', master: 'role-master', undergrad: 'role-master', postdoc: 'role-phd' };
    return map[role] || 'role-master';
  }

  function loadMemberList() {
    var listEl = document.getElementById('member-list');
    listEl.innerHTML = '<p style="color:var(--global-text-color-light);">加载中...</p>';

    ghGet('_pages').then(function(files) {
      // Find student pages (exclude known non-member pages)
      var knownPages = ['404.md', 'about.md', 'admin.md', 'cv.md', 'dashboard.md',
        'join.md', 'markdown.md.bak', 'members.md', 'news.md',
        'portfolio.md', 'publications.html', 'research.html',
        'talks.html', 'teaching.html', 'year-archive.html'];

      var members = files.filter(function(f) {
        return f.name.endsWith('.md') && f.name !== '.gitkeep' && knownPages.indexOf(f.name) === -1;
      });

      if (members.length === 0) {
        listEl.innerHTML = '<p style="color:var(--global-text-color-light);">暂无学生成员页面</p>';
        return;
      }

      var html = '';
      members.forEach(function(m) {
        var slug = m.name.replace('.md', '');
        html += '<div class="file-item">' +
          '<div class="file-item-info">' +
            '<span class="file-item-name">' + slug + '</span>' +
          '</div>' +
          '<button class="btn-sm" onclick="if(confirm(\\'确定删除成员页面「' + slug + '」？\\')) window._deleteMember(\\'' + m.name + '\\', \\'' + m.sha + '\\')">删除</button>' +
        '</div>';
      });
      listEl.innerHTML = html;
    }).catch(function(err) {
      listEl.innerHTML = '<p style="color:#e53e3e;">加载失败：' + err.message + '</p>';
    });
  }

  window._deleteMember = function(name, sha) {
    var path = '_pages/' + name;
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
      showMsg('member-msg', '成员页面已删除。还需手动从 members.md 中移除卡片。', 'success');
      loadMemberList();
    }).catch(function(err) {
      showMsg('member-msg', '删除失败：' + err.message, 'error');
    });
  };

  document.getElementById('member-submit').addEventListener('click', function() {
    var token = getToken();
    if (!token) {
      showMsg('member-msg', '请先在「设置」中配置 GitHub Token', 'error');
      return;
    }

    var name = document.getElementById('member-name').value.trim();
    var slug = document.getElementById('member-slug').value.trim().toLowerCase().replace(/[^\w-]/g, '-').replace(/-+/g, '-');
    var role = document.getElementById('member-role').value;
    var bio = document.getElementById('member-bio').value.trim();
    var avatar = document.getElementById('member-avatar').value.trim();

    if (!name || !slug || !bio || !avatar) {
      showMsg('member-msg', '请填写所有字段', 'error');
      return;
    }

    // 1. Create member page
    var pageContent = [
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

    var pagePath = '_pages/' + slug + '.md';

    ghPut(pagePath, pageContent, 'update: add member ' + name).then(function() {
      // 2. Update members.md to add the member card
      return ghGet('_pages/members.md').then(function(data) {
        var membersContent = decodeURIComponent(escape(atob(data.content)));
        var sha = data.sha;

        // Build member card HTML
        var cardHtml = [
          '',
          '  <a href="{{ site.baseurl }}/' + slug + '/" class="member-card">',
          '    <img class="member-card__avatar" src="{{ site.baseurl }}/assets/img/members/' + avatar + '" alt="' + name + '">',
          '    <h3 class="member-card__name">' + name + '</h3>',
          '    <span class="member-card__role ' + memberRoleClass(role) + '">' + memberRoleLabel(role) + '</span>',
          '  </a>'
        ].join('\n');

        // Insert before last </div> in member-grid
        var insertPos = membersContent.lastIndexOf('</div>');
        if (insertPos === -1) insertPos = membersContent.length;
        var newContent = membersContent.substring(0, insertPos) + cardHtml + '\n' + membersContent.substring(insertPos);

        var body = {
          message: 'update: add ' + name + ' card',
          content: btoa(unescape(encodeURIComponent(newContent))),
          sha: sha,
          branch: 'main'
        };

        return fetch(API_BASE + '_pages/members.md', {
          method: 'PUT',
          headers: {
            'Authorization': 'token ' + getToken(),
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }).then(function(r) {
          if (!r.ok) throw new Error('Update members.md failed: ' + r.status);
          return r.json();
        });
      });
    }).then(function() {
      showMsg('member-msg', '成员「' + name + '」添加成功！已同步更新成员页面和 members.md。', 'success');
      document.getElementById('member-name').value = '';
      document.getElementById('member-slug').value = '';
      document.getElementById('member-bio').value = '';
      document.getElementById('member-avatar').value = '';
      loadMemberList();
    }).catch(function(err) {
      showMsg('member-msg', '添加失败：' + err.message, 'error');
    });
  });

  // ========== SETTINGS ==========

  // Token
  document.getElementById('save-token').addEventListener('click', function() {
    var token = document.getElementById('gh-token').value.trim();
    if (!token) {
      showMsg('token-msg', '请输入 Token', 'error');
      return;
    }
    localStorage.setItem('cailab_gh_token', token);
    showTokenBanner();
    showMsg('token-msg', 'Token 已保存', 'success');
  });

  // Password change
  document.getElementById('change-password').addEventListener('click', async function() {
    var pwd = document.getElementById('new-password').value.trim();
    var confirm = document.getElementById('confirm-password').value.trim();

    if (!pwd || pwd.length < 6) {
      showMsg('pwd-msg', '密码至少需要 6 个字符', 'error');
      return;
    }
    if (pwd !== confirm) {
      showMsg('pwd-msg', '两次输入的密码不一致', 'error');
      return;
    }

    var hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd));
    var hashHex = Array.from(new Uint8Array(hashBuffer)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
    localStorage.setItem('cailab_admin_pwd_hash', hashHex);
    showMsg('pwd-msg', '密码已修改成功', 'success');
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
  });

  // ========== TABS ==========

  document.querySelectorAll('.dash-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.dash-tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.dash-panel').forEach(function(p) { p.classList.remove('active'); });
      this.classList.add('active');
      document.getElementById(this.dataset.tab).classList.add('active');

      // Load data when switching tabs
      if (this.dataset.tab === 'tab-news') loadNewsList();
      if (this.dataset.tab === 'tab-members') loadMemberList();
    });
  });

  // ========== LOGOUT ==========
  document.getElementById('dash-logout').addEventListener('click', function() {
    localStorage.removeItem('cailab_admin_session');
    localStorage.removeItem('cailab_admin_expiry');
    window.location.href = BASEURL + '/admin/';
  });

  // ========== INIT ==========
  showTokenBanner();

  // Set today''s date as default
  var today = new Date();
  document.getElementById('news-date').value = formatDate(today.toISOString().split('T')[0]);

  loadNewsList();

})();
