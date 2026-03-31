/**
 * Cloudflare Worker - 掘金 API 代理
 * 解决浏览器跨域问题
 * 
 * 部署步骤：
 * 1. 登录 https://dash.cloudflare.com
 * 2. Workers & Pages → Create Worker
 * 3. 粘贴此代码 → 保存并部署
 * 4. 复制 Worker URL 填入 useJuejin.js 的 CF_WORKER_URL
 */

const JUEJIN_API = 'https://api.juejin.cn'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request) {
    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    const url = new URL(request.url)
    // 转发路径到掘金 API
    const targetUrl = JUEJIN_API + url.pathname + url.search

    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://juejin.cn',
        'Origin': 'https://juejin.cn',
      },
      body: request.method !== 'GET' ? request.body : undefined,
    })

    try {
      const response = await fetch(proxyRequest)
      const data = await response.json()

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      })
    } catch (e) {
      return new Response(JSON.stringify({ err_no: -1, err_msg: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      })
    }
  },
}
