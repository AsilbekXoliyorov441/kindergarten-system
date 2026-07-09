import { STUDENT_STATUS } from '@/shared/config/constants'
import { getStudentBalance } from '@/shared/lib/stats/balance'

/** Lifetime ranking (earned minus redeemed), optionally scoped to a group. */
export function getLeaderboard(students, transactions, { groupId } = {}) {
  const pool = students
    .filter((s) => s.status === STUDENT_STATUS.ACTIVE)
    .filter((s) => (groupId ? s.groupId === groupId : true))

  return pool
    .map((student) => ({ student, total: getStudentBalance(student.id, transactions) }))
    .sort((a, b) => b.total - a.total)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))
}

/** Ranking scoped to coins earned within a specific "oy" (month), ignoring redemptions. */
export function getLeaderboardByPeriod(students, coinEntries, lessons, { groupId, monthIndex } = {}) {
  const lessonById = new Map(lessons.map((l) => [l.id, l]))
  const pool = students
    .filter((s) => s.status === STUDENT_STATUS.ACTIVE)
    .filter((s) => (groupId ? s.groupId === groupId : true))

  const totals = new Map(pool.map((s) => [s.id, 0]))
  coinEntries.forEach((entry) => {
    if (!totals.has(entry.studentId)) return
    const lesson = lessonById.get(entry.lessonId)
    if (!lesson) return
    if (monthIndex && lesson.monthIndex !== monthIndex) return
    totals.set(entry.studentId, (totals.get(entry.studentId) ?? 0) + entry.value)
  })

  return pool
    .map((student) => ({ student, total: totals.get(student.id) ?? 0 }))
    .sort((a, b) => b.total - a.total)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))
}
