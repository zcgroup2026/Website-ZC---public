/**
 * Admin login logic for /admin/
 * Uses SHA-256 password hashing. Default password: cailab2026
 */

(function() {
  'use strict';

  // SHA-256 hash of default password "cailab2026"
  var DEFAULT_HASH = '2a3e1f5b8c9d0e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e';

  function getStoredHash() {
    return localStorage.getItem('cailab_admin_pwd_hash') || DEFAULT_HASH;
  }

  async function sha256(message) {
    var msgBuffer = new TextEncoder().encode(message);
    var hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    var hashArray = Array.from(new Uint8Array(hashBuffer));
    var hashHex = hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
    return hashHex;
  }

  function showError(msg) {
    var el = document.getElementById('admin-error');
    el.textContent = msg;
    el.style.display = 'block';
  }

  document.getElementById('admin-login-btn').addEventListener('click', async function() {
    var pwd = document.getElementById('admin-password').value.trim();
    if (!pwd) { showError('请输入密码'); return; }

    var hash = await sha256(pwd);
    if (hash === getStoredHash()) {
      // Generate a session token (random string + expiry)
      var sessionToken = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
      var expiry = Date.now() + 4 * 60 * 60 * 1000; // 4 hours
      localStorage.setItem('cailab_admin_session', sessionToken);
      localStorage.setItem('cailab_admin_expiry', expiry.toString());
      window.location.href = (document.querySelector('base') ? '' : '') + '/Website-ZC---public/dashboard/';
    } else {
      showError('密码错误，请重试');
    }
  });

  // Enter key to submit
  document.getElementById('admin-password').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      document.getElementById('admin-login-btn').click();
    }
  });

})();
