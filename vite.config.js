import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vue')) return 'vue-vendor'
          if (id.includes('node_modules/lunar-javascript')) return 'lunar'
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})
