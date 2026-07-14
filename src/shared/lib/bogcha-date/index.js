export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getMonthKey(date = new Date()) {
  return toDateKey(date).slice(0, 7)
}

export function isWeekday(dateKey) {
  const day = new Date(`${dateKey}T00:00:00`).getDay()
  return day >= 1 && day <= 5
}

export function shiftMonthKey(monthKey, delta) {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1 + delta, 1)
  return getMonthKey(date)
}

function daysInMonth(year, month0) {
  return new Date(year, month0 + 1, 0).getDate()
}

/** Every Mon-Fri date in the given month, flagged relative to today — used to size the
 * `AttendanceMonthGrid` columns and to compute "elapsed weekdays" for stats. */
export function getWeekdaysInMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const todayKey = toDateKey(new Date())
  const total = daysInMonth(year, month - 1)
  const weekdays = []

  for (let day = 1; day <= total; day += 1) {
    const date = new Date(year, month - 1, day)
    const dateKey = toDateKey(date)
    if (!isWeekday(dateKey)) continue
    weekdays.push({
      dateKey,
      dayOfMonth: day,
      weekday: date.getDay(),
      isToday: dateKey === todayKey,
      isFuture: dateKey > todayKey,
    })
  }

  return weekdays
}

/** Full calendar weeks (Mon-Sun) for the given month, padded with nulls outside the
 * month range — used by `ChildAttendanceCalendar`. */
export function getCalendarWeeks(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const todayKey = toDateKey(new Date())
  const total = daysInMonth(year, month - 1)

  const days = []
  for (let day = 1; day <= total; day += 1) {
    const date = new Date(year, month - 1, day)
    const dateKey = toDateKey(date)
    const weekday = date.getDay()
    days.push({
      dateKey,
      dayOfMonth: day,
      weekday,
      isWeekend: weekday === 0 || weekday === 6,
      isToday: dateKey === todayKey,
      isFuture: dateKey > todayKey,
    })
  }

  // Pad to full Mon-Sun weeks.
  const leading = (days[0].weekday + 6) % 7 // Monday = 0
  const trailing = (7 - ((leading + days.length) % 7)) % 7
  const padded = [...Array(leading).fill(null), ...days, ...Array(trailing).fill(null)]

  const weeks = []
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7))
  return weeks
}
