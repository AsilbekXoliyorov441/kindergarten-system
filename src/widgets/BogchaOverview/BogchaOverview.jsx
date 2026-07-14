import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Users2, Baby, ShieldCheck, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Meter } from '@/shared/ui/meter'
import { EmptyState } from '@/shared/ui/empty-state'
import { useBogchaGroupStore } from '@/entities/bogcha-group/model/store'
import { useBogchaChildStore } from '@/entities/bogcha-child/model/store'
import { useBogchaStaffStore } from '@/entities/bogcha-staff/model/store'
import { useAttendanceForMonth } from '@/entities/bogcha-attendance/model/store'
import { useBogchaSettingsStore } from '@/entities/bogcha-settings/model/store'
import { getWeekdaysInMonth, shiftMonthKey } from '@/shared/lib/bogcha-date'
import { getGroupMonthStats, getOverviewStats } from '@/shared/lib/bogcha-stats'
import { formatUzMonthYear } from '@/shared/lib/date'
import { BOGCHA_ROUTES } from '@/shared/config/bogcha'

function monthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  return formatUzMonthYear(year, month - 1)
}

export function BogchaOverview({ monthKey, onMonthChange }) {
  const groups = useBogchaGroupStore((s) => s.items)
  const children = useBogchaChildStore((s) => s.items)
  const staff = useBogchaStaffStore((s) => s.items)
  const attendance = useAttendanceForMonth(monthKey)
  const feePerDay = useBogchaSettingsStore((s) => s.feePerDay)

  const elapsedWeekdays = getWeekdaysInMonth(monthKey).filter((w) => !w.isFuture).length

  const breakdown = {}
  for (const group of groups) {
    const groupChildren = children.filter((c) => c.groupId === group.id)
    const groupAttendance = attendance.filter((a) => a.groupId === group.id)
    breakdown[group.id] = getGroupMonthStats(groupChildren, groupAttendance, elapsedWeekdays, feePerDay)
  }
  const overview = getOverviewStats(breakdown)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onMonthChange(shiftMonthKey(monthKey, -1))} aria-label="Oldingi oy">
            <ChevronLeft className="size-4" />
          </Button>
          <p className="w-32 text-center text-sm font-semibold capitalize text-foreground">{monthLabel(monthKey)}</p>
          <Button variant="ghost" size="icon" onClick={() => onMonthChange(shiftMonthKey(monthKey, 1))} aria-label="Keyingi oy">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="space-y-2 p-4">
            <div className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
              <Users2 className="size-4" />
            </div>
            <p className="text-xs text-muted-foreground">Guruhlar</p>
            <p className="text-xl font-semibold text-foreground">{groups.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-4">
            <div className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
              <Baby className="size-4" />
            </div>
            <p className="text-xs text-muted-foreground">Bolalar</p>
            <p className="text-xl font-semibold text-foreground">{children.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-4">
            <div className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
              <ShieldCheck className="size-4" />
            </div>
            <p className="text-xs text-muted-foreground">Xodimlar</p>
            <p className="text-xl font-semibold text-foreground">{staff.filter((s) => s.status === 'active').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-4">
            <div className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
              <Wallet className="size-4" />
            </div>
            <p className="text-xs text-muted-foreground">Shu oy yig'ilgan</p>
            <p className="text-xl font-semibold text-foreground">{overview.accrued.toLocaleString('ru-RU')} so'm</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-1.5 p-5">
          <p className="text-sm font-medium text-foreground">Umumiy yig'ilish darajasi</p>
          <Meter percent={overview.percent} label="To'liq qatnashuvdan" />
        </CardContent>
      </Card>

      {groups.length === 0 ? (
        <EmptyState icon={Users2} title="Hali guruh yo'q" description="Guruhlar bo'limidan birinchi guruhni yarating." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => {
            const stats = breakdown[group.id]
            return (
              <Link key={group.id} to={BOGCHA_ROUTES.groupDetail(group.id)}>
                <Card className="h-full transition-colors hover:border-primary/40">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-semibold text-foreground">{group.name}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">{stats.childCount} bola</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{stats.accrued.toLocaleString('ru-RU')} so'm yig'ildi</p>
                    <Meter percent={stats.percent} />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
