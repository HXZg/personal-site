<template>
  <div class="section-title">
    <span class="st-icon">{{ icon }}</span>
    <h2 class="st-text">{{ title }}</h2>
    <div class="st-line"></div>
  </div>
</template>

<script setup>
defineProps({ icon: String, title: String })
</script>

<style scoped>
.section-title {
  display: flex; align-items: center; gap: 0.75rem;
  margin-bottom: 2rem;
}
.st-icon { font-size: 1.5rem; }
.st-text { font-size: 1.5rem; font-weight: 700; }
.st-line { flex: 1; height: 1px; background: var(--border); }
</style>
