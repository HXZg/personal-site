<template>
  <section class="section" :id="id">
    <div class="container">
      <SectionTitle icon="📝" title="掘金文章" />

      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <div class="skeleton-banner"></div>
        <div v-for="i in 4" :key="i" class="skeleton-article"></div>
      </div>

      <div v-else-if="error" class="error-tip">⚠️ {{ error }}</div>

      <template v-else>
        <!-- 用户横幅 -->
        <div class="jj-banner">
          <div class="jj-user">
            <img :src="userInfo?.avatar" alt="avatar" class="jj-avatar" />
            <div>
              <div class="jj-name">{{ userInfo?.name }}</div>
              <div class="jj-title-row">
                <span class="jj-level">Lv.{{ userInfo?.level }}</span>
                <span class="jj-badge">{{ userInfo?.levelTitle }}</span>
                <span class="jj-power">掘力值 {{ userInfo?.power }}</span>
              </div>
            </div>
          </div>
          <a :href="'https://juejin.cn/user/' + JUEJIN_USER_ID" target="_blank" class="jj-profile-btn">
            访问主页 →
          </a>
        </div>

        <!-- 统计 -->
        <div class="jj-stats">
          <div v-for="s in jjStats" :key="s.label" class="jj-stat">
            <span class="jj-stat-num">{{ s.value }}</span>
            <span class="jj-stat-label">{{ s.label }}</span>
          </div>
        </div>

        <!-- 标签筛选 -->
        <div class="tabs">
          <button v-for="tab in tabs" :key="tab"
            @click="activeTab = tab"
            :class="['tab-btn', { active: activeTab === tab }]">{{ tab }}</button>
        </div>

        <!-- 文章列表 -->
        <div class="articles-list">
          <a v-for="article in filteredArticles" :key="article.id"
            :href="article.url" target="_blank" class="article-card">
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
          <a :href="'https://juejin.cn/user/' + JUEJIN_USER_ID + '/posts'" target="_blank" class="load-more-btn">
            查看全部 {{ userInfo?.articleCount }} 篇文章 →
          </a>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SectionTitle from './SectionTitle.vue'
import { useJuejin } from '../composables/useJuejin.js'

defineProps({ id: String })

const JUEJIN_USER_ID = '1099167359577294'
const { userInfo, articles, loading, error, load } = useJuejin()
const activeTab = ref('全部')

onMounted(load)

const tabs = computed(() => {
  const tags = [...new Set(articles.value.map(a => a.tag))]
  return ['全部', ...tags]
})

const jjStats = computed(() => [
  { value: userInfo.value?.articleCount ?? '—', label: '文章' },
  { value: userInfo.value?.totalViews ?? '—',   label: '阅读' },
  { value: userInfo.value?.totalLikes ?? '—',   label: '点赞' },
  { value: userInfo.value?.followers ?? '—',    label: '粉丝' },
  { value: userInfo.value?.power ?? '—',        label: '掘力值' },
  { value: 'Lv.' + (userInfo.value?.level ?? '—'), label: '等级' },
])

const filteredArticles = computed(() => {
  if (activeTab.value === '全部') return articles.value
  return articles.value.filter(a => a.tag === activeTab.value)
})
</script>

<style scoped>
.section { padding: 5rem 1.5rem; }
.container { max-width: 1100px; margin: 0 auto; }

.loading-wrap { display: flex; flex-direction: column; gap: 1rem; }
.skeleton-banner { height: 80px; border-radius: var(--radius); background: var(--bg-card); animation: shimmer 1.5s infinite; }
.skeleton-article { height: 110px; border-radius: var(--radius); background: var(--bg-card); animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
.error-tip { color: var(--accent3); font-size: 0.9rem; padding: 1rem; background: rgba(247,129,102,0.1); border-radius: 8px; }

.jj-banner { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; transition: border-color 0.2s; flex-wrap: wrap; gap: 1rem; }
.jj-banner:hover { border-color: #1e80ff; }
.jj-user { display: flex; align-items: center; gap: 1rem; }
.jj-avatar { width: 52px; height: 52px; border-radius: 50%; border: 2px solid var(--border); }
.jj-name { font-weight: 700; font-size: 1.1rem; }
.jj-title-row { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.2rem; flex-wrap: wrap; }
.jj-level { font-size: 0.78rem; background: rgba(30,128,255,0.15); color: #1e80ff; padding: 0.15rem 0.5rem; border-radius: 4px; }
.jj-badge { font-size: 0.78rem; background: rgba(210,168,255,0.15); color: var(--accent4); padding: 0.15rem 0.5rem; border-radius: 4px; }
.jj-power { font-size: 0.78rem; color: var(--text-muted); }
.jj-profile-btn { padding: 0.5rem 1.25rem; border: 1px solid #1e80ff; border-radius: 8px; color: #1e80ff; font-size: 0.875rem; font-weight: 500; text-decoration: none; transition: all 0.2s; white-space: nowrap; }
.jj-profile-btn:hover { background: rgba(30,128,255,0.1); text-decoration: none; }

.jj-stats { display: flex; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 1.5rem; overflow: hidden; flex-wrap: wrap; }
.jj-stat { flex: 1; min-width: 80px; display: flex; flex-direction: column; align-items: center; padding: 1rem; gap: 0.2rem; border-right: 1px solid var(--border); }
.jj-stat:last-child { border-right: none; }
.jj-stat-num { font-size: 1.2rem; font-weight: 700; color: #1e80ff; }
.jj-stat-label { font-size: 0.78rem; color: var(--text-muted); }

.tabs { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.tab-btn { padding: 0.4rem 1rem; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-muted); cursor: pointer; font-size: 0.875rem; transition: all 0.2s; }
.tab-btn:hover { color: var(--text); }
.tab-btn.active { background: rgba(30,128,255,0.15); color: #1e80ff; border-color: rgba(30,128,255,0.4); }

.articles-list { display: flex; flex-direction: column; gap: 1rem; }
.article-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem 1.5rem; display: flex; gap: 1.5rem; align-items: flex-start; text-decoration: none; color: var(--text); transition: all 0.2s; }
.article-card:hover { border-color: #1e80ff; transform: translateX(4px); text-decoration: none; }
.article-left { flex: 1; display: flex; flex-direction: column; gap: 0.6rem; }
.article-meta { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
.article-tag { font-size: 0.75rem; padding: 0.15rem 0.55rem; border-radius: 4px; background: rgba(30,128,255,0.1); color: var(--tc, #1e80ff); border: 1px solid rgba(30,128,255,0.2); }
.article-date { font-size: 0.8rem; color: var(--text-muted); }
.article-hot { font-size: 0.75rem; color: #ffa657; }
.article-title { font-size: 1rem; font-weight: 600; line-height: 1.5; }
.article-card:hover .article-title { color: #1e80ff; }
.article-summary { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.article-footer { display: flex; gap: 1rem; flex-wrap: wrap; }
.article-stat { font-size: 0.8rem; color: var(--text-muted); }
.article-read-time { font-size: 0.8rem; color: var(--text-muted); margin-left: auto; }

.load-more { text-align: center; margin-top: 2rem; }
.load-more-btn { display: inline-block; padding: 0.6rem 2rem; border: 1px solid var(--border); border-radius: 8px; color: var(--text-muted); font-size: 0.9rem; transition: all 0.2s; text-decoration: none; }
.load-more-btn:hover { border-color: #1e80ff; color: #1e80ff; text-decoration: none; }

@media (max-width: 768px) {
  .section { padding: 3rem 1rem; }
  .jj-banner { flex-direction: column; align-items: flex-start; }
  .jj-profile-btn { width: 100%; text-align: center; }
  .article-card { padding: 1rem; }
  .article-footer { gap: 0.6rem; }
  .article-read-time { margin-left: 0; }
}
</style>
