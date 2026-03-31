<template>
  <section class="section" :id="id">
    <div class="container">
      <SectionTitle icon="🗓️" title="日期 · 时间 · 节日" />

      <div class="dt-grid">
        <!-- 时钟卡片 -->
        <div class="card clock-card">
          <div class="clock-display">
            <span class="time-hm">{{ timeHM }}</span>
            <span class="time-s">:{{ timeS }}</span>
          </div>
          <div class="date-display">{{ dateStr }}</div>
          <div class="week-display">{{ weekStr }} · 第 {{ weekNum }} 周</div>
          <div class="lunar-display">{{ lunarStr }}</div>
        </div>

        <!-- 节日倒计时 -->
        <div class="card festivals-card">
          <h3 class="card-title">🎉 节日倒计时</h3>
          <div class="festival-list">
            <div v-for="f in upcomingFestivals" :key="f.name" class="festival-item">
              <span class="f-icon">{{ f.icon }}</span>
              <div class="f-info">
                <span class="f-name">{{ f.name }}</span>
                <span class="f-date">{{ f.date }}</span>
              </div>
              <div class="f-countdown" :class="f.days <= 7 ? 'soon' : ''">
                <span class="f-days">{{ f.days }}</span>
                <span class="f-unit">天后</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 年度进度 -->
        <div class="card progress-card">
          <h3 class="card-title">📊 年度进度</h3>
          <div class="progress-items">
            <div v-for="p in progressItems" :key="p.label" class="progress-item">
              <div class="p-header">
                <span>{{ p.label }}</span>
                <span class="p-pct">{{ p.pct }}%</span>
              </div>
              <div class="p-bar">
                <div class="p-fill" :style="{ width: p.pct + '%', background: p.color }"></div>
              </div>
              <div class="p-sub">{{ p.sub }}</div>
            </div>
          </div>
        </div>

        <!-- 今日信息 -->
        <div class="card today-card">
          <h3 class="card-title">☀️ 今日信息</h3>
          <div class="today-list">
            <div v-for="item in todayInfo" :key="item.label" class="today-item">
              <span class="t-icon">{{ item.icon }}</span>
              <span class="t-label">{{ item.label }}</span>
              <span class="t-value">{{ item.value }}</span>
            </div>
          </div>
          <div class="quote-block">
            <p class="quote-text">"{{ quote.text }}"</p>
            <p class="quote-author">— {{ quote.author }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SectionTitle from './SectionTitle.vue'

defineProps({ id: String })

const now = ref(new Date())
let timer

onMounted(() => { timer = setInterval(() => { now.value = new Date() }, 1000) })
onUnmounted(() => clearInterval(timer))

const pad = n => String(n).padStart(2, '0')

const timeHM = computed(() => `${pad(now.value.getHours())}:${pad(now.value.getMinutes())}`)
const timeS = computed(() => pad(now.value.getSeconds()))

const weekDays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
const dateStr = computed(() => {
  const d = now.value
  return `${d.getFullYear()} 年 ${d.getMonth()+1} 月 ${d.getDate()} 日`
})
const weekStr = computed(() => weekDays[now.value.getDay()])
const weekNum = computed(() => {
  const d = now.value
  const start = new Date(d.getFullYear(), 0, 1)
  return Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7)
})

// 简易农历（近似）
const lunarMonths = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月']
const lunarDays = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十']
const lunarStr = computed(() => {
  // 简单近似：以2024-01-01为农历十一月廿一基准
  const base = new Date(2024, 0, 1)
  const diff = Math.floor((now.value - base) / 86400000)
  const lunarDay = (20 + diff) % 30
  const lunarMonth = Math.floor((diff + 20) / 30) % 12
  return `农历 ${lunarMonths[lunarMonth]}${lunarDays[lunarDay]}`
})

// 节日数据
function daysUntil(month, day) {
  const d = now.value
  let target = new Date(d.getFullYear(), month - 1, day)
  if (target < d) target.setFullYear(d.getFullYear() + 1)
  return Math.ceil((target - d) / 86400000)
}

const upcomingFestivals = computed(() => {
  const all = [
    { name: '元旦', icon: '🎆', month: 1, day: 1 },
    { name: '春节', icon: '🧧', month: 1, day: 29 },
    { name: '情人节', icon: '💝', month: 2, day: 14 },
    { name: '妇女节', icon: '🌸', month: 3, day: 8 },
    { name: '劳动节', icon: '🔨', month: 5, day: 1 },
    { name: '儿童节', icon: '🎈', month: 6, day: 1 },
    { name: '中秋节', icon: '🥮', month: 9, day: 29 },
    { name: '国庆节', icon: '🇨🇳', month: 10, day: 1 },
    { name: '圣诞节', icon: '🎄', month: 12, day: 25 },
  ]
  return all
    .map(f => ({ ...f, days: daysUntil(f.month, f.day), date: `${f.month}月${f.day}日` }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 5)
})

// 年度进度
const progressItems = computed(() => {
  const d = now.value
  const y = d.getFullYear()
  const yearStart = new Date(y, 0, 1)
  const yearEnd = new Date(y + 1, 0, 1)
  const yearPct = Math.round((d - yearStart) / (yearEnd - yearStart) * 100)

  const monthStart = new Date(y, d.getMonth(), 1)
  const monthEnd = new Date(y, d.getMonth() + 1, 1)
  const monthPct = Math.round((d - monthStart) / (monthEnd - monthStart) * 100)

  const weekStart = new Date(d)
  weekStart.setDate(d.getDate() - d.getDay())
  const weekPct = Math.round((d.getDay() / 7) * 100)

  const dayPct = Math.round((d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()) / 86400 * 100)

  return [
    { label: `${y} 年进度`, pct: yearPct, color: '#58a6ff', sub: `已过 ${Math.floor((d - yearStart)/86400000)} 天` },
    { label: `本月进度`, pct: monthPct, color: '#3fb950', sub: `${d.getMonth()+1}月第 ${d.getDate()} 天` },
    { label: `本周进度`, pct: weekPct, color: '#d2a8ff', sub: weekDays[d.getDay()] },
    { label: `今日进度`, pct: dayPct, color: '#ffa657', sub: `${pad(d.getHours())}:${pad(d.getMinutes())} / 24:00` },
  ]
})

// 今日信息
const todayInfo = computed(() => {
  const d = now.value
  const y = d.getFullYear()
  const start = new Date(y, 0, 1)
  const dayOfYear = Math.floor((d - start) / 86400000) + 1
  const daysInYear = (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 366 : 365
  const zodiac = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'][(y - 2020 + 4) % 12]
  const season = ['冬季','冬季','春季','春季','春季','夏季','夏季','夏季','秋季','秋季','秋季','冬季'][d.getMonth()]
  return [
    { icon: '📅', label: '今年第', value: `${dayOfYear} 天` },
    { icon: '📆', label: '全年剩余', value: `${daysInYear - dayOfYear} 天` },
    { icon: '🐉', label: '生肖', value: zodiac + '年' },
    { icon: '🌿', label: '当前季节', value: season },
    { icon: '🌅', label: '日出', value: '06:12' },
    { icon: '🌇', label: '日落', value: '18:45' },
  ]
})

const quotes = [
  { text: '代码是诗，逻辑是韵律', author: '程序员的浪漫' },
  { text: '每一个 bug 都是一次成长的机会', author: '乐观主义者' },
  { text: '先让它跑起来，再让它跑得好', author: '工程哲学' },
  { text: '简单是可靠性的前提', author: 'Edsger Dijkstra' },
]
const quote = quotes[new Date().getDate() % quotes.length]
</script>

<style scoped>
.section { padding: 5rem 1.5rem; }
.container { max-width: 1100px; margin: 0 auto; }

.dt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
@media (max-width: 768px) { .dt-grid { grid-template-columns: 1fr; } }

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  transition: border-color 0.2s;
}
.card:hover { border-color: #388bfd; }
.card-title { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem; font-weight: 600; }

/* 时钟 */
.clock-card { text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; }
.clock-display { display: flex; align-items: baseline; }
.time-hm { font-size: 3.5rem; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--accent); line-height: 1; }
.time-s { font-size: 2rem; font-weight: 400; color: var(--text-muted); }
.date-display { font-size: 1.1rem; font-weight: 500; }
.week-display { font-size: 0.9rem; color: var(--text-muted); }
.lunar-display { font-size: 0.85rem; color: var(--accent4); background: rgba(210,168,255,0.1); padding: 0.25rem 0.75rem; border-radius: 20px; }

/* 节日 */
.festival-list { display: flex; flex-direction: column; gap: 0.75rem; }
.festival-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 8px; background: var(--bg-card2); }
.f-icon { font-size: 1.3rem; }
.f-info { flex: 1; display: flex; flex-direction: column; }
.f-name { font-size: 0.9rem; font-weight: 500; }
.f-date { font-size: 0.75rem; color: var(--text-muted); }
.f-countdown { text-align: right; }
.f-days { font-size: 1.2rem; font-weight: 700; color: var(--accent); }
.f-unit { font-size: 0.75rem; color: var(--text-muted); margin-left: 2px; }
.f-countdown.soon .f-days { color: var(--accent3); }

/* 进度 */
.progress-items { display: flex; flex-direction: column; gap: 1rem; }
.p-header { display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.4rem; }
.p-pct { font-weight: 600; }
.p-bar { height: 8px; background: var(--bg-card2); border-radius: 4px; overflow: hidden; }
.p-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }
.p-sub { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; }

/* 今日 */
.today-list { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 1rem; }
.today-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.6rem; background: var(--bg-card2); border-radius: 8px; }
.t-icon { font-size: 1rem; }
.t-label { font-size: 0.78rem; color: var(--text-muted); flex: 1; }
.t-value { font-size: 0.82rem; font-weight: 600; color: var(--accent); }
.quote-block { border-top: 1px solid var(--border); padding-top: 1rem; }
.quote-text { font-size: 0.9rem; color: var(--text-muted); font-style: italic; line-height: 1.6; }
.quote-author { font-size: 0.78rem; color: var(--text-muted); margin-top: 0.4rem; text-align: right; }
</style>
