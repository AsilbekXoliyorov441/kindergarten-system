import { STUDENT_STATUS } from '@/shared/config/constants'
import { getTotalCoinsDistributed } from '@/shared/lib/stats/balance'

/** Cross-teacher rollup for the superadmin dashboard: how much value, on average, one
 * active student has accumulated so far, and what share of the per-student policy cap
 * (`maxStudentValueSom`) that represents. */
export function getSuperAdminOverview({ teachers, groups, students, transactions }, rate, maxStudentValueSom) {
  const activeStudents = students.filter((s) => s.status === STUDENT_STATUS.ACTIVE)
  const totalCoinsGiven = getTotalCoinsDistributed(transactions)
  const totalMoneyGiven = totalCoinsGiven * rate
  const avgCoinsPerStudent = activeStudents.length ? totalCoinsGiven / activeStudents.length : 0
  const avgMoneyPerStudent = avgCoinsPerStudent * rate
  const capUsagePercent = maxStudentValueSom ? (avgMoneyPerStudent / maxStudentValueSom) * 100 : 0

  return {
    teacherCount: teachers.length,
    groupCount: groups.length,
    studentCount: activeStudents.length,
    totalCoinsGiven,
    totalMoneyGiven,
    avgCoinsPerStudent,
    avgMoneyPerStudent,
    capUsagePercent,
  }
}

/** Same metrics broken down per teacher, for the superadmin comparison table. */
export function getTeacherComparison({ teachers, groups, students, transactions }, rate, maxStudentValueSom) {
  return teachers.map((teacher) => {
    const teacherGroupIds = new Set(groups.filter((g) => g.teacherId === teacher.id).map((g) => g.id))
    const teacherStudents = students.filter((s) => teacherGroupIds.has(s.groupId) && s.status === STUDENT_STATUS.ACTIVE)
    const studentIds = new Set(teacherStudents.map((s) => s.id))
    const teacherTransactions = transactions.filter((t) => studentIds.has(t.studentId))
    const totalCoins = getTotalCoinsDistributed(teacherTransactions)
    const avgCoinsPerStudent = teacherStudents.length ? totalCoins / teacherStudents.length : 0
    const avgMoneyPerStudent = avgCoinsPerStudent * rate

    return {
      teacherId: teacher.id,
      fullName: teacher.fullName,
      groupCount: teacherGroupIds.size,
      studentCount: teacherStudents.length,
      avgCoinsPerStudent,
      avgMoneyPerStudent,
      capUsagePercent: maxStudentValueSom ? (avgMoneyPerStudent / maxStudentValueSom) * 100 : 0,
    }
  })
}
