<template>
  <section class="section" :id="id">
    <div class="container">
      <SectionTitle icon="🛠️" title="小工具" />

      <div class="tools-grid">
        <!-- JSON 格式化 -->
        <div class="tool-card">
          <div class="tool-header">
            <span class="tool-icon">📋</span>
            <h3>JSON 格式化</h3>
          </div>
          <textarea v-model="jsonInput" class="tool-input" placeholder="输入 JSON..." rows="5"></textarea>
          <div v-if="jsonError" class="tool-error">{{ jsonError }}</div>
          <div class="tool-actions">
            <button @click="formatJson" class="tool-btn primary">格式化</button>
            <button @click="minifyJson" class="tool-btn">压缩</button>
            <button @click="copyText(jsonOutput)" class="tool-btn">复制</button>
          </div>
          <textarea v-model="jsonOutput" class="tool-output" rows="5" readonly placeholder="输出..."></textarea>
        </div>

        <!-- Base64 编码 -->
        <div class="tool-card">
          <div class="tool-header">
            <span class="tool-icon">🔐</span>
            <h3>Base64 编解码</h3>
          </div>
          <textarea v-model="base64Input" class="tool-input" placeholder="输入文本..." rows="3"></textarea>
          <div class="tool-actions">
            <button @click="encodeBase64" class="tool-btn primary">编码 →</button>
            <button @click="decodeBase64" class="tool-btn">← 解码</button>
            <button @click="copyText(base64Output)" class="tool-btn">复制</button>
          </div>
          <textarea v-model="base64Output" class="tool-output" rows="3" readonly placeholder="输出..."></textarea>
        </div>

        <!-- URL 编码 -->
        <div class="tool-card">
          <div class="tool-header">
            <span class="tool-icon">🔗</span>
            <h3>URL 编解码</h3>
          </div>
          <textarea v-model="urlInput" class="tool-input" placeholder="输入 URL 或文本..." rows="3"></textarea>
          <div class="tool-actions">
            <button @click="encodeUrl" class="tool-btn primary">编码 →</button>
            <button @click="decodeUrl" class="tool-btn">← 解码</button>
            <button @click="copyText(urlOutput)" class="tool-btn">复制</button>
          </div>
          <textarea v-model="urlOutput" class="tool-output" rows="3" readonly placeholder="输出..."></textarea>
        </div>

        <!-- 颜色转换 -->
        <div class="tool-card">
          <div class="tool-header">
            <span class="tool-icon">🎨</span>
            <h3>颜色转换</h3>
          </div>
          <div class="color-input-row">
            <input type="color" v-model="colorHex" @input="updateColors" class="color-picker" />
            <input v-model="colorHex" @input="updateColors" class="tool-input-inline" placeholder="#3fb950" />
          </div>
          <div class="color-preview" :style="{ background: colorHex }"></div>
          <div class="color-outputs">
            <div class="color-out" @click="copyText(colorRgb)">
              <span class="co-label">RGB</span>
              <span class="co-val">{{ colorRgb }}</span>
            </div>
            <div class="color-out" @click="copyText(colorHsl)">
              <span class="co-label">HSL</span>
              <span class="co-val">{{ colorHsl }}</span>
            </div>
          </div>
        </div>

        <!-- 密码生成器 -->
        <div class="tool-card">
          <div class="tool-header">
            <span class="tool-icon">🔑</span>
            <h3>密码生成器</h3>
          </div>
          <div class="pwd-display">{{ generatedPwd }}</div>
          <div class="pwd-options">
            <label><input type="range" v-model="pwdLength" min="8" max="32" /> 长度 {{ pwdLength }}</label>
            <label><input type="checkbox" v-model="pwdUpper" /> 大写</label>
            <label><input type="checkbox" v-model="pwdLower" checked /> 小写</label>
            <label><input type="checkbox" v-model="pwdNumber" checked /> 数字</label>
            <label><input type="checkbox" v-model="pwdSymbol" /> 符号</label>
          </div>
          <div class="tool-actions">
            <button @click="generatePwd" class="tool-btn primary">生成</button>
            <button @click="copyText(generatedPwd)" class="tool-btn">复制</button>
          </div>
        </div>

        <!-- 时间戳转换 -->
        <div class="tool-card">
          <div class="tool-header">
            <span class="tool-icon">⏰</span>
            <h3>时间戳转换</h3>
          </div>
          <div class="ts-row">
            <input v-model.number="tsInput" type="number" class="tool-input-inline full" placeholder="时间戳（毫秒）" />
            <button @click="ts2date" class="tool-btn">戳→日期</button>
            <button @click="date2ts" class="tool-btn">日期→戳</button>
          </div>
          <div class="ts-result">
            <div class="ts-item">
              <span class="ts-label">当前时间戳</span>
              <span class="ts-val" @click="copyText(nowTs)">{{ nowTs }} ms</span>
            </div>
            <div class="ts-item">
              <span class="ts-label">格式化</span>
              <span class="ts-val" @click="copyText(nowDate)">{{ nowDate }}</span>
            </div>
          </div>
          <div v-if="tsConverted" class="ts-result ts-converted">
            <div class="ts-item">
              <span class="ts-label">转换结果</span>
              <span class="ts-val">{{ tsConverted }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 通知提示 -->
      <Transition name="toast">
        <div v-if="toast.show" class="toast" :class="toast.type">{{ toast.msg }}</div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SectionTitle from './SectionTitle.vue'

defineProps({ id: String })

// --- Toast ---
const toast = ref({ show: false, msg: '', type: 'success' })
function showToast(msg, type = 'success') {
  toast.value = { show: true, msg, type }
  setTimeout(() => { toast.value.show = false }, 2000)
}
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => showToast('已复制到剪贴板')).catch(() => showToast('复制失败', 'error'))
}

// --- JSON ---
const jsonInput = ref('{\n  "name": "张三",\n  "age": 28,\n  "skills": ["Vue", "Node"]\n}')
const jsonOutput = ref('')
const jsonError = ref('')
function formatJson() {
  try {
    const obj = JSON.parse(jsonInput.value)
    jsonOutput.value = JSON.stringify(obj, null, 2)
    jsonError.value = ''
  } catch (e) { jsonError.value = 'JSON 格式错误: ' + e.message }
}
function minifyJson() {
  try {
    const obj = JSON.parse(jsonInput.value)
    jsonOutput.value = JSON.stringify(obj)
    jsonError.value = ''
  } catch (e) { jsonError.value = 'JSON 格式错误: ' + e.message }
}

// --- Base64 ---
const base64Input = ref('Hello World 你好世界')
const base64Output = ref('')
function encodeBase64() { base64Output.value = btoa(unescape(encodeURIComponent(base64Input.value))) }
function decodeBase64() {
  try { base64Output.value = decodeURIComponent(escape(atob(base64Input.value))) }
  catch { base64Output.value = '解码失败' }
}

// --- URL ---
const urlInput = ref('https://example.com?name=张三&city=北京')
const urlOutput = ref('')
function encodeUrl() { urlOutput.value = encodeURIComponent(urlInput.value) }
function decodeUrl() { urlOutput.value = decodeURIComponent(urlInput.value) }

// --- Color ---
const colorHex = ref('#3fb950')
function updateColors() {
  const hex = colorHex.value.startsWith('#') ? colorHex.value : '#' + colorHex.value
  colorHex.value = hex
}
const colorRgb = computed(() => {
  const h = colorHex.value.replace('#', '')
  const r = parseInt(h.substring(0,2), 16)
  const g = parseInt(h.substring(2,4), 16)
  const b = parseInt(h.substring(4,6), 16)
  return `rgb(${r}, ${g}, ${b})`
})
const colorHsl = computed(() => {
  const h = colorHex.value.replace('#', '')
  const r = parseInt(h.substring(0,2), 16) / 255
  const g = parseInt(h.substring(2,4), 16) / 255
  const b = parseInt(h.substring(4,6), 16) / 255
  const max = Math.max(r,g,b), min = Math.min(r,g,b)
  let hs = 0, s = 0, l = (max+min)/2
  if (max !== min) {
    const d = max - min; s = l > 0.5 ? d/(2-max-min) : d/(max+min)
    switch (max) {
      case r: hs = ((g-b)/d + (g<b?6:0))/6; break
      case g: hs = ((b-r)/d + 2)/6; break
      case b: hs = ((r-g)/d + 4)/6; break
    }
  }
  return `hsl(${Math.round(hs*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`
})

// --- Password ---
const pwdLength = ref(16)
const pwdUpper = ref(true)
const pwdLower = ref(true)
const pwdNumber = ref(true)
const pwdSymbol = ref(false)
const generatedPwd = ref('')
function generatePwd() {
  let chars = ''
  if (pwdUpper.value) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (pwdLower.value) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (pwdNumber.value) chars += '0123456789'
  if (pwdSymbol.value) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
  if (!chars) { generatedPwd.value = '请至少选择一项'; return }
  generatedPwd.value = Array.from({ length: pwdLength.value }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
onMounted(generatePwd)

// --- Timestamp ---
const tsInput = ref('')
const tsConverted = ref('')
const nowTs = ref(0)
const nowDate = ref('')
let tsTimer
onMounted(() => {
  const update = () => {
    const d = new Date()
    nowTs.value = d.getTime()
    nowDate.value = d.toLocaleString('zh-CN')
  }
  update()
  tsTimer = setInterval(update, 1000)
})
onUnmounted(() => clearInterval(tsTimer))
function ts2date() {
  if (!tsInput.value) return
  const d = new Date(Number(tsInput.value))
  tsConverted.value = isNaN(d) ? '无效时间戳' : d.toLocaleString('zh-CN')
}
function date2ts() {
  if (!tsInput.value) return
  const d = new Date(tsInput.value)
  tsConverted.value = isNaN(d) ? '无效日期' : d.getTime() + ' ms'
}
</script>

<style scoped>
.section { padding: 5rem 1.5rem; }
.container { max-width: 1100px; margin: 0 auto; }

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
}

.tool-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  transition: border-color 0.2s;
}
.tool-card:hover { border-color: #388bfd; }

.tool-header { display: flex; align-items: center; gap: 0.5rem; }
.tool-icon { font-size: 1.2rem; }
.tool-header h3 { font-size: 0.95rem; font-weight: 600; }

.tool-input, .tool-output {
  width: 100%; padding: 0.75rem;
  background: var(--bg-card2); border: 1px solid var(--border);
  border-radius: 8px; color: var(--text);
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.85rem; resize: vertical; outline: none;
  transition: border-color 0.2s;
}
.tool-input:focus { border-color: var(--accent); }
.tool-output { background: var(--bg); color: var(--accent2); cursor: default; }
.tool-error { font-size: 0.8rem; color: var(--accent3); background: rgba(247,129,102,0.1); padding: 0.4rem 0.6rem; border-radius: 6px; }

.tool-actions { display: flex; gap: 0.5rem; }
.tool-btn {
  flex: 1; padding: 0.5rem; border-radius: 6px;
  border: 1px solid var(--border); background: var(--bg-card2);
  color: var(--text-muted); cursor: pointer; font-size: 0.85rem; transition: all 0.2s;
}
.tool-btn:hover { border-color: var(--accent); color: var(--accent); }
.tool-btn.primary { background: var(--accent); color: #000; border-color: var(--accent); font-weight: 600; }
.tool-btn.primary:hover { background: #79b8ff; }

/* Color */
.color-input-row { display: flex; gap: 0.5rem; align-items: center; }
.color-picker { width: 44px; height: 36px; border: none; border-radius: 6px; cursor: pointer; background: none; }
.tool-input-inline { flex: 1; padding: 0.5rem 0.75rem; background: var(--bg-card2); border: 1px solid var(--border); border-radius: 6px; color: var(--text); font-size: 0.85rem; outline: none; }
.tool-input-inline.full { width: 100%; }
.color-preview { height: 40px; border-radius: 8px; border: 1px solid var(--border); transition: background 0.3s; }
.color-outputs { display: flex; gap: 0.5rem; }
.color-out { flex: 1; padding: 0.5rem 0.75rem; background: var(--bg-card2); border-radius: 6px; cursor: pointer; display: flex; flex-direction: column; gap: 0.2rem; transition: background 0.2s; }
.color-out:hover { background: var(--bg); }
.co-label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; }
.co-val { font-size: 0.82rem; font-family: monospace; color: var(--accent); }

/* Password */
.pwd-display {
  padding: 0.75rem; background: var(--bg);
  border: 1px solid var(--border); border-radius: 8px;
  font-family: 'Fira Code', monospace; font-size: 0.9rem;
  color: var(--accent2); word-break: break-all; min-height: 2.5rem;
}
.pwd-options { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.pwd-options label { display: flex; align-items: center; gap: 0.35rem; font-size: 0.82rem; color: var(--text-muted); cursor: pointer; }
.pwd-options input[type=range] { width: 80px; }
.pwd-options input[type=checkbox] { accent-color: var(--accent); }

/* Timestamp */
.ts-row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.ts-result { background: var(--bg-card2); border-radius: 8px; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
.ts-item { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; }
.ts-label { color: var(--text-muted); }
.ts-val { font-family: monospace; color: var(--accent); cursor: pointer; }
.ts-val:hover { text-decoration: underline; }
.ts-converted { margin-top: 0.5rem; border-top: 1px solid var(--border); padding-top: 0.75rem; }

/* Toast */
.toast {
  position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
  padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 0.9rem; z-index: 9999;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.toast.success { background: #238636; color: #fff; }
.toast.error { background: #da3633; color: #fff; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }
</style>
