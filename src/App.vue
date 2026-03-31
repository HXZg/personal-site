<template>
  <div class="app">
    <!-- 顶部导航 -->
    <nav class="navbar" :class="{ scrolled: scrolled }">
      <div class="nav-inner">
        <div class="nav-logo-wrap">
            <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=HXZg&backgroundColor=0a0a2e" class="nav-avatar" alt="logo" />
            <span class="nav-logo">HXZg</span>
          </div>
        <ul class="nav-links">
          <li v-for="item in navItems" :key="item.id">
            <a :href="'#' + item.id" @click.prevent="scrollTo(item.id)" :class="{ active: activeSection === item.id }">
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <main>
      <HeroSection id="hero" />
      <DateTimeSection id="datetime" />
      <GithubSection id="github" />
      <JuejinSection id="juejin" />
      <ToolsSection id="tools" />
    </main>

    <footer class="footer">
      <p>Built with ❤️ using Vue 3 + Vite · {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSection from './components/HeroSection.vue'
import DateTimeSection from './components/DateTimeSection.vue'
import GithubSection from './components/GithubSection.vue'
import JuejinSection from './components/JuejinSection.vue'
import ToolsSection from './components/ToolsSection.vue'

const scrolled = ref(false)
const activeSection = ref('hero')

const navItems = [
  { id: 'hero', label: '关于我' },
  { id: 'datetime', label: '日期时间' },
  { id: 'github', label: 'GitHub' },
  { id: 'juejin', label: '掘金文章' },
  { id: 'tools', label: '小工具' },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function onScroll() {
  scrolled.value = window.scrollY > 20
  const sections = navItems.map(i => i.id)
  for (let i = sections.length - 1; i >= 0; i--) {
    const el = document.getElementById(sections[i])
    if (el && window.scrollY >= el.offsetTop - 100) {
      activeSection.value = sections[i]
      break
    }
  }
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.app { min-height: 100vh; }

.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 0 2rem;
  transition: all 0.3s;
  border-bottom: 1px solid transparent;
}
.navbar.scrolled {
  background: rgba(13, 17, 23, 0.92);
  backdrop-filter: blur(12px);
  border-color: var(--border);
}
.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-logo-wrap {
  display: flex; align-items: center; gap: 0.5rem;
}
.nav-avatar {
  width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid var(--border);
}
.nav-logo {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent);
  cursor: default;
}
.nav-links {
  list-style: none;
  display: flex;
  gap: 0.25rem;
}
.nav-links a {
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  font-size: 0.9rem;
  color: var(--text-muted);
  transition: all 0.2s;
  text-decoration: none;
}
.nav-links a:hover, .nav-links a.active {
  color: var(--text);
  background: var(--bg-card2);
}
.nav-links a.active { color: var(--accent); }

main { padding-top: 60px; }

.footer {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  border-top: 1px solid var(--border);
  margin-top: 4rem;
}
</style>
