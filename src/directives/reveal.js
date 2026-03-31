// 滚动入场动画指令
// 用法: <div v-reveal> 或 <div v-reveal.delay="200">
export const vReveal = {
  mounted(el, binding) {
    const delay = binding.value || binding.arg || 0
    el.style.opacity = '0'
    el.style.transform = 'translateY(24px)'
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
  },
}
