# HXZg · 个人主页

> 移动端开发者的技术博客与作品集，基于 **Vue 3 + Vite** 构建，部署于 GitHub Pages。

🌐 **在线预览**：https://hxzg.github.io/personal-site/

---

## ✨ 功能特性

| 模块 | 说明 |
|------|------|
| 👤 **个人介绍** | 头像、技能雷达图、打字机语录、外链入口 |
| 🗓️ **日期时间** | 实时时钟、农历/节气、节日倒计时、年度进度条 |
| 🐙 **GitHub** | 实时拉取 GitHub API，自动展示项目、Stars、Forks、语言筛选 |
| 📝 **掘金文章** | 构建时预拉取掘金数据，文章阅读/点赞/收藏实时展示 |
| 🛠️ **小工具集** | JSON 格式化、Base64 编解码、URL 编解码、颜色转换、密码生成、时间戳转换 |

---

## 🛠️ 技术栈

- **框架**：Vue 3 (Composition API + `<script setup>`)
- **构建**：Vite 8
- **样式**：原生 CSS Variables + 深色主题
- **农历计算**：lunar-javascript（构建时代入，零运行时体积）
- **动画**：Intersection Observer 滚动入场动画
- **数据源**：GitHub API + 掘金 API（构建时预拉取）

---

## 📦 目录结构

```
personal-site/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 自动构建部署
├── cf-worker/
│   └── juejin-proxy.js     # 掘金 API CF Worker 代理（可选）
├── public/
│   ├── 404.html           # 404 页面
│   ├── manifest.json      # PWA 配置
│   └── juejin-data.json    # 构建时自动生成的文章数据
├── scripts/
│   └── fetch-juejin.js    # 掘金数据预拉取脚本
├── src/
│   ├── components/        # Vue 组件
│   │   ├── HeroSection.vue      # 个人介绍
│   │   ├── DateTimeSection.vue  # 日期时间
│   │   ├── GithubSection.vue    # GitHub 项目
│   │   ├── JuejinSection.vue   # 掘金文章
│   │   ├── ToolsSection.vue     # 小工具
│   │   └── SectionTitle.vue    # 通用标题
│   ├── composables/       # 组合式函数
│   │   ├── useGithub.js   # GitHub API + localStorage 缓存
│   │   ├── useJuejin.js  # 掘金静态数据读取
│   │   └── useLunar.js    # 农历/节气计算
│   ├── directives/
│   │   └── reveal.js      # 滚动入场动画指令
│   ├── App.vue            # 根组件
│   ├── main.js            # 入口
│   └── style.css          # 全局样式
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/HXZg/personal-site.git
cd personal-site

# 安装依赖
npm install

# 拉取最新掘金数据（可选）
npm run fetch-juejin

# 启动开发服务器
npm run dev
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

---

## ⚙️ 配置个性化

### 1. 修改个人信息

编辑以下文件：

| 文件 | 修改内容 |
|------|---------|
| `src/components/HeroSection.vue` | 昵称、技能标签、个性语录 |
| `src/composables/useGithub.js` | `GITHUB_USER` → 你的 GitHub 用户名 |
| `src/composables/useJuejin.js` | `JUEJIN_USER_ID` → 你的掘金 user_id |
| `index.html` | SEO meta 标签（标题、描述、OG 信息） |
| `public/manifest.json` | PWA 名称、图标 |

### 2. 掘金数据说明

掘金数据通过 `scripts/fetch-juejin.js` 在构建时自动拉取，数据文件为 `public/juejin-data.json`。

> **无需手动配置**：每次 `npm run build`（即 GitHub Actions 构建时）会自动更新。

### 3. GitHub Pages 部署

本项目使用 GitHub Actions 自动部署，参考 `.github/workflows/deploy.yml`。

在 GitHub 仓库中开启 Pages：

1. `Settings → Pages → Source` → 选择 **GitHub Actions**
2. push 代码后自动部署

---

## 🔌 数据源

| 数据 | 来源 | 缓存策略 |
|------|------|---------|
| GitHub 用户/仓库 | `api.github.com` | localStorage 5 分钟 |
| 掘金文章/统计 | 掘金 API（构建时） | 静态 JSON 文件 |
| 农历/节气/节日 | `lunar-javascript`（本地计算） | 无需请求 |

---

## 📱 移动端适配

- 响应式布局（桌面/平板/手机）
- 汉堡菜单导航
- 触摸优化（去除点击高亮、输入框字体不缩放）
- PWA 支持（可添加到主屏幕）

---

## 📄 License

MIT · 欢迎 Fork 和 Star
