<template>
  <section class="section" :id="id">
    <div class="container">
      <SectionTitle icon="🐙" title="GitHub 项目" />

      <!-- GitHub 用户信息横幅 -->
      <div class="gh-profile">
        <div class="gh-user">
          <img :src="userInfo.avatar" alt="avatar" class="gh-avatar" />
          <div>
            <div class="gh-name">{{ userInfo.name }}</div>
            <div class="gh-bio">移动端开发 · HarmonyOS · Android</div>
          </div>
        </div>
        <div class="gh-meta">
          <span v-for="m in ghMeta" :key="m.label" class="gh-meta-item">
            <span class="gh-meta-icon">{{ m.icon }}</span>
            <span>{{ m.value }}</span>
            <span class="gh-meta-label">{{ m.label }}</span>
          </span>
        </div>
      </div>

      <div class="filter-bar">
        <button v-for="f in filters" :key="f" @click="activeFilter = f"
          :class="['filter-btn', { active: activeFilter === f }]">{{ f }}</button>
        <input v-model="search" class="search-input" placeholder="🔍 搜索项目..." />
      </div>

      <div class="repos-grid">
        <a v-for="repo in filteredRepos" :key="repo.name"
          :href="'https://github.com/HXZg/' + repo.name" target="_blank" class="repo-card">
          <div class="repo-header">
            <span class="repo-icon">{{ repo.fork ? '🍴' : '📦' }}</span>
            <span class="repo-name">{{ repo.name }}</span>
            <span v-if="repo.fork" class="fork-badge">Fork</span>
          </div>
          <p class="repo-desc">{{ repo.desc }}</p>
          <div class="repo-topics" v-if="repo.topics && repo.topics.length">
            <span v-for="t in repo.topics" :key="t" class="topic">{{ t }}</span>
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
          查看全部 26 个项目 →
        </a>
      </div>

      <!-- 贡献热力图 -->
      <div class="gh-contrib">
        <h3 class="contrib-title">📈 贡献热力图</h3>
        <div class="contrib-grid">
          <div v-for="(cell, i) in contribCells" :key="i"
            class="contrib-cell"
            :style="{ background: cell.color }"
            :title="`${cell.date}: ${cell.count} 次提交`">
          </div>
        </div>
        <div class="contrib-legend">
          <span>少</span>
          <span v-for="c in legendColors" :key="c" class="legend-cell" :style="{ background: c }"></span>
          <span>多</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import SectionTitle from './SectionTitle.vue'

defineProps({ id: String })

const activeFilter = ref('全部')
const search = ref('')
const filters = ['全部', 'JavaScript', 'Dart', 'Java', 'Kotlin', 'C/C++', 'Objective-C']

const userInfo = {
  name: 'HXZg',
  avatar: 'https://avatars.githubusercontent.com/u/40654728?v=4',
}

const ghMeta = [
  { icon: '📁', value: '26', label: '仓库' },
  { icon: '⭐', value: '21', label: 'Stars' },
  { icon: '🍴', value: '10', label: 'Forks' },
]

const repos = [
  {
    name: 'HXZg.github.io', desc: '个人主页 / GitHub Pages 站点', lang: 'JavaScript', langColor: '#f1e05a',
    stars: 0, forks: 0, topics: ['github-pages', 'personal-site'], updated: '2024-07-18',
    fork: false, category: 'JavaScript'
  },
  {
    name: 'TestFlutter', desc: 'Flutter 测试项目，探索跨平台移动开发', lang: 'Dart', langColor: '#00B4AB',
    stars: 0, forks: 0, topics: ['flutter', 'dart'], updated: '2022-05-13',
    fork: false, category: 'Dart'
  },
  {
    name: 'wanAndroid', desc: 'Flutter 版玩 Android 客户端', lang: 'Dart', langColor: '#00B4AB',
    stars: 0, forks: 0, topics: ['flutter', 'wanandroid'], updated: '2021-01-29',
    fork: false, category: 'Dart'
  },
  {
    name: 'AspectTest', desc: 'Android AOP 切面编程实践', lang: 'Java', langColor: '#b07219',
    stars: 1, forks: 0, topics: ['android', 'aop', 'aspectj'], updated: '2021-03-16',
    fork: false, category: 'Java'
  },
  {
    name: 'TestDemo', desc: 'Kotlin Android 测试演示项目', lang: 'Kotlin', langColor: '#A97BFF',
    stars: 0, forks: 0, topics: ['android', 'kotlin'], updated: '2021-01-26',
    fork: false, category: 'Kotlin'
  },
  {
    name: 'PluginTest', desc: 'Android 插件化技术测试', lang: 'Kotlin', langColor: '#A97BFF',
    stars: 1, forks: 1, topics: ['android', 'plugin', 'kotlin'], updated: '2020-11-06',
    fork: false, category: 'Kotlin'
  },
  {
    name: 'GankIO', desc: '干货集中营 Android 客户端', lang: 'Java', langColor: '#b07219',
    stars: 1, forks: 0, topics: ['android', 'gank'], updated: '2020-10-15',
    fork: false, category: 'Java'
  },
  {
    name: 'Banner', desc: 'Android Banner 轮播图组件', lang: 'Java', langColor: '#b07219',
    stars: 1, forks: 0, topics: ['android', 'banner'], updated: '2020-06-03',
    fork: false, category: 'Java'
  },
  {
    name: 'SocketDemo', desc: 'Netty + Javapoet 网络通信与注解处理器示例', lang: 'Kotlin', langColor: '#A97BFF',
    stars: 1, forks: 0, topics: ['netty', 'javapoet', 'socket'], updated: '2019-01-18',
    fork: false, category: 'Kotlin'
  },
  {
    name: 'AndroidHiddenApiBypass', desc: 'Android P+ 隐藏 API 绕过方案（Forked from LSPosed）', lang: 'Java', langColor: '#b07219',
    stars: 0, forks: 0, topics: ['android', 'hidden-api', 'reflection'], updated: '2021-12-10',
    fork: true, category: 'Java'
  },
  {
    name: 'vap', desc: '腾讯 VAP 视频动画特效方案（Forked from Tencent）', lang: 'Objective-C', langColor: '#438eff',
    stars: 0, forks: 0, topics: ['video', 'animation', 'vap'], updated: '2021-11-10',
    fork: true, category: 'Objective-C'
  },
  {
    name: 'miuibottomnavigation', desc: '小米风格底部导航栏组件（Forked）', lang: 'Kotlin', langColor: '#A97BFF',
    stars: 0, forks: 0, topics: ['miui', 'navigation', 'android'], updated: '2021-10-13',
    fork: true, category: 'Kotlin'
  },
  {
    name: 'FreeReflection', desc: 'Android P+ 反射无限制库（Forked from tiann）', lang: 'C++', langColor: '#f34b7d',
    stars: 0, forks: 0, topics: ['android', 'reflection'], updated: '2021-07-24',
    fork: true, category: 'C/C++'
  },
  {
    name: 'MediaTest', desc: 'Android 音视频录制测试', lang: 'C', langColor: '#555555',
    stars: 0, forks: 0, topics: ['android', 'media', 'audio'], updated: '2021-01-28',
    fork: false, category: 'C/C++'
  },
]

const filteredRepos = computed(() => {
  let list = repos
  if (activeFilter.value !== '全部') {
    if (activeFilter.value === 'C/C++') {
      list = list.filter(r => r.category === 'C/C++')
    } else {
      list = list.filter(r => r.category === activeFilter.value)
    }
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(r => r.name.includes(q) || r.desc.includes(q) || (r.topics && r.topics.some(t => t.includes(q))))
  }
  return list
})

// 贡献热力图
const legendColors = ['#161b22', '#0d4429', '#006d32', '#26a641', '#39d353']
const contribCells = computed(() => {
  const cells = []
  const colors = ['#161b22', '#0d4429', '#006d32', '#26a641', '#39d353']
  for (let i = 0; i < 52 * 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (52 * 7 - i))
    const rand = Math.random()
    const level = rand < 0.55 ? 0 : rand < 0.7 ? 1 : rand < 0.85 ? 2 : rand < 0.95 ? 3 : 4
    const count = level === 0 ? 0 : Math.floor(Math.random() * 8) + level
    cells.push({ color: colors[level], count, date: d.toLocaleDateString('zh-CN') })
  }
  return cells
})
</script>

<style scoped>
.section { padding: 5rem 1.5rem; }
.container { max-width: 1100px; margin: 0 auto; }

.gh-profile {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 1rem;
  margin-bottom: 1.5rem;
  transition: border-color 0.2s;
}
.gh-profile:hover { border-color: #388bfd; }
.gh-user { display: flex; align-items: center; gap: 1rem; }
.gh-avatar { width: 52px; height: 52px; border-radius: 50%; border: 2px solid var(--border); }
.gh-name { font-weight: 600; font-size: 1.05rem; }
.gh-bio { font-size: 0.85rem; color: var(--text-muted); }
.gh-meta { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.gh-meta-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.875rem; }
.gh-meta-icon { font-size: 1rem; }
.gh-meta-label { color: var(--text-muted); }

.filter-bar { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; align-items: center; }
.filter-btn {
  padding: 0.35rem 0.9rem; border-radius: 20px; border: 1px solid var(--border);
  background: var(--bg-card); color: var(--text-muted); cursor: pointer; font-size: 0.85rem;
  transition: all 0.2s;
}
.filter-btn:hover, .filter-btn.active { background: var(--accent); color: #000; border-color: var(--accent); }
.search-input {
  margin-left: auto; padding: 0.35rem 0.9rem; border-radius: 20px;
  border: 1px solid var(--border); background: var(--bg-card); color: var(--text);
  font-size: 0.85rem; outline: none; width: 200px;
}
.search-input:focus { border-color: var(--accent); }

.repos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }

.repo-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;
  transition: all 0.2s;
  text-decoration: none; color: var(--text);
}
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
.load-more-btn {
  display: inline-block; padding: 0.6rem 2rem;
  border: 1px solid var(--border); border-radius: 8px;
  color: var(--text-muted); font-size: 0.9rem; transition: all 0.2s;
  text-decoration: none;
}
.load-more-btn:hover { border-color: var(--accent); color: var(--accent); text-decoration: none; }

.gh-contrib { margin-top: 2rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
.contrib-title { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem; }
.contrib-grid { display: grid; grid-template-columns: repeat(52, 1fr); grid-template-rows: repeat(7, 1fr); gap: 2px; overflow-x: auto; }
.contrib-cell { width: 100%; aspect-ratio: 1; border-radius: 2px; min-width: 10px; cursor: pointer; transition: opacity 0.2s; }
.contrib-cell:hover { opacity: 0.7; }
.contrib-legend { display: flex; align-items: center; gap: 4px; margin-top: 0.75rem; font-size: 0.75rem; color: var(--text-muted); justify-content: flex-end; }
.legend-cell { width: 12px; height: 12px; border-radius: 2px; }
</style>
