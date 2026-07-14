import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Users2 } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Meter } from '@/shared/ui/meter'
import { EmptyState } from '@/shared/ui/empty-state'
import { AttendanceCellPopover } from '@/features/bogcha-mark-attendance/ui/AttendanceCellPopover'
import { useChildrenForGroup } from '@/entities/bogcha-child/model/store'
import { useAttendanceForGroupMonth } from '@/entities/bogcha-attendance/model/store'
import { useBogchaSettingsStore } from '@/entities/bogcha-settings/model/store'
import { getWeekdaysInMonth, shiftMonthKey } from '@/shared/lib/bogcha-date'
import { getGroupMonthStats, getChildMonthStats, groupAttendanceByChild } from '@/shared/lib/bogcha-stats'
import { formatUzMonthYear } from '@/shared/lib/date'
import { BOGCHA_ROUTES } from '@/shared/config/bogcha'

const WEEKDAY_LABELS = ['Ya', 'Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sh']

function monthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  return formatUzMonthYear(year, month - 1)
}

export function AttendanceMonthGrid({ groupId, monthKey, onMonthChange }) {
  const children = useChildrenForGroup(groupId)
  const attendance = useAttendanceForGroupMonth(groupId, monthKey)
  const feePerDay = useBogchaSettingsStore((s) => s.feePerDay)

  const weekdays = getWeekdaysInMonth(monthKey)
  const elapsedWeekdays = weekdays.filter((w) => !w.isFuture).length
  const groupStats = getGroupMonthStats(children, attendance, elapsedWeekdays, feePerDay)
  const attendanceByChild = groupAttendanceByChild(attendance)

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => onMonthChange(shiftMonthKey(monthKey, -1))} aria-label="Oldingi oy">
              <ChevronLeft className="size-4" />
            </Button>
            <p className="w-32 text-center text-sm font-semibold capitalize text-foreground">{monthLabel(monthKey)}</p>
            <Button variant="ghost" size="icon" onClick={() => onMonthChange(shiftMonthKey(monthKey, 1))} aria-label="Keyingi oy">
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Bolalar</p>
              <p className="font-semibold text-foreground">{groupStats.childCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Yig'ilgan summa</p>
              <p className="font-semibold text-foreground">{groupStats.accrued.toLocaleString('ru-RU')} so'm</p>
            </div>
            <Meter percent={groupStats.percent} label="To'liq qatnashuvdan" className="w-40" />
          </div>
        </CardContent>
      </Card>

      {children.length === 0 ? (
        <EmptyState icon={Users2} title="Guruhda bola yo'q" description="Avval bu guruhga bola qo'shing." />
      ) : weekdays.length === 0 ? (
        <EmptyState icon={Users2} title="Bu oyda ish kuni yo'q" />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 min-w-[200px] border-b border-border/60 bg-card px-4 py-3 text-left font-medium text-muted-foreground">
                    Bola
                  </th>
                  {weekdays.map((day) => (
                    <th
                      key={day.dateKey}
                      className={`min-w-[44px] border-b border-border/60 px-1 py-2 text-center text-xs font-medium ${
                        day.isToday ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      <div>{day.dayOfMonth}</div>
                      <div className="text-[10px] opacity-70">{WEEKDAY_LABELS[day.weekday]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {children.map((child) => {
                  const records = attendanceByChild.get(child.id) ?? []
                  const stats = getChildMonthStats(records, elapsedWeekdays, feePerDay)
                  const byDate = new Map(records.map((r) => [r.date, r]))

                  return (
                    <tr key={child.id} className="group">
                      <td className="sticky left-0 z-10 border-b border-border/40 bg-card px-4 py-2 group-hover:bg-accent/40">
                        <Link to={BOGCHA_ROUTES.childProfile(child.id)} className="block truncate font-medium text-foreground hover:text-primary">
                          {child.fullName}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {stats.presentDays} kun · {stats.accrued.toLocaleString('ru-RU')} so'm
                        </p>
                      </td>
                      {weekdays.map((day) => (
                        <td
                          key={day.dateKey}
                          className={`border-b border-border/40 p-1 text-center ${day.isToday ? 'bg-primary/5' : ''}`}
                        >
                          <AttendanceCellPopover
                            childId={child.id}
                            childName={child.fullName}
                            dateKey={day.dateKey}
                            record={byDate.get(day.dateKey)}
                            disabled={day.isFuture}
                          />
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
