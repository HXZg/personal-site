<template>
  <section class="section" :id="id">
    <div class="container">
      <SectionTitle icon="🐙" title="GitHub 项目" />

      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <div class="skeleton-profile"></div>
        <div class="skeleton-grid">
          <div v-for="i in 6" :key="i" class="skeleton-card"></div>
        </div>
      </div>

      <!-- 错误 -->
      <div v-else-if="error" class="error-tip">⚠️ {{ error }}，显示缓存数据</div>

      <template v-else>
        <!-- 用户信息 -->
        <div class="gh-profile">
          <div class="gh-user">
            <img :src="user?.avatar_url" alt="avatar" class="gh-avatar" />
            <div>
              <div class="gh-name">{{ user?.login }}</div>
              <div class="gh-bio">{{ user?.bio || '移动端开发 · HarmonyOS · Android' }}</div>
            </div>
          </div>
          <div class="gh-meta">
            <span v-for="m in ghMeta" :key="m.label" class="gh-meta-item">
              <span class="gh-meta-icon">{{ m.icon }}</span>
              <span class="gh-meta-val">{{ m.value }}</span>
              <span class="gh-meta-label">{{ m.label }}</span>
            </span>
          </div>
        </div>

        <!-- 筛选 -->
        <div class="filter-bar">
          <button v-for="f in filters" :key="f"
            @click="activeFilter = f"
            :class="['filter-btn', { active: activeFilter === f }]">{{ f }}</button>
          <label class="fork-toggle">
            <input type="checkbox" v-model="showForks" />
            显示 Fork
          </label>
          <input v-model="search" class="search-input" placeholder="🔍 搜索项目..." />
        </div>

        <!-- 仓库列表 -->
        <div class="repos-grid">
          <a v-for="repo in filteredRepos" :key="repo.name"
            :href="repo.url" target="_blank" class="repo-card">
            <div class="repo-header">
              <span class="repo-icon">{{ repo.fork ? '🍴' : '📦' }}</span>
              <span class="repo-name">{{ repo.name }}</span>
              <span v-if="repo.fork" class="fork-badge">Fork</span>
            </div>
            <p class="repo-desc">{{ repo.desc }}</p>
            <div class="repo-topics" v-if="repo.topics?.length">
              <span v-for="t in repo.topics.slice(0,4)" :key="t" class="topic">{{ t }}</span>
            </div>
            <div class="repo-footer">
              <span class="repo-lang" v-if="repo.lang">
                <span class="lang-dot" :style="{ background: repo.langColor }"></span>
                {{ repo.lang }}
              </span>
              <span class="repo-stat" v-if="repo.stars > 0">⭐ {{ repo.stars }}</span>
              <span class="repo-stat" v-if="repo.forks > 0">🍴 {{ repo.forks }}</span>
              <span class="repo-updated">{{ repo.updated }}</span>
            </div>
          </a>
        </div>

        <div v-if="filteredRepos.length === 0" class="empty">没有找到匹配的项目</div>

        <div class="load-more">
          <a href="https://github.com/HXZg?tab=repositories" target="_blank" class="load-more-btn">
            查看全部 {{ user?.public_repos }} 个项目 →
          </a>
        </div>

        <!-- 贡献热力图 -->
        <div class="gh-contrib">
          <h3 class="contrib-title">📈 贡献热力图（模拟）</h3>
          <div class="contrib-grid">
            <div v-for="(cell, i) in contribCells" :key="i"
              class="contrib-cell" :style="{ background: cell.color }"
              :title="`${cell.date}: ${cell.count} 次提交`"></div>
          </div>
          <div class="contrib-legend">
            <span>少</span>
            <span v-for="c in legendColors" :key="c" class="legend-cell" :style="{ background: c }"></span>
            <span>多</span>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SectionTitle from './SectionTitle.vue'
import { useGithub } from '../composables/useGithub.js'

defineProps({ id: String })

const { user, repos, loading, error, load } = useGithub()
const activeFilter = ref('全部')
const search = ref('')
const showForks = ref(false)

onMounted(load)

const filters = computed(() => {
  const langs = [...new Set(repos.value.map(r => r.lang).filter(Boolean))]
  return ['全部', ...langs.slice(0, 5)]
})

const ghMeta = computed(() => [
  { icon: '📁', value: user.value?.public_repos ?? '—', label: '仓库' },
  { icon: '⭐', value: user.value?._totalStars ?? '—', label: 'Stars' },
  { icon: '👥', value: user.value?.followers ?? '—', label: '关注者' },
  { icon: '👣', value: user.value?.following ?? '—', label: '关注中' },
])

const filteredRepos = computed(() => {
  let list = showForks.value ? repos.value : repos.value.filter(r => !r.fork)
  if (activeFilter.value !== '全部') list = list.filter(r => r.lang === activeFilter.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(r => r.name.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q))
  }
  return list
})

const legendColors = ['#161b22', '#0d4429', '#006d32', '#26a641', '#39d353']
const contribCells = computed(() => {
  const colors = ['#161b22', '#0d4429', '#006d32', '#26a641', '#39d353']
  return Array.from({ length: 52 * 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (52 * 7 - i))
    const rand = Math.random()
    const level = rand < 0.55 ? 0 : rand < 0.7 ? 1 : rand < 0.85 ? 2 : rand < 0.95 ? 3 : 4
    return { color: colors[level], count: level === 0 ? 0 : Math.floor(Math.random() * 8) + level, date: d.toLocaleDateString('zh-CN') }
  })
})
</script>

<style scoped>
.section { padding: 5rem 1.5rem; }
.container { max-width: 1100px; margin: 0 auto; }

/* 骨架屏 */
.loading-wrap { display: flex; flex-direction: column; gap: 1.25rem; }
.skeleton-profile { height: 80px; border-radius: var(--radius); background: var(--bg-card); animation: shimmer 1.5s infinite; }
.skeleton-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
.skeleton-card { height: 140px; border-radius: var(--radius); background: var(--bg-card); animation: shimmer 1.5s infinite; }
@keyframes shimmer {
  0%, 100% { opacity: 0.5; } 50% { opacity: 1; }
}
.error-tip { color: var(--accent3); font-size: 0.9rem; padding: 1rem; background: rgba(247,129,102,0.1); border-radius: 8px; margin-bottom: 1rem; }

.gh-profile {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; transition: border-color 0.2s;
}
.gh-profile:hover { border-color: #388bfd; }
.gh-user { display: flex; align-items: center; gap: 1rem; }
.gh-avatar { width: 52px; height: 52px; border-radius: 50%; border: 2px solid var(--border); }
.gh-name { font-weight: 600; font-size: 1.05rem; }
.gh-bio { font-size: 0.85rem; color: var(--text-muted); }
.gh-meta { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.gh-meta-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.875rem; }
.gh-meta-icon { font-size: 1rem; }
.gh-meta-val { font-weight: 600; }
.gh-meta-label { color: var(--text-muted); }

.filter-bar { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; align-items: center; }
.filter-btn { padding: 0.35rem 0.9rem; border-radius: 20px; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-muted); cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
.filter-btn:hover, .filter-btn.active { background: var(--accent); color: #000; border-color: var(--accent); }
.fork-toggle { display: flex; align-items: center; gap: 0.35rem; font-size: 0.85rem; color: var(--text-muted); cursor: pointer; }
.fork-toggle input { accent-color: var(--accent); }
.search-input { margin-left: auto; padding: 0.35rem 0.9rem; border-radius: 20px; border: 1px solid var(--border); background: var(--bg-card); color: var(--text); font-size: 0.85rem; outline: none; width: 200px; }
.search-input:focus { border-color: var(--accent); }

.repos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
.repo-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; transition: all 0.2s; text-decoration: none; color: var(--text); }
.repo-card:hover { border-color: #388bfd; transform: translateY(-2px); box-shadow: 0 4px 20px rgba(88,166,255,0.1); text-decoration: none; }
.repo-header { display: flex; align-items: center; gap: 0.5rem; }
.repo-icon { font-size: 1rem; }
.repo-name { font-weight: 600; font-size: 0.95rem; color: var(--accent); flex: 1; }
.fork-badge { font-size: 0.7rem; background: rgba(88,166,255,0.1); color: var(--text-muted); padding: 0.1rem 0.4rem; border-radius: 4px; }
.repo-desc { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.repo-topics { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.topic { font-size: 0.75rem; padding: 0.15rem 0.55rem; border-radius: 20px; background: rgba(88,166,255,0.1); color: var(--accent); border: 1px solid rgba(88,166,255,0.2); }
.repo-footer { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; color: var(--text-muted); }
.repo-lang { display: flex; align-items: center; gap: 0.35rem; }
.lang-dot { width: 10px; height: 10px; border-radius: 50%; }
.repo-stat { display: flex; align-items: center; gap: 0.2rem; }
.repo-updated { margin-left: auto; font-size: 0.75rem; }

.empty { text-align: center; color: var(--text-muted); padding: 3rem; }
.load-more { text-align: center; margin-top: 2rem; }
.load-more-btn { display: inline-block; padding: 0.6rem 2rem; border: 1px solid var(--border); border-radius: 8px; color: var(--text-muted); font-size: 0.9rem; transition: all 0.2s; text-decoration: none; }
.load-more-btn:hover { border-color: var(--accent); color: var(--accent); text-decoration: none; }

.gh-contrib { margin-top: 2rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
.contrib-title { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem; }
.contrib-grid { display: grid; grid-template-columns: repeat(52, 1fr); grid-template-rows: repeat(7, 1fr); gap: 2px; overflow-x: auto; }
.contrib-cell { width: 100%; aspect-ratio: 1; border-radius: 2px; min-width: 10px; cursor: pointer; }
.contrib-cell:hover { opacity: 0.7; }
.contrib-legend { display: flex; align-items: center; gap: 4px; margin-top: 0.75rem; font-size: 0.75rem; color: var(--text-muted); justify-content: flex-end; }
.legend-cell { width: 12px; height: 12px; border-radius: 2px; }

@media (max-width: 768px) {
  .section { padding: 3rem 1rem; }
  .repos-grid { grid-template-columns: 1fr; }
  .gh-profile { flex-direction: column; align-items: flex-start; }
  .gh-meta { gap: 1rem; }
  .search-input { width: 100%; margin-left: 0; }
  .contrib-grid { grid-template-columns: repeat(26, 1fr); }
}
</style>
