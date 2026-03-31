# 从零搭建并部署个人主页：Vue 3 + GitHub API + 掘金数据

> 本文记录了如何用 Vue 3 + Vite 从零搭建一个功能完整的个人主页，涵盖 GitHub 动态数据、掘金文章展示、农历节气计算、移动端适配等，并部署到 GitHub Pages。整个项目完全免费，无需后端服务器。

---

## 一、项目概览

最终效果：[https://hxzg.github.io/personal-site/](https://hxzg.github.io/personal-site/)

**核心技术栈：**

| 技术 | 用途 |
|------|------|
| Vue 3 (Composition API) | 前端框架 |
| Vite 8 | 构建工具 |
| lunar-javascript | 农历/节气/节日计算 |
| GitHub REST API | 实时获取仓库和 Stars 数据 |
| GitHub Actions | 构建时预拉取掘金数据 |
| GitHub Pages | 免费静态托管 |

**功能模块：**

- 👤 个人介绍 + 技能雷达图 + 打字机语录
- 🗓️ 实时时钟 + 精确农历 + 节日倒计时 + 年度进度
- 🐙 GitHub 动态数据（实时拉取，5 分钟缓存）
- 📝 掘金文章（构建时预拉取，无需后端代理）
- 🛠️ 实用小工具集（JSON 格式化、Base64、密码生成等）
- 📱 移动端适配 + PWA 支持

---

## 二、项目初始化

使用 Vite 快速创建 Vue 3 项目：

```bash
npm create vite@latest personal-site -- --template vue
cd personal-site
npm install
npm install lunar-javascript
```

目录结构：

```
src/
├── components/      # 页面组件
├── composables/     # 组合式函数（数据层）
├── directives/     # 自定义指令
└── public/          # 静态资源
```

---

## 三、GitHub 数据动态化

### 3.1 调用 GitHub REST API

GitHub 提供了免费的公开 API，无需 Token 即可获取用户信息和仓库列表：

```javascript
// composables/useGithub.js
const GITHUB_USER = '你的用户名'

// 获取用户信息
const userRes = await fetch(`https://api.github.com/users/${GITHUB_USER}`)
const userData = await userRes.json()

// 获取仓库列表（按更新时间排序）
const reposRes = await fetch(
  `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`
)
const reposData = await reposRes.json()
```

### 3.2 缓存策略

为了避免频繁请求，采用 localStorage 缓存 + 过期时间机制：

```javascript
const CACHE_TTL = 5 * 60 * 1000 // 5分钟

function getCache(key) {
  const item = localStorage.getItem(key)
  if (!item) return null
  const { data, ts } = JSON.parse(item)
  if (Date.now() - ts > CACHE_TTL) {
    localStorage.removeItem(key)
    return null
  }
  return data
}
```

### 3.3 网络失败时的兜底方案

网络不稳定时，提供静态 fallback 数据，保证页面不白屏：

```javascript
const FALLBACK_REPOS = [
  { name: 'my-project', desc: '项目描述', lang: 'JavaScript', stars: 0, forks: 0, ... }
]

async function load() {
  try {
    // 正常流程：API 请求
    const data = await fetchGithub()
    user.value = data.user
    repos.value = data.repos
  } catch (e) {
    // 网络失败 → 使用兜底数据
    user.value = FALLBACK_USER
    repos.value = FALLBACK_REPOS
    error.value = 'GitHub 数据加载失败，显示缓存数据'
  }
}
```

---

## 四、掘金数据：构建时预拉取方案

### 4.1 跨域问题的本质

掘金 API 在响应头中设置了防盗链，浏览器直接请求会返回 403：

```
403 Forbidden ← 缺少 Referer 和 Origin 头
```

### 4.2 最优解：构建时预拉取

掘金提供了一个官方接口，可以获取用户文章列表（无需登录）：

```javascript
// scripts/fetch-juejin.js
const res = await fetch('https://api.juejin.cn/content_api/v1/article/query_list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Referer': 'https://juejin.cn',
    'Origin': 'https://juejin.cn',
  },
  body: JSON.stringify({
    user_id: '你的掘金 user_id',
    sort_type: 2,      // 按发布时间排序
    limit: 20,
  }),
})
```

**Node.js 环境下不存在跨域问题**，所以把数据在构建时拉取好，存为静态 JSON 文件，浏览器直接读文件，完美绕过跨域限制。

### 4.3 集成到 package.json

```json
{
  "scripts": {
    "build": "node scripts/fetch-juejin.js && vite build"
  }
}
```

每次 `npm run build` 时自动拉取最新数据，无需人工干预。

### 4.4 前端读取静态数据

```javascript
// composables/useJuejin.js
const res = await fetch('./juejin-data.json?t=' + Date.now())
const data = await res.json()
articles.value = data.articles
```

> 💡 **关键洞察**：很多"需要后端"的场景，实际上把数据拉取前置到构建阶段就能解决，无需维护额外的代理服务器。

---

## 五、农历、节气、节日：纯前端计算

使用 `lunar-javascript` 库，完全不需要任何 API 请求：

```javascript
import { Lunar, Solar } from 'lunar-javascript'

const solar = Solar.fromDate(new Date())
const lunar = solar.getLunar()

// 农历日期
lunar.getMonthInChinese() + '月' + lunar.getDayInChinese()
// → "三月十二"

// 节气（当天）
lunar.getJieQi()
// → "清明" 或 ""

const nextJieQi = lunar.getNextJieQi()
// → { name: "谷雨", date: "4月20日", days: 12 }
```

节日倒计时使用精确农历转换：

```javascript
// 春节（农历正月初一）
const spring = Lunar.fromYmd(2024, 1, 1)
const solar = spring.getSolar()
// → 2024-02-10
```

---

## 六、移动端适配

### 6.1 响应式布局

核心策略：CSS Grid + Flexbox，按断点切换布局：

```css
/* 桌面：双栏 */
.dt-grid { grid-template-columns: 1fr 1fr; }

/* 移动端：单栏 */
@media (max-width: 768px) {
  .dt-grid { grid-template-columns: 1fr; }
}
```

### 6.2 汉堡菜单

移动端导航用 `<Transition>` + 动画：

```vue
<button class="hamburger" @click="menuOpen = !menuOpen">
  <span></span><span></span><span></span>
</button>

<Transition name="menu">
  <div v-if="menuOpen" class="mobile-menu">...</div>
</Transition>
```

### 6.3 iOS 输入框缩放问题

移动端 `<input>` 默认会缩放字体，加上固定字体大小即可：

```css
input, textarea, select, button {
  font-size: 16px; /* iOS 要求的最小值 */
}
```

---

## 七、包体积优化：代码分割

`lunar-javascript` 打包后 425KB，是最大的一块。不能让它阻塞首屏。

Vite 配置代码分割，把大依赖单独打包：

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vue')) return 'vue-vendor'
          if (id.includes('node_modules/lunar-javascript')) return 'lunar'
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})
```

**优化效果：**

| 文件 | 优化前 | 优化后 |
|------|--------|--------|
| 主包 JS | 407 KB | **104 KB** |
| lunar 单独打包 | — | 306 KB（gzip 101 KB） |

lunar 模块按需加载，不影响首屏渲染速度。

---

## 八、GitHub Actions 自动部署

### 8.1 workflow 文件

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Fetch Juejin data
        run: node scripts/fetch-juejin.js

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 8.2 开启 GitHub Pages

仓库 → Settings → Pages → Source 选择 **GitHub Actions**

每次 push 到 main 分支，自动构建并部署，全程零人工操作。

---

## 九、项目亮点总结

| 亮点 | 说明 |
|------|------|
| 🎯 **零后端** | 掘金数据构建时拉取，GitHub API 直接调，数据全部来自免费公开接口 |
| ⚡ **高性能** | 代码分割 + localStorage 缓存 + 骨架屏，用户体验流畅 |
| 📱 **全端适配** | 响应式 + 汉堡菜单 + PWA，支持添加到手机桌面 |
| 🔧 **自动化** | GitHub Actions 自动部署，push 即上线 |
| 🛡️ **容错强** | GitHub API 失败时显示 fallback 数据，页面永不全白 |

---

## 十、个性化改造

克隆项目后，只需修改以下几行即可变成你自己的主页：

```javascript
// GitHub 用户名
const GITHUB_USER = '你的用户名'

// 掘金 user_id（从掘金个人主页 URL 中获取）
const JUEJIN_USER_ID = '你的掘金ID'

// 个人介绍
const userInfo = { name: '你的名字', title: '你的身份' }
```

项目地址：[https://github.com/HXZg/personal-site](https://github.com/HXZg/personal-site)

---

*如果你觉得这篇文章有帮助，欢迎点赞支持！有任何问题欢迎在评论区交流。*
