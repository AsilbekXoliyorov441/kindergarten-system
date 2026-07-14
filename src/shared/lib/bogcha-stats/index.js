import { ATTENDANCE_STATUS } from '@/shared/config/bogcha'

function percentOf(accrued, potential) {
  return potential ? (accrued / potential) * 100 : 0
}

/** Attendance stats for a single child over a month. `elapsedWeekdays` = how many Mon-Fri
 * dates have passed so far this month (from `getWeekdaysInMonth(...).filter(w => !w.isFuture).length`). */
export function getChildMonthStats(attendanceRecords, elapsedWeekdays, feePerDay) {
  const presentDays = attendanceRecords.filter((a) => a.status === ATTENDANCE_STATUS.PRESENT).length
  const absences = attendanceRecords
    .filter((a) => a.status === ATTENDANCE_STATUS.ABSENT)
    .map((a) => ({ dateKey: a.date, reason: a.reason }))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))

  const accrued = presentDays * feePerDay
  const potential = elapsedWeekdays * feePerDay

  return { presentDays, absentDays: absences.length, absences, accrued, potential, percent: percentOf(accrued, potential) }
}

/** Same shape, aggregated across every active child in a group. */
export function getGroupMonthStats(children, attendanceRecords, elapsedWeekdays, feePerDay) {
  const presentDays = attendanceRecords.filter((a) => a.status === ATTENDANCE_STATUS.PRESENT).length
  const accrued = presentDays * feePerDay
  const potential = elapsedWeekdays * children.length * feePerDay

  return { childCount: children.length, presentDays, accrued, potential, percent: percentOf(accrued, potential) }
}

/** Superadmin-level rollup across every group. `groupBreakdown` = one `getGroupMonthStats`
 * result per group (already computed by the caller), keyed by groupId. */
export function getOverviewStats(groupBreakdown) {
  const entries = Object.values(groupBreakdown)
  const childCount = entries.reduce((sum, g) => sum + g.childCount, 0)
  const accrued = entries.reduce((sum, g) => sum + g.accrued, 0)
  const potential = entries.reduce((sum, g) => sum + g.potential, 0)

  return { groupCount: entries.length, childCount, accrued, potential, percent: percentOf(accrued, potential) }
}

export function groupAttendanceByChild(attendanceRecords) {
  const map = new Map()
  for (const record of attendanceRecords) {
    if (!map.has(record.childId)) map.set(record.childId, [])
    map.get(record.childId).push(record)
  }
  return map
}
