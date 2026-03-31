<template>
  <section class="hero section">
    <div class="container">
      <div class="hero-left">
        <div class="avatar-wrap">
          <div class="avatar">
            <img :src="userInfo.avatarUrl" alt="avatar" class="avatar-img" />
          </div>
          <span class="status-dot" title="在线"></span>
        </div>
        <div class="hero-info">
          <h1 class="name">{{ userInfo.name }} <span class="badge">{{ userInfo.title }}</span></h1>
          <p class="tagline">{{ tagline }}</p>
          <div class="tags">
            <span v-for="tag in tags" :key="tag.text" class="tag" :style="{ '--c': tag.color }">{{ tag.text }}</span>
          </div>
          <div class="links">
            <a href="https://github.com/HXZg" target="_blank" class="link-btn github">
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              GitHub
            </a>
            <a href="https://juejin.cn/user/1099167359577294" target="_blank" class="link-btn juejin">
              <span>📝</span> 掘金
            </a>
          </div>
        </div>
      </div>

      <div class="hero-right">
        <div class="stats-grid">
          <div v-for="s in stats" :key="s.label" class="stat-card">
            <span class="stat-icon">{{ s.icon }}</span>
            <span class="stat-num">{{ s.value }}</span>
            <span class="stat-label">{{ s.label }}</span>
          </div>
        </div>
        <div class="skills-block">
          <h3>技术栈</h3>
          <div class="skill-bars">
            <div v-for="sk in skills" :key="sk.name" class="skill-row">
              <span class="skill-name">{{ sk.name }}</span>
              <div class="skill-bar">
                <div class="skill-fill" :style="{ width: sk.level + '%', background: sk.color }"></div>
              </div>
              <span class="skill-pct">{{ sk.level }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const userInfo = {
  name: 'HXZg',
  title: '移动端开发者',
  avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HXZg&backgroundColor=0a0a2e',
}

const tagline = ref('')
const taglines = [
  'HarmonyOS 应用开发 · 从入门到实战 🚀',
  '记录学习与成长，每一行代码都是进步 💪',
  'Flutter / Android / 鸿蒙 技术分享 💡',
]
let tIdx = 0, cIdx = 0, deleting = false

function typewriter() {
  const target = taglines[tIdx]
  if (!deleting) {
    tagline.value = target.slice(0, ++cIdx)
    if (cIdx === target.length) { deleting = true; setTimeout(typewriter, 2500); return }
  } else {
    tagline.value = target.slice(0, --cIdx)
    if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % taglines.length }
  }
  setTimeout(typewriter, deleting ? 40 : 80)
}

onMounted(() => setTimeout(typewriter, 500))

const tags = [
  { text: 'HarmonyOS', color: '#e040fb' },
  { text: 'ArkTS', color: '#e040fb' },
  { text: 'Flutter', color: '#00B4AB' },
  { text: 'Android', color: '#3fb950' },
  { text: 'Kotlin', color: '#A97BFF' },
  { text: 'Java', color: '#f1e05a' },
]

const stats = [
  { icon: '📦', value: '26', label: '仓库' },
  { icon: '⭐', value: '21', label: 'Stars' },
  { icon: '📝', value: '6', label: '文章' },
  { icon: '👁️', value: '2.8k', label: '阅读' },
]

// 根据 GitHub 项目语言分布 + 掘金文章标签综合评估
const skills = [
  { name: 'HarmonyOS / ArkTS', level: 85, color: '#e040fb' },
  { name: 'Android / Java', level: 80, color: '#3fb950' },
  { name: 'Flutter / Dart', level: 75, color: '#00B4AB' },
  { name: 'Kotlin', level: 72, color: '#A97BFF' },
  { name: 'JavaScript', level: 60, color: '#f1e05a' },
  { name: 'C / C++ / ObjC', level: 55, color: '#3178c6' },
]
</script>

<style scoped>
.section { padding: 5rem 1.5rem; }
.container {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}
@media (max-width: 768px) {
  .section { padding: 3rem 1rem; }
  .container { grid-template-columns: 1fr; gap: 2rem; }
  .name { font-size: 1.6rem; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .skill-row { grid-template-columns: 90px 1fr 32px; }
}

.hero-left { display: flex; flex-direction: column; gap: 1.5rem; }

.avatar-wrap { position: relative; width: fit-content; }
.avatar {
  width: 100px; height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1f6feb, #388bfd);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  border: 3px solid var(--border);
  box-shadow: 0 0 0 4px rgba(88,166,255,0.12), 0 8px 32px rgba(88,166,255,0.2);
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }

.status-dot {
  position: absolute; bottom: 6px; right: 6px;
  width: 14px; height: 14px;
  background: #3fb950;
  border-radius: 50%;
  border: 2.5px solid var(--bg);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(63,185,80,0.4); }
  50% { box-shadow: 0 0 0 6px rgba(63,185,80,0); }
}

.name {
  font-size: 2.2rem;
  font-weight: 800;
  display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
  letter-spacing: -0.5px;
}
.badge {
  font-size: 0.78rem;
  background: linear-gradient(135deg, rgba(224,64,251,0.15), rgba(163,94,251,0.15));
  color: #e040fb;
  border: 1px solid rgba(224,64,251,0.3);
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  font-weight: 600;
}

.tagline {
  color: var(--text-muted);
  font-size: 1rem;
  min-height: 1.5em;
}
.tagline::after { content: '|'; animation: blink 1s infinite; margin-left: 2px; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

.tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tag {
  font-size: 0.8rem;
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  color: var(--c, var(--text-muted));
  transition: all 0.2s;
}
.tag:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }

.links { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.link-btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid var(--border);
  color: var(--text);
  background: var(--bg-card);
}
.link-btn:hover { background: var(--bg-card2); transform: translateY(-2px); text-decoration: none; }
.link-btn.github:hover { border-color: #e6edf3; color: #e6edf3; }
.link-btn.juejin:hover { border-color: #1e80ff; color: #1e80ff; }

.stats-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1rem; margin-bottom: 1.5rem;
}
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem 0.75rem;
  text-align: center;
  display: flex; flex-direction: column; gap: 0.25rem;
  transition: all 0.2s;
}
.stat-card:hover { border-color: var(--accent); transform: translateY(-2px); }
.stat-icon { font-size: 1.3rem; }
.stat-num { font-size: 1.3rem; font-weight: 700; color: var(--accent); }
.stat-label { font-size: 0.75rem; color: var(--text-muted); }

.skills-block {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
}
.skills-block h3 { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem; text-transform: uppercase; letter-spacing: 0.08em; }
.skill-bars { display: flex; flex-direction: column; gap: 0.85rem; }
.skill-row { display: grid; grid-template-columns: 115px 1fr 36px; align-items: center; gap: 0.75rem; }
.skill-name { font-size: 0.85rem; color: var(--text-muted); }
.skill-bar { height: 7px; background: var(--bg-card2); border-radius: 3px; overflow: hidden; }
.skill-fill { height: 100%; border-radius: 3px; transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1); }
.skill-pct { font-size: 0.75rem; color: var(--text-muted); text-align: right; }
</style>
