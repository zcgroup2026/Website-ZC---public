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
  var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  function b64d(s) { s = String(s).replace(/[^A-Za-z0-9+/=]/g,''); var o=[],i=0; while(i<s.length){var a=B64.indexOf(s[i++]),b=B64.indexOf(s[i++]),c=B64.indexOf(s[i++]),d=B64.indexOf(s[i++]);o.push((a<<2)|(b>>4));if(c!==64)o.push(((b&15)<<4)|(c>>2));if(d!==64)o.push(((c&3)<<6)|d);} return new TextDecoder('utf-8').decode(new Uint8Array(o)); }
  function b64e(s) { var b=new TextEncoder().encode(s),o=''; for(var i=0;i<b.length;i+=3){var a=b[i],bb=i+1<b.length?b[i+1]:0,c=i+2<b.length?b[i+2]:0;o+=B64[a>>2]+B64[((a&3)<<4)|(bb>>4)];o+=i+1<b.length?B64[((bb&15)<<2)|(c>>6)]:'=';o+=i+2<b.length?B64[c&63]:'=';} return o; }

  function hasSession() { var s=localStorage.getItem('cailab_admin_session'),e=parseInt(localStorage.getItem('cailab_admin_expiry')||'0'); return !!(s&&Date.now()<=e); }
  function reqAuth() { if(!hasSession()){var ov=document.getElementById('auth-overlay');if(ov)ov.style.display='block';document.querySelectorAll('.dash-panel').forEach(function(p){p.classList.remove('active');});return false;} return true; }
  function getToken() { return localStorage.getItem('cailab_gh_token')||''; }
  function showTb() { var b=document.getElementById('token-banner');if(!b)return;b.style.display=getToken()?'none':'block';var tf=document.getElementById('gh-token');if(tf&&getToken())tf.value=getToken(); }
  function msg(id,t,ty){ var el=document.getElementById(id);if(!el)return;el.textContent=t;el.className='msg msg-'+ty;el.style.display='block';setTimeout(function(){el.style.display='none';},5000); }
  function fmtD(d){ if(!d)return'';var dt=new Date(d+'T00:00:00');if(isNaN(dt.getTime())){dt=new Date(d);if(isNaN(dt.getTime()))return d;} return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0'); }

  function ghGet(p){ return fetch(API_BASE+p,{headers:{'Authorization':'token '+getToken(),'Accept':'application/vnd.github.v3+json'}}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}); }
  function ghPut(p,fc,mg,sha){ var body={message:mg||'update',content:b64e(fc),branch:'main'};if(sha)body.sha=sha;function dp(s){if(s)body.sha=s;return fetch(API_BASE+p,{method:'PUT',headers:{'Authorization':'token '+getToken(),'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();});} if(sha)return dp(null);return ghGet(p).then(function(d){return d.sha;}).catch(function(){return null;}).then(dp); }

  // NEWS IMAGE UPLOAD
  var NEWS_IMG_DIR = 'assets/img/news/';
  var IMG_EXTS = {png:1,jpg:1,jpeg:1,gif:1,webp:1,svg:1,bmp:1};

  function ghPutRaw(p,b64,mg){
    var body={message:mg||'update',content:b64,branch:'main'};
    return fetch(API_BASE+p,{method:'PUT',headers:{'Authorization':'token '+getToken(),'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();});
  }
  function readImgB64(file){
    return new Promise(function(res,rej){
      var fr=new FileReader();
      fr.onload=function(){res(String(fr.result).split(',')[1]||'');};
      fr.onerror=function(){rej(new Error('读取文件失败'));};
      fr.readAsDataURL(file);
    });
  }
  function imgMarkdown(name,alt){
    return '!['+alt+']({{ site.baseurl }}/'+NEWS_IMG_DIR+name+')';
  }
  function insertAtCursor(el,txt){
    if(!el)return;
    if(typeof el.selectionStart!=='undefined'){
      var s=el.selectionStart,e=el.selectionEnd,v=el.value;
      el.value=v.slice(0,s)+txt+v.slice(e);
      el.selectionStart=el.selectionEnd=s+txt.length;
      el.focus();
    }else{el.value+=txt;}
  }
  function addImgItem(name,b64,ext,alt){
    var list=document.getElementById('news-image-list');
    if(!list)return;
    list.style.display='block';
    var item=document.createElement('div');
    item.className='file-item';
    var md=imgMarkdown(name,alt);
    item.innerHTML='<div class="file-item-info"><img src="data:image/'+ext+';base64,'+b64+'" alt="" style="height:48px;width:auto;vertical-align:middle;margin-right:0.6em;border:1px solid var(--global-border-color);border-radius:4px;"><span class="file-item-name">'+escH(name)+'</span><br><code style="font-size:0.8em;">'+escH(md)+'</code></div><div class="file-item-actions"><button class="btn-edit js-img-insert" type="button">插入正文</button><button class="btn-sm js-img-delete" type="button">删除</button></div>';
    list.appendChild(item);
    item.querySelector('.js-img-insert').addEventListener('click',function(){
      insertAtCursor(document.getElementById('news-content'),md+'\n');
      msg('news-image-msg','已插入正文','success');
    });
    item.querySelector('.js-img-delete').addEventListener('click',function(){
      if(!confirm('确定从仓库删除该图片？'))return;
      ghGet(NEWS_IMG_DIR+name).then(function(d){
        return fetch(API_BASE+NEWS_IMG_DIR+name,{method:'DELETE',headers:{'Authorization':'token '+getToken(),'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'},body:JSON.stringify({message:'delete image: '+name,sha:d.sha,branch:'main'})});
      }).then(function(r){
        if(!r.ok)throw new Error('HTTP '+r.status);
        item.parentNode.removeChild(item);
        if(!list.children.length)list.style.display='none';
        msg('news-image-msg','图片已删除','success');
      }).catch(function(e){msg('news-image-msg','删除失败：'+e.message,'error');});
    });
  }
  function setupIMG(){
    var inp=document.getElementById('news-image'),btn=document.getElementById('news-image-upload');
    if(!inp||!btn)return;
    btn.addEventListener('click',function(){
      if(!reqAuth())return;
      if(!getToken()){msg('news-image-msg','请先配置 Token','error');return;}
      var f=inp.files&&inp.files[0];
      if(!f){msg('news-image-msg','请先选择图片文件','error');return;}
      var ext=(f.name.split('.').pop()||'').toLowerCase();
      if(!IMG_EXTS[ext]){msg('news-image-msg','仅支持 png / jpg / jpeg / gif / webp / svg / bmp','error');return;}
      if(f.size>10*1024*1024){msg('news-image-msg','图片不能超过 10MB','error');return;}
      var base=String(f.name.replace(/\.[^.]+$/,'')).trim().replace(/[^\p{L}\p{N}_-]+/gu,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')||'image';
      var name=Date.now()+'-'+base+'.'+ext;
      var alt=base;
      btn.disabled=true;btn.textContent='上传中...';
      readImgB64(f).then(function(b64){
        return ghPutRaw(NEWS_IMG_DIR+name,b64,'add news image: '+name).then(function(){return b64;});
      }).then(function(b64){
        addImgItem(name,b64,ext,alt);
        insertAtCursor(document.getElementById('news-content'),imgMarkdown(name,alt)+'\n');
        inp.value='';
        msg('news-image-msg','上传成功，已插入正文；GitHub Pages 构建完成后图片即可访问','success');
      }).catch(function(e){
        msg('news-image-msg','上传失败：'+e.message,'error');
      }).finally(function(){
        btn.disabled=false;btn.textContent='上传图片';
      });
    });
  }

  var FM_RE = /^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]+([\s\S]*)$/;
  function parseFM(raw) {
    var m=raw.match(FM_RE); if(!m)return null;
    var fm=m[1],body=m[2].trim();
    return {
      title:(fm.match(/title:\s*"([^"]*)"/)||[])[1]||'',
      date:(fm.match(/date:\s*(\S+)/)||[])[1]||'',
      excerpt:(fm.match(/excerpt:\s*"([^"]*)"/)||[])[1]||'',
      permalink:(fm.match(/permalink:\s*(\S+)/)||[])[1]||'',
      role:(fm.match(/role:\s*(\S+)/)||[])[1]||'',
      year:(fm.match(/year:\s*(\S+)/)||[])[1]||'',
      education:(fm.match(/education:\s*"([^"]*)"/)||[])[1]||'',
      email:(fm.match(/email:\s*(\S+)/)||[])[1]||'',
      research:(fm.match(/research:\s*"([^"]*)"/)||[])[1]||'',
      body:body
    };
  }

  function switchTab(tn){ if(!reqAuth())return;document.querySelectorAll('.dash-tab').forEach(function(t){t.classList.remove('active');});var at=document.querySelector('.dash-tab[data-tab="'+tn+'"]');if(at)at.classList.add('active');document.querySelectorAll('.dash-panel').forEach(function(p){p.classList.remove('active');});var pn=document.getElementById(tn);if(pn)pn.classList.add('active');history.replaceState(null,null,'#'+tn);if(tn==='tab-members')loadML();if(tn==='tab-news')loadNL(); }
  document.querySelectorAll('.dash-tab').forEach(function(t){t.addEventListener('click',function(e){e.preventDefault();switchTab(this.dataset.tab);});});
  function initTab(){ var h=window.location.hash.replace('#','');switchTab(['tab-news','tab-members','tab-settings'].indexOf(h)!==-1?h:'tab-news'); }

  // NEWS
  function loadNL(){ var list=document.getElementById('news-list');if(!list)return;list.innerHTML='<p style="color:var(--global-text-color-light);">加载中...</p>';ghGet('_posts').then(function(files){var posts=files.filter(function(f){return f.name.endsWith('.md');}).sort(function(a,b){return b.name.localeCompare(a.name);});if(!posts.length){list.innerHTML='<p style="color:var(--global-text-color-light);">暂无新闻</p>';return;}var h='';posts.forEach(function(p){var raw=b64d(p.content),fm=parseFM(raw);var t=fm?fm.title:p.name.replace('.md','');h+='<div class="file-item"><div class="file-item-info"><span class="file-item-name">'+escH(t)+'</span><span class="file-item-date">'+escH(p.name.substring(0,10))+'</span></div><div class="file-item-actions"><button class="btn-edit js-edit-news" data-name="'+escA(p.name)+'">编辑</button><button class="btn-sm js-delete-news" data-name="'+escA(p.name)+'" data-sha="'+escA(p.sha)+'">删除</button></div></div>';});list.innerHTML=h;list.querySelectorAll('.js-edit-news').forEach(function(b){b.addEventListener('click',function(){editNews(this.dataset.name);});});list.querySelectorAll('.js-delete-news').forEach(function(b){b.addEventListener('click',function(){if(!reqAuth())return;if(!confirm('确定删除？'))return;delNews(this.dataset.name,this.dataset.sha);});});}).catch(function(e){list.innerHTML='<p style="color:#e53e3e;">加载失败：'+escH(e.message)+'</p>';});}
  function editNews(n){ if(!reqAuth()||!getToken()){msg('news-msg','请先配置 Token','error');return;}document.getElementById('news-msg').style.display='none';ghGet('_posts/'+n).then(function(d){var raw=b64d(d.content),fm=parseFM(raw);if(!fm){msg('news-msg','无法解析','error');return;}document.getElementById('news-title').value=fm.title;document.getElementById('news-date').value=fmtD(fm.date);document.getElementById('news-content').value=fm.body;document.getElementById('news-excerpt').value=fm.excerpt;document.getElementById('news-slug').value=n.replace(/^\d{4}-\d{2}-\d{2}-/,'').replace('.md','');var pv=document.getElementById('news-filename-preview');if(pv)pv.textContent='_posts/'+n;editState.news={name:n,sha:d.sha,path:'_posts/'+n};setNEM(true);}).catch(function(e){msg('news-msg','加载失败：'+e.message,'error');});}
  function setNEM(on){ var s=document.getElementById('news-submit'),sl=document.getElementById('news-slug'),cl=document.getElementById('news-cancel-edit');s.textContent=on?'保存修改':'发布新闻';sl.readOnly=on;sl.style.opacity=on?'0.6':'';if(cl)cl.classList.toggle('visible',on);if(!on)editState.news=null; }
  function cancelNE(){ document.getElementById('news-title').value='';document.getElementById('news-slug').value='';document.getElementById('news-content').value='';document.getElementById('news-excerpt').value='';var pv=document.getElementById('news-filename-preview');if(pv)pv.textContent='';setNEM(false); }
  function delNews(n,s){ fetch(API_BASE+'_posts/'+n,{method:'DELETE',headers:{'Authorization':'token '+getToken(),'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'},body:JSON.stringify({message:'update',sha:s,branch:'main'})}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);msg('news-msg','已删除','success');loadNL();}).catch(function(e){msg('news-msg','删除失败：'+e.message,'error');}); }
  function setupNF(){ var sl=document.getElementById('news-slug'),dt=document.getElementById('news-date'),sub=document.getElementById('news-submit'),pv=document.getElementById('news-filename-preview');if(!sl||!dt||!sub)return;function upd(){if(pv)pv.textContent=editState.news?'_posts/'+editState.news.name:(sl.value.trim()&&dt.value)?'_posts/'+dt.value+'-'+sl.value.trim()+'.md':'';}sl.addEventListener('input',upd);dt.addEventListener('input',upd);sub.addEventListener('click',function(){if(!reqAuth()||!getToken()){msg('news-msg','请先配置 Token','error');return;}var title=document.getElementById('news-title').value.trim(),date=dt.value,slug=sl.value.trim().toLowerCase().replace(/[^\w-]/g,'-').replace(/-+/g,'-'),body=document.getElementById('news-content').value.trim(),ex=document.getElementById('news-excerpt').value.trim();if(!title||!date||!body){msg('news-msg','请填写标题、日期和内容','error');return;}if(!editState.news&&!slug){msg('news-msg','请填写 URL 标识','error');return;}sub.disabled=true;sub.textContent='保存中...';var p=editState.news?editState.news.path:'_posts/'+date+'-'+slug+'.md',fc='---\ntitle: "'+title+'"\ndate: '+date+'\ncategories: news\nauthor_profile: false\n';if(ex)fc+='excerpt: "'+ex.replace(/"/g,'\\"')+'"\n';fc+='---\n\n'+body;ghPut(p,fc,'update: '+title,editState.news?editState.news.sha:null).then(function(){msg('news-msg','新闻'+title+''+(editState.news?'已更新':'发布成功')+'！','success');cancelNE();loadNL();}).catch(function(e){msg('news-msg','保存失败：'+e.message,'error');}).finally(function(){sub.disabled=false;sub.textContent=editState.news?'保存修改':'发布新闻';});}); }

  // MEMBERS
  var KNOWN=['404.md','about.md','admin.md','cv.md','dashboard.md','join.md','members.md','news.md','portfolio.md','publications.html','research.html','talks.html','teaching.html','year-archive.html','markdown.md.bak'];
  function loadML(){ var list=document.getElementById('member-list');if(!list)return;list.innerHTML='<p style="color:var(--global-text-color-light);">加载中...</p>';ghGet('_pages').then(function(files){var members=files.filter(function(f){return f.name.endsWith('.md')&&KNOWN.indexOf(f.name)===-1;});if(!members.length){list.innerHTML='<p style="color:var(--global-text-color-light);">暂无学生成员页面</p>';return;}var h='';members.forEach(function(m){var raw=b64d(m.content),fm=parseFM(raw);var name=fm?fm.title:m.name.replace('.md','');h+='<div class="file-item"><div class="file-item-info"><span class="file-item-name">'+escH(name)+'</span></div><div class="file-item-actions"><button class="btn-edit js-edit-member" data-name="'+escA(m.name)+'">编辑</button><button class="btn-sm js-delete-member" data-name="'+escA(m.name)+'" data-sha="'+escA(m.sha)+'">删除</button></div></div>';});list.innerHTML=h;list.querySelectorAll('.js-edit-member').forEach(function(b){b.addEventListener('click',function(){editMB(this.dataset.name);});});list.querySelectorAll('.js-delete-member').forEach(function(b){b.addEventListener('click',function(){if(!reqAuth())return;if(!confirm('确定删除？'))return;delMB(this.dataset.name,this.dataset.sha);});});}).catch(function(e){list.innerHTML='<p style="color:#e53e3e;">加载失败：'+escH(e.message)+'</p>';});}
  function editMB(n){ if(!reqAuth()||!getToken()){msg('member-msg','请先配置 Token','error');return;}document.getElementById('member-msg').style.display='none';ghGet('_pages/'+n).then(function(d){var raw=b64d(d.content),fm=parseFM(raw);if(!fm){msg('member-msg','无法解析成员文件','error');return;}document.getElementById('member-name').value=fm.title;document.getElementById('member-slug').value=fm.permalink.replace(/^\/|\/$/g,'');document.getElementById('member-bio').value=fm.body;document.getElementById('member-role').value=fm.role||'master';document.getElementById('member-year').value=fm.year||'';document.getElementById('member-education').value=fm.education||'';document.getElementById('member-email').value=fm.email||'';document.getElementById('member-research').value=fm.research||'';document.getElementById('member-form-title').textContent='编辑成员信息';var av=document.getElementById('member-avatar-row');if(av)av.style.display='none';editState.member={name:n,sha:d.sha,path:'_pages/'+n};setMEM(true);}).catch(function(e){msg('member-msg','加载失败：'+e.message,'error');});}
  function setMEM(on){ var s=document.getElementById('member-submit'),sl=document.getElementById('member-slug'),cl=document.getElementById('member-cancel-edit');s.textContent=on?'保存修改':'添加成员';sl.readOnly=on;sl.style.opacity=on?'0.6':'';if(cl)cl.classList.toggle('visible',on);if(!on)editState.member=null; }
  function cancelME(){ document.getElementById('member-name').value='';document.getElementById('member-slug').value='';document.getElementById('member-bio').value='';document.getElementById('member-avatar').value='';document.getElementById('member-year').value='';document.getElementById('member-education').value='';document.getElementById('member-email').value='';document.getElementById('member-research').value='';document.getElementById('member-form-title').textContent='添加课题组成员';var av=document.getElementById('member-avatar-row');if(av)av.style.display='';setMEM(false); }
  function delMB(n,s){ fetch(API_BASE+'_pages/'+n,{method:'DELETE',headers:{'Authorization':'token '+getToken(),'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'},body:JSON.stringify({message:'update',sha:s,branch:'main'})}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);msg('member-msg','已删除','success');loadML();}).catch(function(e){msg('member-msg','删除失败：'+e.message,'error');}); }
  function setupMF(){ var sub=document.getElementById('member-submit');if(!sub)return;sub.addEventListener('click',function(){if(!reqAuth()||!getToken()){msg('member-msg','请先配置 Token','error');return;}var name=document.getElementById('member-name').value.trim(),slug=document.getElementById('member-slug').value.trim().toLowerCase().replace(/[^\w-]/g,'-').replace(/-+/g,'-'),bio=document.getElementById('member-bio').value.trim(),role=document.getElementById('member-role').value,year=document.getElementById('member-year').value.trim(),education=document.getElementById('member-education').value.trim(),emailAddr=document.getElementById('member-email').value.trim(),research=document.getElementById('member-research').value.trim(),avatar=document.getElementById('member-avatar').value.trim();if(!name||!slug){msg('member-msg','请填写姓名和 URL 标识','error');return;}if(!editState.member&&!avatar){msg('member-msg','请填写头像文件名','error');return;}sub.disabled=true;sub.textContent='保存中...';var p=editState.member?editState.member.path:'_pages/'+slug+'.md',fm='---\ntitle: "'+name+'"\npermalink: /'+slug+'/\nlayout: single\nauthor_profile: false\nsidebar: false\nrole: '+role+'\nyear: '+year+'\neducation: "'+education+'"\nemail: '+emailAddr+'\nresearch: "'+research+'"\n---\n\n',fc;var rm={phd:'博士研究生',master:'硕士研究生',undergrad:'本科生',postdoc:'博士后'};if(editState.member){fc=fm+bio;}else{fc=fm+'<a href="{{ site.baseurl }}/members/" class="profile-back-link">&larr; 返回成员列表</a>\n\n<div class="profile-layout">\n  <div class="profile-sidebar">\n    <div class="profile-photo-wrap">\n      <img src="{{ site.baseurl }}/assets/img/members/'+avatar+'" alt="'+name+'">\n    </div>\n    <h2 class="profile-name">'+name+'</h2>\n    <span class="profile-role role-'+(role==='phd'?'phd':'master')+'">'+(rm[role]||role)+'</span>\n    <span class="profile-year">'+year+' 级</span>\n  </div>\n  <div class="profile-main">\n    <div class="profile-info-card">\n      <h3>基本信息</h3>\n      <dl>\n        <dt>身份</dt><dd>'+(rm[role]||role)+'</dd>\n        <dt>入学年份</dt><dd>'+year+'</dd>\n        <dt>学习经历</dt><dd>{{ page.education }}</dd>\n        <dt>邮箱</dt><dd><a href="mailto:{{ page.email }}">{{ page.email }}</a></dd>\n        {% if page.research != "" %}\n        <dt>研究方向</dt><dd>{{ page.research }}</dd>\n        {% endif %}\n      </dl>\n    </div>\n  </div>\n</div>';}ghPut(p,fc,'update: '+name,editState.member?editState.member.sha:null).then(function(){msg('member-msg','成员'+name+''+(editState.member?'已更新':'添加成功')+'！','success');cancelME();loadML();}).catch(function(e){msg('member-msg','保存失败：'+e.message,'error');}).finally(function(){sub.disabled=false;sub.textContent=editState.member?'保存修改':'添加成员';});}); }

  // SETTINGS
  function setupST(){ var st=document.getElementById('save-token');if(st)st.addEventListener('click',function(){if(!reqAuth())return;var t=document.getElementById('gh-token').value.trim();if(!t){msg('token-msg','请输入 Token','error');return;}localStorage.setItem('cailab_gh_token',t);showTb();msg('token-msg','Token 已保存','success');});var cp=document.getElementById('change-password');if(cp)cp.addEventListener('click',async function(){if(!reqAuth())return;var p=document.getElementById('new-password').value.trim(),pc=document.getElementById('confirm-password').value.trim();if(!p||p.length<6){msg('pwd-msg','密码至少6位','error');return;}if(p!==pc){msg('pwd-msg','两次不一致','error');return;}var h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(p));var hex=Array.from(new Uint8Array(h)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');localStorage.setItem('cailab_admin_pwd_hash',hex);msg('pwd-msg','密码已修改','success');document.getElementById('new-password').value='';document.getElementById('confirm-password').value='';}); }

  var ncl=document.getElementById('news-cancel-edit');if(ncl)ncl.addEventListener('click',cancelNE);
  var mcl=document.getElementById('member-cancel-edit');if(mcl)mcl.addEventListener('click',cancelME);
  var lo=document.getElementById('dash-logout');if(lo)lo.addEventListener('click',function(){localStorage.removeItem('cailab_admin_session');localStorage.removeItem('cailab_admin_expiry');window.location.href=BASEURL+'/admin/';});
  function escH(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function escA(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

  showTb();var dt=document.getElementById('news-date');if(dt)dt.value=fmtD(new Date().toISOString().split('T')[0]);
  setupNF();setupMF();setupST();setupIMG();
  if(hasSession()){initTab();}else{var ov=document.getElementById('auth-overlay');if(ov)ov.style.display='block';document.querySelectorAll('.dash-panel').forEach(function(p){p.classList.remove('active');});}
  window.addEventListener('hashchange',function(){var h=window.location.hash.replace('#','');if(['tab-news','tab-members','tab-settings'].indexOf(h)!==-1)switchTab(h);});
})();
