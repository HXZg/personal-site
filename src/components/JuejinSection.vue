<template>
  <section class="section" :id="id">
    <div class="container">
      <SectionTitle icon="📝" title="掘金文章" />

      <!-- 用户信息横幅 -->
      <div class="jj-banner">
        <div class="jj-user">
          <img :src="userInfo.avatar" alt="avatar" class="jj-avatar" />
          <div>
            <div class="jj-name">{{ userInfo.name }}</div>
            <div class="jj-title">
              <span class="jj-level">Lv.{{ userInfo.level }}</span>
              <span class="jj-badge">{{ userInfo.title }}</span>
              <span class="jj-power">掘力值 {{ userInfo.power }}</span>
            </div>
          </div>
        </div>
        <a :href="'https://juejin.cn/user/' + userId" target="_blank" class="jj-profile-btn">
          访问主页 →
        </a>
      </div>

      <div class="jj-stats">
        <div v-for="s in jjStats" :key="s.label" class="jj-stat">
          <span class="jj-stat-num">{{ s.value }}</span>
          <span class="jj-stat-label">{{ s.label }}</span>
        </div>
      </div>

      <div class="tabs">
        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
          :class="['tab-btn', { active: activeTab === tab }]">{{ tab }}</button>
      </div>

      <div class="articles-list">
        <a v-for="article in filteredArticles" :key="article.id"
          :href="'https://juejin.cn/post/' + article.id" target="_blank" class="article-card">
          <div class="article-left">
            <div class="article-meta">
              <span class="article-tag" :style="{ '--tc': article.tagColor }">{{ article.tag }}</span>
              <span class="article-date">{{ article.date }}</span>
              <span v-if="article.hot" class="article-hot">🔥 热门</span>
            </div>
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-footer">
              <span class="article-stat">👁️ {{ article.views }}</span>
              <span class="article-stat">👍 {{ article.likes }}</span>
              <span class="article-stat">💬 {{ article.comments }}</span>
              <span class="article-stat">🔖 {{ article.collects }}</span>
              <span class="article-read-time">⏱️ {{ article.readTime }}</span>
            </div>
          </div>
        </a>
      </div>

      <div class="load-more">
        <a :href="'https://juejin.cn/user/' + userId + '/posts'" target="_blank" class="load-more-btn">
          查看全部文章 →
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import SectionTitle from './SectionTitle.vue'

defineProps({ id: String })

const userId = '1099167359577294'
const userInfo = {
  name: 'CTRL_CV',
  avatar: 'https://p9-passport.byteacctimg.com/img/user-avatar/00bdcb9a6dca5263933c667aa9f98426~180x180.image',
  level: 5,
  title: '掘学者',
  power: 93,
}

const jjStats = [
  { value: '6', label: '文章' },
  { value: '2,788', label: '阅读' },
  { value: '8', label: '点赞' },
  { value: '7', label: '粉丝' },
]

const activeTab = ref('全部')
const tabs = ['全部', 'HarmonyOS', '微信小程序']

const articles = [
  {
    id: '7323126379812880396',
    tag: 'HarmonyOS',
    tagColor: '#e040fb',
    date: '2024-01-13',
    title: '鸿蒙---登录/注册页',
    summary: '从零开始搭建鸿蒙应用的登录页面，涉及HarmonyOS UI框架的页面布局、组件使用等知识。',
    views: '255',
    likes: '0',
    comments: '0',
    collects: '0',
    readTime: '4分钟',
    hot: false,
    category: 'HarmonyOS',
    url: '#',
  },
  {
    id: '7320525947249590291',
    tag: 'HarmonyOS',
    tagColor: '#e040fb',
    date: '2024-01-06',
    title: '鸿蒙---应用通知/消息库',
    summary: '本篇记录涉及应用通知、通知消息（弹窗通知）、消息库（已读及未读列表）等功能。',
    views: '257',
    likes: '1',
    comments: '0',
    collects: '0',
    readTime: '3分钟',
    hot: false,
    category: 'HarmonyOS',
    url: '#',
  },
  {
    id: '7317870445322534948',
    tag: 'HarmonyOS',
    tagColor: '#e040fb',
    date: '2023-12-30',
    title: '鸿蒙---图片上传/下载',
    summary: '本篇记录中涉及鸿蒙的UI搭建，包括页面布局、轮播图、列表等。也提到了弹窗方式。',
    views: '1.4k',
    likes: '6',
    comments: '0',
    collects: '11',
    readTime: '3分钟',
    hot: true,
    category: 'HarmonyOS',
    url: '#',
  },
  {
    id: '7315461403828551690',
    tag: 'HarmonyOS',
    tagColor: '#e040fb',
    date: '2023-12-23',
    title: '鸿蒙---应用首页搭建',
    summary: '首页、列表页面的UI设计及搭建。列表页包含底部导航、轮播图、分类列表等内容。',
    views: '321',
    likes: '0',
    comments: '0',
    collects: '0',
    readTime: '2分钟',
    hot: false,
    category: 'HarmonyOS',
    url: '#',
  },
  {
    id: '7312727134296703010',
    tag: 'HarmonyOS',
    tagColor: '#e040fb',
    date: '2023-12-16',
    title: '鸿蒙---应用开发探索',
    summary: '了解鸿蒙的框架和核心基础知识，帮你快速入门应用开发。这一篇记录的是基础API 9的...',
    views: '188',
    likes: '1',
    comments: '0',
    collects: '0',
    readTime: '2分钟',
    hot: false,
    category: 'HarmonyOS',
    url: '#',
  },
  {
    id: '7269416466314985508',
    tag: '微信小程序',
    tagColor: '#07c160',
    date: '2023-08-21',
    title: '微信小程序 页面跳转',
    summary: '微信小程序 原理 页面跳转 登录状态的原理、微信小程序页面跳转的参数传递等知识。',
    views: '398',
    likes: '0',
    comments: '0',
    collects: '0',
    readTime: '2分钟',
    hot: false,
    category: '微信小程序',
    url: '#',
  },
]

const filteredArticles = computed(() => {
  if (activeTab.value === '全部') return articles
  return articles.filter(a => a.category === activeTab.value)
})
</script>

<style scoped>
.section { padding: 5rem 1.5rem; }
.container { max-width: 1100px; margin: 0 auto; }

/* 用户横幅 */
.jj-banner {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem;
  transition: border-color 0.2s;
}
.jj-banner:hover { border-color: #1e80ff; }
.jj-user { display: flex; align-items: center; gap: 1rem; }
.jj-avatar { width: 52px; height: 52px; border-radius: 50%; border: 2px solid var(--border); }
.jj-name { font-weight: 700; font-size: 1.1rem; color: var(--text); }
.jj-title { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.2rem; }
.jj-level { font-size: 0.78rem; background: rgba(30,128,255,0.15); color: #1e80ff; padding: 0.15rem 0.5rem; border-radius: 4px; }
.jj-badge { font-size: 0.78rem; background: rgba(210,168,255,0.15); color: var(--accent4); padding: 0.15rem 0.5rem; border-radius: 4px; }
.jj-power { font-size: 0.78rem; color: var(--text-muted); }
.jj-profile-btn {
  padding: 0.5rem 1.25rem; border: 1px solid #1e80ff; border-radius: 8px;
  color: #1e80ff; font-size: 0.875rem; font-weight: 500;
  text-decoration: none; transition: all 0.2s;
}
.jj-profile-btn:hover { background: rgba(30,128,255,0.1); text-decoration: none; }

/* 统计数据 */
.jj-stats {
  display: flex; gap: 0;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius); margin-bottom: 1.5rem;
  overflow: hidden;
}
.jj-stat {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  padding: 1rem; gap: 0.2rem; border-right: 1px solid var(--border);
}
.jj-stat:last-child { border-right: none; }
.jj-stat-num { font-size: 1.2rem; font-weight: 700; color: #1e80ff; }
.jj-stat-label { font-size: 0.78rem; color: var(--text-muted); }

.tabs { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; }
.tab-btn {
  padding: 0.4rem 1rem; border-radius: 8px; border: 1px solid var(--border);
  background: var(--bg-card); color: var(--text-muted); cursor: pointer; font-size: 0.875rem;
  transition: all 0.2s;
}
.tab-btn:hover { color: var(--text); }
.tab-btn.active { background: rgba(30,128,255,0.15); color: #1e80ff; border-color: rgba(30,128,255,0.4); }

.articles-list { display: flex; flex-direction: column; gap: 1rem; }

.article-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 1.25rem 1.5rem; display: flex; gap: 1.5rem; align-items: flex-start;
  text-decoration: none; color: var(--text); transition: all 0.2s;
}
.article-card:hover { border-color: #1e80ff; transform: translateX(4px); text-decoration: none; }

.article-left { flex: 1; display: flex; flex-direction: column; gap: 0.6rem; }
.article-meta { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
.article-tag {
  font-size: 0.75rem; padding: 0.15rem 0.55rem; border-radius: 4px;
  background: rgba(30,128,255,0.1); color: var(--tc, #1e80ff);
  border: 1px solid rgba(30,128,255,0.2);
}
.article-date { font-size: 0.8rem; color: var(--text-muted); }
.article-hot { font-size: 0.75rem; color: #ffa657; }
.article-title { font-size: 1rem; font-weight: 600; line-height: 1.5; color: var(--text); }
.article-card:hover .article-title { color: #1e80ff; }
.article-summary { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.article-footer { display: flex; gap: 1rem; flex-wrap: wrap; }
.article-stat { font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.25rem; }
.article-read-time { font-size: 0.8rem; color: var(--text-muted); margin-left: auto; }

.load-more { text-align: center; margin-top: 2rem; }
.load-more-btn {
  display: inline-block; padding: 0.6rem 2rem;
  border: 1px solid var(--border); border-radius: 8px;
  color: var(--text-muted); font-size: 0.9rem; transition: all 0.2s;
  text-decoration: none;
}
.load-more-btn:hover { border-color: #1e80ff; color: #1e80ff; text-decoration: none; }
</style>
