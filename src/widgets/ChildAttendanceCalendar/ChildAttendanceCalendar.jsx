import { ChevronLeft, ChevronRight, Check, X, CircleAlert } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Meter } from '@/shared/ui/meter'
import { cn } from '@/shared/lib/utils'
import { useAttendanceForChildMonth } from '@/entities/bogcha-attendance/model/store'
import { useBogchaSettingsStore } from '@/entities/bogcha-settings/model/store'
import { getWeekdaysInMonth, getCalendarWeeks, shiftMonthKey } from '@/shared/lib/bogcha-date'
import { getChildMonthStats } from '@/shared/lib/bogcha-stats'
import { formatUzMonthYear } from '@/shared/lib/date'

const WEEKDAY_LABELS = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sh', 'Ya']

function monthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  return formatUzMonthYear(year, month - 1)
}

function dayClass(day, record) {
  if (!day) return 'invisible'
  if (day.isWeekend) return 'bg-transparent text-muted-foreground/40'
  if (day.isFuture) return 'bg-muted/40 text-muted-foreground'
  if (record?.status === 'present') return 'bg-success/15 text-success'
  if (record?.status === 'absent') return 'bg-destructive/15 text-destructive'
  return 'bg-muted/60 text-muted-foreground'
}

export function ChildAttendanceCalendar({ childId, monthKey, onMonthChange }) {
  const attendance = useAttendanceForChildMonth(childId, monthKey)
  const feePerDay = useBogchaSettingsStore((s) => s.feePerDay)

  const elapsedWeekdays = getWeekdaysInMonth(monthKey).filter((w) => !w.isFuture).length
  const stats = getChildMonthStats(attendance, elapsedWeekdays, feePerDay)
  const weeks = getCalendarWeeks(monthKey)
  const byDate = new Map(attendance.map((r) => [r.date, r]))

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
              <p className="text-xs text-muted-foreground">Kelgan kunlar</p>
              <p className="font-semibold text-foreground">{stats.presentDays}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hisoblangan summa</p>
              <p className="font-semibold text-foreground">{stats.accrued.toLocaleString('ru-RU')} so'm</p>
            </div>
            <Meter percent={stats.percent} label="To'liq qatnashuvdan" className="w-40" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="text-center text-xs font-medium text-muted-foreground">
                {label}
              </div>
            ))}
            {weeks.flat().map((day, index) => {
              const record = day ? byDate.get(day.dateKey) : null
              return (
                <div
                  key={day?.dateKey ?? `pad-${index}`}
                  title={record?.reason ? `Sabab: ${record.reason}` : undefined}
                  className={cn(
                    'flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl text-sm font-medium',
                    dayClass(day, record),
                  )}
                >
                  {day && (
                    <>
                      <span>{day.dayOfMonth}</span>
                      {record?.status === 'present' && <Check className="size-3" />}
                      {record?.status === 'absent' && <X className="size-3" />}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {stats.absences.length > 0 && (
        <Card>
          <CardContent className="space-y-2 p-4">
            <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <CircleAlert className="size-4 text-destructive" /> Kelmagan kunlar
            </p>
            <ul className="space-y-1.5 text-sm">
              {stats.absences.map((absence) => (
                <li key={absence.dateKey} className="flex items-start justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2">
                  <span className="text-muted-foreground">{absence.dateKey}</span>
                  <span className="text-right text-foreground">{absence.reason}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
