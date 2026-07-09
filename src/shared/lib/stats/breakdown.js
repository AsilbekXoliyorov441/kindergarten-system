import { COIN_CATEGORY_LIST } from '@/shared/config/constants'
import { getIsoWeekKey } from '@/shared/lib/date'

export function getCategoryBreakdown(studentId, coinEntries) {
  const breakdown = Object.fromEntries(COIN_CATEGORY_LIST.map((c) => [c.key, 0]))
  coinEntries
    .filter((e) => e.studentId === studentId)
    .forEach((e) => {
      breakdown[e.category] = (breakdown[e.category] ?? 0) + e.value
    })
  return breakdown
}

export function getWeeklyBreakdown(studentId, coinEntries) {
  const byWeek = new Map()
  coinEntries
    .filter((e) => e.studentId === studentId)
    .forEach((e) => {
      const key = getIsoWeekKey(e.givenAt)
      byWeek.set(key, (byWeek.get(key) ?? 0) + e.value)
    })
  return [...byWeek.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, total]) => ({ week, total }))
}

export function getMonthlyBreakdown(studentId, coinEntries, lessons) {
  const lessonMonthById = new Map(lessons.map((l) => [l.id, l.monthIndex]))
  const byMonth = new Map()
  coinEntries
    .filter((e) => e.studentId === studentId)
    .forEach((e) => {
      const monthIndex = lessonMonthById.get(e.lessonId)
      if (!monthIndex) return
      byMonth.set(monthIndex, (byMonth.get(monthIndex) ?? 0) + e.value)
    })
  return [...byMonth.entries()]
    .sort(([a], [b]) => a - b)
    .map(([monthIndex, total]) => ({ monthIndex, total }))
}
