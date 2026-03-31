// 掘金 API composable（直接调用，无需代理）
import { ref } from 'vue'

const JUEJIN_USER_ID = '1099167359577294'
const CACHE_TTL = 5 * 60 * 1000

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

const tagColorMap = {
  'HarmonyOS': '#e040fb',
  '微信小程序': '#07c160',
  'Android': '#3fb950',
  'Flutter': '#00B4AB',
  '前端': '#1e80ff',
  '后端': '#ffa657',
}

function formatNum(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

function formatDate(ts) {
  const d = new Date(Number(ts) * 1000)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function useJuejin() {
  const userInfo = ref(null)
  const articles = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchArticles() {
    const cached = getCache(`jj_articles_${JUEJIN_USER_ID}`)
    if (cached) return cached

    const res = await fetch('https://api.juejin.cn/content_api/v1/article/query_list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: JUEJIN_USER_ID,
        sort_type: 2,
        cursor: '{"v":"1","i":0,"p":1,"m":false}',
        limit: 20,
      }),
    })
    if (!res.ok) throw new Error('掘金 API 请求失败')
    const data = await res.json()
    if (data.err_no !== 0) throw new Error(data.err_msg)
    setCache(`jj_articles_${JUEJIN_USER_ID}`, data)
    return data
  }

  async function load() {
    loading.value = true
    error.value = null
    try {
      const data = await fetchArticles()
      const list = data.data || []

      if (list.length > 0) {
        // 从第一篇文章的 author_user_info 提取用户信息
        const u = list[0].author_user_info
        const growth = u.user_growth_info
        // 解析 vip_title（掘金等级名称）
        let levelTitle = 'Lv.' + (u.level || 2)
        try {
          const m = growth.match(/vip_title=([^;]+)/)
          if (m) levelTitle = m[1].trim()
        } catch {}

        userInfo.value = {
          name: u.user_name,
          avatar: u.avatar_large,
          level: u.level,
          levelTitle,
          power: u.power,
          followers: u.follower_count,
          following: u.followee_count,
          totalViews: formatNum(u.got_view_count),
          totalLikes: u.got_digg_count,
          articleCount: u.post_article_count,
        }
      }

      articles.value = list.map(item => {
        const info = item.article_info
        const tagName = item.tags?.[0]?.tag_name || item.category?.category_name || '技术'
        return {
          id: info.article_id,
          title: info.title,
          summary: info.brief_content,
          tag: tagName,
          tagColor: tagColorMap[tagName] || '#1e80ff',
          date: formatDate(info.ctime),
          views: formatNum(info.view_count),
          likes: info.digg_count,
          comments: info.comment_count,
          collects: info.collect_count,
          readTime: info.read_time || '',
          hot: info.hot_index > 50,
          category: item.category?.category_name || '',
          url: `https://juejin.cn/post/${info.article_id}`,
        }
      })
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { userInfo, articles, loading, error, load }
}
