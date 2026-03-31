// GitHub API composable，带静态 fallback 兜底
import { ref } from 'vue'

const GITHUB_USER = 'HXZg'
const CACHE_TTL = 5 * 60 * 1000

// 静态兜底数据（网络失败时使用）
const FALLBACK_USER = {
  login: 'HXZg',
  avatar_url: 'https://avatars.githubusercontent.com/u/40654728?v=4',
  bio: '移动端开发 · HarmonyOS · Android · Flutter',
  public_repos: 27,
  followers: 0,
  following: 0,
  _totalStars: 7,
  _isFallback: true,
}

const FALLBACK_REPOS = [
  { name: 'HXZg.github.io', desc: '个人主页 / GitHub Pages 站点', lang: 'JavaScript', langColor: '#f1e05a', stars: 0, forks: 0, topics: ['github-pages'], updated: '2024-07-18', fork: false },
  { name: 'TestFlutter', desc: 'Flutter 测试项目，探索跨平台移动开发', lang: 'Dart', langColor: '#00B4AB', stars: 0, forks: 0, topics: ['flutter'], updated: '2022-05-13', fork: false },
  { name: 'wanAndroid', desc: 'Flutter 版玩 Android 客户端', lang: 'Dart', langColor: '#00B4AB', stars: 0, forks: 0, topics: ['flutter', 'wanandroid'], updated: '2021-01-29', fork: false },
  { name: 'AspectTest', desc: 'Android AOP 切面编程实践', lang: 'Java', langColor: '#b07219', stars: 1, forks: 0, topics: ['android', 'aop'], updated: '2021-03-16', fork: false },
  { name: 'PluginTest', desc: 'Android 插件化技术测试', lang: 'Kotlin', langColor: '#A97BFF', stars: 1, forks: 1, topics: ['android', 'plugin'], updated: '2020-11-06', fork: false },
  { name: 'GankIO', desc: '干货集中营 Android 客户端', lang: 'Java', langColor: '#b07219', stars: 1, forks: 0, topics: ['android'], updated: '2020-10-15', fork: false },
]

const langColors = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Vue: '#42b883',
  Dart: '#00B4AB', Java: '#b07219', Kotlin: '#A97BFF',
  'C++': '#f34b7d', C: '#555555', 'Objective-C': '#438eff',
  Python: '#3572A5', Go: '#00ADD8',
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

export function useGithub() {
  const user = ref(null)
  const repos = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchWithTimeout(url, timeout = 8000) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(timer)
      return res
    } catch (e) {
      clearTimeout(timer)
      throw e
    }
  }

  async function load() {
    loading.value = true
    error.value = null

    // 先读缓存
    const cachedUser = getCache(`gh_user_${GITHUB_USER}`)
    const cachedRepos = getCache(`gh_repos_${GITHUB_USER}`)
    if (cachedUser && cachedRepos) {
      user.value = cachedUser
      repos.value = cachedRepos
      loading.value = false
      return
    }

    try {
      const [userRes, reposRes] = await Promise.all([
        fetchWithTimeout(`https://api.github.com/users/${GITHUB_USER}`),
        fetchWithTimeout(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`),
      ])

      if (!userRes.ok || !reposRes.ok) throw new Error(`GitHub API ${userRes.status}`)

      const [userData, reposData] = await Promise.all([userRes.json(), reposRes.json()])

      const totalStars = reposData.reduce((s, r) => s + r.stargazers_count, 0)
      userData._totalStars = totalStars

      const mappedRepos = reposData
        .filter(r => !r.fork)
        .map(r => ({
          name: r.name,
          desc: r.description || '暂无描述',
          lang: r.language || '',
          langColor: langColors[r.language] || '#8b949e',
          stars: r.stargazers_count,
          forks: r.forks_count,
          topics: r.topics || [],
          updated: r.updated_at?.substring(0, 10) || '',
          fork: r.fork,
          url: r.html_url,
        }))
        .sort((a, b) => b.stars - a.stars || new Date(b.updated) - new Date(a.updated))

      user.value = userData
      repos.value = mappedRepos

      setCache(`gh_user_${GITHUB_USER}`, userData)
      setCache(`gh_repos_${GITHUB_USER}`, mappedRepos)

    } catch (e) {
      // 网络失败 → 使用 fallback 数据
      console.warn('[GitHub] API 失败，使用兜底数据:', e.message)
      error.value = 'GitHub 数据加载失败，显示缓存数据'
      user.value = FALLBACK_USER
      repos.value = FALLBACK_REPOS
    } finally {
      loading.value = false
    }
  }

  return { user, repos, loading, error, load, langColors }
}
