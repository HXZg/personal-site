<template>
  <div class="app">
    <nav class="navbar" :class="{ scrolled: scrolled }">
      <div class="nav-inner">
        <div class="nav-logo-wrap">
          <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=HXZg&backgroundColor=0a0a2e" class="nav-avatar" alt="logo" />
          <span class="nav-logo">HXZg</span>
        </div>
        <!-- 桌面导航 -->
        <ul class="nav-links desktop-nav">
          <li v-for="item in navItems" :key="item.id">
            <a :href="'#' + item.id" @click.prevent="scrollTo(item.id)" :class="{ active: activeSection === item.id }">
              {{ item.label }}
            </a>
          </li>
        </ul>
        <!-- 汉堡按钮（移动端） -->
        <button class="hamburger" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }" aria-label="菜单">
          <span></span><span></span><span></span>
        </button>
      </div>
      <!-- 移动端下拉菜单 -->
      <Transition name="menu">
        <div v-if="menuOpen" class="mobile-menu">
          <a v-for="item in navItems" :key="item.id"
            :href="'#' + item.id"
            @click.prevent="scrollTo(item.id); menuOpen = false"
            :class="{ active: activeSection === item.id }">
            <span class="menu-icon">{{ item.icon }}</span>{{ item.label }}
          </a>
        </div>
      </Transition>
    </nav>

    <main>
      <HeroSection id="hero" v-reveal />
      <DateTimeSection id="datetime" v-reveal />
      <GithubSection id="github" v-reveal />
      <JuejinSection id="juejin" v-reveal />
      <ToolsSection id="tools" v-reveal />
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
const menuOpen = ref(false)

const navItems = [
  { id: 'hero',     label: '关于我',   icon: '👤' },
  { id: 'datetime', label: '日期时间', icon: '🗓️' },
  { id: 'github',   label: 'GitHub',  icon: '🐙' },
  { id: 'juejin',   label: '掘金',    icon: '📝' },
  { id: 'tools',    label: '小工具',  icon: '🛠️' },
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

// 点击外部关闭菜单
function onClickOutside(e) {
  if (menuOpen.value && !e.target.closest('.navbar')) menuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  document.addEventListener('click', onClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
.app { min-height: 100vh; }

.navbar {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 0 1.5rem;
  transition: all 0.3s;
  border-bottom: 1px solid transparent;
}
.navbar.scrolled {
  background: rgba(13, 17, 23, 0.95);
  backdrop-filter: blur(12px);
  border-color: var(--border);
}
.nav-inner {
  max-width: 1100px; margin: 0 auto;
  height: 60px;
  display: flex; align-items: center; justify-content: space-between;
}
.nav-logo-wrap { display: flex; align-items: center; gap: 0.5rem; }
.nav-avatar { width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid var(--border); }
.nav-logo { font-size: 1.1rem; font-weight: 700; color: var(--accent); cursor: default; }

.desktop-nav { list-style: none; display: flex; gap: 0.25rem; }
.desktop-nav a {
  padding: 0.4rem 0.9rem; border-radius: 6px;
  font-size: 0.9rem; color: var(--text-muted);
  transition: all 0.2s; text-decoration: none;
}
.desktop-nav a:hover, .desktop-nav a.active { color: var(--text); background: var(--bg-card2); }
.desktop-nav a.active { color: var(--accent); }

/* 汉堡按钮 */
.hamburger {
  display: none;
  flex-direction: column; justify-content: center; align-items: center;
  gap: 5px; width: 36px; height: 36px;
  background: none; border: none; cursor: pointer; padding: 4px;
}
.hamburger span {
  display: block; width: 22px; height: 2px;
  background: var(--text-muted); border-radius: 2px;
  transition: all 0.3s;
  transform-origin: center;
}
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* 移动端菜单 */
.mobile-menu {
  display: flex; flex-direction: column;
  background: rgba(13, 17, 23, 0.98);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--border);
  padding: 0.5rem 0;
}
.mobile-menu a {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.85rem 1.5rem;
  color: var(--text-muted); text-decoration: none;
  font-size: 0.95rem; transition: all 0.2s;
  border-left: 3px solid transparent;
}
.mobile-menu a:hover, .mobile-menu a.active {
  color: var(--text); background: var(--bg-card2);
}
.mobile-menu a.active { color: var(--accent); border-left-color: var(--accent); }
.menu-icon { font-size: 1.1rem; width: 1.5rem; text-align: center; }

/* 菜单动画 */
.menu-enter-active, .menu-leave-active { transition: all 0.25s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-8px); }

main { padding-top: 60px; }

.footer {
  text-align: center; padding: 2rem;
  color: var(--text-muted); font-size: 0.85rem;
  border-top: 1px solid var(--border); margin-top: 4rem;
}

@media (max-width: 768px) {
  .desktop-nav { display: none; }
  .hamburger { display: flex; }
}
</style>
