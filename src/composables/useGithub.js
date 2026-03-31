// GitHub API composable
import { ref } from 'vue'

const GITHUB_USER = 'HXZg'
const CACHE_TTL = 5 * 60 * 1000 // 5分钟缓存

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

  const langColors = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Vue: '#42b883',
    Dart: '#00B4AB', Java: '#b07219', Kotlin: '#A97BFF',
    'C++': '#f34b7d', C: '#555555', 'Objective-C': '#438eff',
    Python: '#3572A5', Go: '#00ADD8', Swift: '#F05138',
  }

  async function fetchUser() {
    const cached = getCache(`gh_user_${GITHUB_USER}`)
    if (cached) return cached
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`)
    if (!res.ok) throw new Error('GitHub API 请求失败')
    const data = await res.json()
    setCache(`gh_user_${GITHUB_USER}`, data)
    return data
  }

  async function fetchRepos() {
    const cached = getCache(`gh_repos_${GITHUB_USER}`)
    if (cached) return cached
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
    if (!res.ok) throw new Error('GitHub Repos API 请求失败')
    const data = await res.json()
    setCache(`gh_repos_${GITHUB_USER}`, data)
    return data
  }

  async function load() {
    loading.value = true
    error.value = null
    try {
      const [userData, reposData] = await Promise.all([fetchUser(), fetchRepos()])
      user.value = userData

      // 计算总 stars
      const totalStars = reposData.reduce((s, r) => s + r.stargazers_count, 0)
      user.value._totalStars = totalStars

      repos.value = reposData
        .filter(r => !r.fork) // 默认只显示自己的仓库
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
          homepage: r.homepage,
        }))
        .sort((a, b) => b.stars - a.stars || new Date(b.updated) - new Date(a.updated))
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { user, repos, loading, error, load, langColors }
}
