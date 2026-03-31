// 掘金数据 composable
// 数据来源：构建时由 scripts/fetch-juejin.js 预拉取，存为 public/juejin-data.json
// 开发时也读同一个文件（本地先跑 npm run fetch-juejin 生成）
import { ref } from 'vue'

const CACHE_TTL = 10 * 60 * 1000 // 10分钟

const tagColorMap = {
  'HarmonyOS': '#e040fb',
  '微信小程序': '#07c160',
  'Android': '#3fb950',
  'Flutter': '#00B4AB',
  '前端': '#1e80ff',
  '后端': '#ffa657',
}

function formatNum(n) {
  if (!n) return '0'
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

function getCache(key) {
  try {
    const item = localStorage.getItem(key)
    if (!item) return null
    const { data, ts } = JSON.parse(item)
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(key); return null }
    return data
  } catch { return null }
}
function setCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })) } catch {}
}

export function useJuejin() {
  const userInfo = ref(null)
  const articles = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function load() {
    loading.value = true
    error.value = null

    // 先读缓存
    const cached = getCache('jj_data')
    if (cached) {
      userInfo.value = cached.userInfo
      articles.value = cached.articles
      loading.value = false
      return
    }

    try {
      // 读取构建时预生成的静态 JSON
      const res = await fetch('./juejin-data.json?t=' + Date.now())
      if (!res.ok) throw new Error(`加载失败 (${res.status})`)
      const data = await res.json()

      const u = data.userInfo || {}
      userInfo.value = {
        ...u,
        totalViews: formatNum(u.totalViews),
        totalLikes: u.totalLikes,
      }

      articles.value = (data.articles || []).map(a => ({
        ...a,
        views: formatNum(a.views),
        tagColor: tagColorMap[a.tag] || '#1e80ff',
        url: `https://juejin.cn/post/${a.id}`,
      }))

      setCache('jj_data', { userInfo: userInfo.value, articles: articles.value })
    } catch (e) {
      error.value = e.message
      console.error('[Juejin]', e)
    } finally {
      loading.value = false
    }
  }

  return { userInfo, articles, loading, error, load }
}
