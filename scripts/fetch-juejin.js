// 构建时预拉取掘金数据，生成静态 JSON 文件
// 在 GitHub Actions 构建时执行，数据直接打包进 dist

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const JUEJIN_USER_ID = '1099167359577294'
const OUTPUT_PATH = path.join(__dirname, '../public/juejin-data.json')

async function fetchJuejinData() {
  console.log('📝 正在拉取掘金数据...')
  try {
    const res = await fetch('https://api.juejin.cn/content_api/v1/article/query_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://juejin.cn',
        'Origin': 'https://juejin.cn',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        user_id: JUEJIN_USER_ID,
        sort_type: 2,
        cursor: '{"v":"1","i":0,"p":1,"m":false}',
        limit: 20,
      }),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data.err_no !== 0) throw new Error(data.err_msg)

    // 只保留需要的字段，减小体积
    const articles = data.data.map(item => {
      const info = item.article_info
      const tagName = item.tags?.[0]?.tag_name || item.category?.category_name || '技术'
      return {
        id: info.article_id,
        title: info.title,
        summary: info.brief_content,
        tag: tagName,
        category: item.category?.category_name || '',
        date: new Date(Number(info.ctime) * 1000).toISOString().slice(0, 10),
        views: info.view_count,
        likes: info.digg_count,
        comments: info.comment_count,
        collects: info.collect_count,
        readTime: info.read_time || '',
        hot: info.hot_index > 50,
      }
    })

    const u = data.data[0]?.author_user_info || {}
    const userInfo = {
      name: u.user_name || 'CTRL_CV',
      avatar: u.avatar_large || '',
      level: u.level || 2,
      power: u.power || 93,
      followers: u.follower_count || 0,
      following: u.followee_count || 0,
      totalViews: u.got_view_count || 0,
      totalLikes: u.got_digg_count || 0,
      articleCount: u.post_article_count || 0,
    }

    const output = {
      userInfo,
      articles,
      updatedAt: new Date().toISOString(),
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8')
    console.log(`✅ 掘金数据已保存：${articles.length} 篇文章`)
  } catch (e) {
    console.warn('⚠️  掘金数据拉取失败:', e.message)
    // 如果已有旧数据就保留，否则写入空数据
    if (!fs.existsSync(OUTPUT_PATH)) {
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ userInfo: null, articles: [], updatedAt: null }), 'utf-8')
    }
  }
}

fetchJuejinData()
