# 蔡子健课题组网站 — 使用手册

> 网址：[https://zcgroup2026.github.io/Website-ZC---public/](https://zcgroup2026.github.io/Website-ZC---public/)
> 基于 Jekyll + Minimal Mistakes (AcademicPages 分支)，部署于 GitHub Pages，分支 `main`。

---

## 目录

1. [网站结构概览](#1-网站结构概览)
2. [页面导航与功能](#2-页面导航与功能)
3. [管理员系统使用](#3-管理员系统使用)
4. [如何添加新闻](#4-如何添加新闻)
5. [如何添加课题组成员](#5-如何添加课题组成员)
6. [如何修改研究领域](#6-如何修改研究领域)
7. [如何修改加入我们页面](#7-如何修改加入我们页面)
8. [如何修改首页个人简介](#8-如何修改首页个人简介)
9. [常见问题](#9-常见问题)

---

## 1. 网站结构概览

```
Website-ZC---public/
├── _config.yml              # 网站全局配置（标题、作者、导航等）
├── _data/
│   └── navigation.yml       # 导航栏菜单配置
├── _pages/                  # 所有页面
│   ├── about.md             # 首页
│   ├── members.md           # 课题组成员页
│   ├── news.md              # 课题组动态列表页
│   ├── research.html        # 研究领域列表页
│   ├── portfolio.md         # 仪器设备页
│   ├── join.md              # 加入我们页
│   ├── cv.md                # 导师个人简历页
│   ├── cui-haiyang.md       # 学生个人页（崔海洋）
│   ├── dong-li.md           # 学生个人页（董力）
│   ├── jiang-jingdong.md    # 学生个人页（姜景栋）
│   ├── jin-yiyang.md        # 学生个人页（靳依扬）
│   ├── admin.md             # 管理员登录页
│   └── dashboard.md         # 管理后台
├── _posts/                  # 新闻文章
│   ├── 2026-06-03-officiallyonline.md
│   └── 2026-06-10-cai-group-established.md
├── _research/               # 研究领域条目
│   ├── automated-lab.md
│   └── battery-materials.md
├── _portfolio/              # 仪器设备条目
│   └── equipment.md
├── _includes/               # 模板组件
│   ├── masthead.html        # 顶部导航栏
│   └── footer/custom.html   # 底部栏（相关链接等）
├── _sass/layout/            # 样式文件
│   ├── _page.scss           # 页面样式（member-card、news-card、pi-card 等）
│   ├── _masthead.scss       # 导航栏配色
│   ├── _footer.scss         # 底部栏配色
│   ├── _base.scss           # 基础排版（字体、行距、h2 样式）
│   └── _sidebar.scss        # 侧边栏样式
├── _sass/theme/             # 主题配色
│   ├── _default_light.scss  # 亮色主题变量
│   └── _default_dark.scss   # 暗色主题变量
├── assets/
│   ├── js/admin.js          # 管理员登录逻辑
│   ├── js/admin-dash.js     # 管理后台逻辑（GitHub API 增删文件）
│   └── img/members/         # 成员头像图片
├── images/                  # 网站图片资源
└── files/                   # PDF 论文文件
```

---

## 2. 页面导航与功能

| 导航名称     | URL                    | 功能说明                                   |
| ------------ | ---------------------- | ------------------------------------------ |
| 首页         | `/`                    | 导师简介 + 课题组介绍 + 最新动态            |
| 研究领域     | `/research/`           | 展示研究方向，每条一个独立页面带图片        |
| 研究成果     | `/year-archive/`       | 按年份归档的发表论文列表                    |
| 课题组成员   | `/members/`            | PI 卡片 + 成员卡片网格展示                  |
| 课题组动态   | `/news/`               | 新闻列表，卡片式布局                        |
| 仪器设备     | `/portfolio/`          | 课题组仪器设备展示                          |
| 加入我们     | `/join/`               | 招生简章、联系方式、报名链接                |
| 管理（右上角） | `/admin/`              | 管理员登录入口，默认密码见后文              |

---

## 3. 管理员系统使用

### 3.1 登录

1. 点击网站**最右上角**的「管理」小字
2. 输入管理员密码（默认：`cailab2026`）
3. 点击「登录」

> 登录后会话有效期 4 小时。退出登录或超时后需重新登录。

### 3.2 配置 GitHub Token（首次必需）

首次使用管理后台时，需要配置 GitHub Personal Access Token：

1. 登录后进入**「设置」**标签
2. 点击 [GitHub Token 生成](https://github.com/settings/tokens/new?scopes=repo) 创建 Token
   - 勾选 `repo` 权限
   - Expiration 选择任意时长
   - 点击 Generate token
3. 复制生成的 `ghp_xxxx...` Token
4. 粘贴到后台的「GitHub Personal Access Token」输入框
5. 点击「保存 Token」

> Token 仅保存在你的浏览器本地（localStorage），不会上传到任何服务器。

### 3.3 修改管理员密码

1. 进入**「设置」**标签
2. 在「修改管理员密码」区域输入新密码两遍
3. 点击「修改密码」

> 密码使用 SHA-256 哈希存储在浏览器本地。修改后不影响其他设备。忘记密码时需要在浏览器中清除 `cailab_admin_pwd_hash`。

---

## 4. 如何添加新闻

### 方法一：使用管理后台（推荐）

1. 登录后进入**「新闻管理」**标签
2. 填写：
   - **新闻标题**（中文）
   - **日期**（自动填入今天，可修改）
   - **URL 标识**（英文短名，如 `new-paper-in-nature`，会出现在网址中）
   - **新闻内容**（支持 Markdown 格式）
   - **摘要**（可选，留空则自动截取）
3. 点击「发布新闻」
4. 等待 1-2 分钟后，刷新网站即可看到新新闻

### 方法二：手动创建文件

在 `_posts/` 目录下创建文件，命名格式：`YYYY-MM-DD-英文短名.md`

```markdown
---
title: "新闻标题"
date: 2026-07-02
categories: news
author_profile: false
---

这里是新闻正文内容，支持 **Markdown** 格式。
```

---

## 5. 如何添加课题组成员

### 准备工作

1. 将成员头像图片（JPG 格式）放入 `assets/img/members/` 目录
2. 通过 git 提交图片文件（或直接在 GitHub 网页上传）

### 使用管理后台添加

1. 登录后进入**「成员管理」**标签
2. 填写所有字段：
   - **姓名**（中文）
   - **英文名 / URL 标识**（如 `zhang-san`，会生成 `/zhang-san/` 页面）
   - **身份**（博士/硕士/本科/博士后）
   - **个人简介**（支持 Markdown）
   - **头像文件名**（如 `zhang-san.jpg`）
3. 点击「添加成员」

> 系统会自动做两件事：① 在 `_pages/` 创建个人页面；② 在 `members.md` 中插入成员卡片。

---

## 6. 如何修改研究领域

研究领域存储在 `_research/` 目录下，每个 `.md` 文件对应一个研究方向。

### 修改现有方向

直接编辑对应文件，格式：

```markdown
---
title: "研究方向标题"
---

<p align="center">
  <img src="{{ site.baseurl }}/images/your-image.png" style="max-width:100%" alt="描述">
</p>

这里是研究方向的文字描述。
```

### 添加新方向

在 `_research/` 目录下创建新 `.md` 文件，按上述格式填写，提交后自动出现在研究领域页面。

---

## 7. 如何修改加入我们页面

直接编辑 `_pages/join.md`，支持标准 Markdown 格式。

---

## 8. 如何修改首页个人简介

编辑 `_pages/about.md`，其中：
- 导师信息（姓名、头像、简介）在 `_config.yml` 的 `author` 部分配置
- 课题组介绍在 about.md 的正文中编辑
- 最新动态区域自动显示最近 3 条新闻

---

## 9. 常见问题

### Q: 修改后网站没有更新？
A: GitHub Pages 构建需要 1-3 分钟。强制刷新浏览器（Ctrl+Shift+R）可以清除缓存。

### Q: 研究领域页面空白？
A: 检查 `_research/` 下的 `.md` 文件编码是否为 UTF-8 without BOM。如果文件开头有隐藏的 BOM 标记（`EF BB BF`），会导致 Jekyll 无法解析。

### Q: 管理员入口找不到？
A: 页面最右上角有一个灰色小字「管理」，点击即可进入登录页。

### Q: 导航栏想改顺序或增删项？
A: 编辑 `_data/navigation.yml`，调整 `main:` 列表的顺序和内容。

### Q: 想改网站配色？
A: 主要配色变量在 `_sass/theme/_default_light.scss`（亮色）和 `_default_dark.scss`（暗色）的 `--global-masthead-bg-color` 等变量中。

### Q: 底部栏的链接怎么改？
A: 编辑 `_includes/footer/custom.html`。

### Q: commit message 规范？
A: 统一使用 `update`。
