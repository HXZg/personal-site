// 农历 + 节日 composable（使用 lunar-javascript 纯前端库）
import { computed } from 'vue'
import { Lunar, Solar, HolidayUtil } from 'lunar-javascript'

export function useLunar(dateRef) {
  // 农历信息
  const lunarInfo = computed(() => {
    try {
      const d = dateRef.value
      const solar = Solar.fromDate(d)
      const lunar = solar.getLunar()
      return {
        monthStr: lunar.getMonthInChinese() + '月',
        dayStr: lunar.getDayInChinese(),
        yearStr: lunar.getYearInGanZhi() + '年',
        zodiac: lunar.getYearShengXiao(),
        jieQi: lunar.getJieQi() || '',           // 当天节气（如"清明"）
        festivals: lunar.getFestivals(),           // 农历节日
        solarFestivals: solar.getFestivals(),      // 公历节日
        term: lunar.getJieQi(),
      }
    } catch {
      return { monthStr: '', dayStr: '', yearStr: '', zodiac: '', jieQi: '', festivals: [], solarFestivals: [] }
    }
  })

  // 今日节日（合并农历+公历）
  const todayFestivals = computed(() => {
    const f = []
    if (lunarInfo.value.solarFestivals?.length) f.push(...lunarInfo.value.solarFestivals)
    if (lunarInfo.value.festivals?.length) f.push(...lunarInfo.value.festivals)
    if (lunarInfo.value.jieQi) f.push(lunarInfo.value.jieQi)
    return f
  })

  // 未来节日倒计时（精确计算）
  const upcomingFestivals = computed(() => {
    const d = dateRef.value
    const today = Solar.fromDate(d)
    const todayMs = d.getTime()

    const festivalDefs = [
      { name: '元旦',   icon: '🎆', month: 1,  day: 1  },
      { name: '情人节', icon: '💝', month: 2,  day: 14 },
      { name: '妇女节', icon: '🌸', month: 3,  day: 8  },
      { name: '劳动节', icon: '🔨', month: 5,  day: 1  },
      { name: '儿童节', icon: '🎈', month: 6,  day: 1  },
      { name: '国庆节', icon: '🇨🇳', month: 10, day: 1  },
      { name: '圣诞节', icon: '🎄', month: 12, day: 25 },
    ]

    // 农历节日（近似公历日期）
    const lunarFests = [
      { name: '春节',   icon: '🧧', lunarMonth: 1,  lunarDay: 1  },
      { name: '元宵节', icon: '🏮', lunarMonth: 1,  lunarDay: 15 },
      { name: '端午节', icon: '🐉', lunarMonth: 5,  lunarDay: 5  },
      { name: '七夕',   icon: '🌌', lunarMonth: 7,  lunarDay: 7  },
      { name: '中秋节', icon: '🥮', lunarMonth: 8,  lunarDay: 15 },
      { name: '重阳节', icon: '🍂', lunarMonth: 9,  lunarDay: 9  },
    ]

    const year = d.getFullYear()
    const results = []

    // 公历节日
    for (const f of festivalDefs) {
      let target = new Date(year, f.month - 1, f.day)
      if (target <= d) target = new Date(year + 1, f.month - 1, f.day)
      const days = Math.ceil((target - d) / 86400000)
      results.push({ ...f, days, date: `${f.month}月${f.day}日`, type: 'solar' })
    }

    // 农历节日（用 lunar-javascript 精确转换）
    for (const f of lunarFests) {
      try {
        for (let y = year; y <= year + 1; y++) {
          const lunar = Lunar.fromYmd(y, f.lunarMonth, f.lunarDay)
          const solar = lunar.getSolar()
          const target = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay())
          if (target > d) {
            const days = Math.ceil((target - d) / 86400000)
            results.push({ ...f, days, date: `${solar.getMonth()}月${solar.getDay()}日`, type: 'lunar' })
            break
          }
        }
      } catch {}
    }

    return results.sort((a, b) => a.days - b.days).slice(0, 6)
  })

  // 节气信息
  const nextJieQi = computed(() => {
    try {
      const d = dateRef.value
      const lunar = Solar.fromDate(d).getLunar()
      const next = lunar.getNextJieQi()
      if (!next) return null
      const s = next.getSolar()
      const target = new Date(s.getYear(), s.getMonth() - 1, s.getDay())
      const days = Math.ceil((target - d) / 86400000)
      return { name: next.getName(), date: `${s.getMonth()}月${s.getDay()}日`, days }
    } catch { return null }
  })

  return { lunarInfo, todayFestivals, upcomingFestivals, nextJieQi }
}
