import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users2, CalendarCheck } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { EmptyState } from '@/shared/ui/empty-state'
import { BogchaOverview } from '@/widgets/BogchaOverview/BogchaOverview'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { useBogchaGroupStore } from '@/entities/bogcha-group/model/store'
import { useChildrenForGroup } from '@/entities/bogcha-child/model/store'
import { useAttendanceForGroupMonth } from '@/entities/bogcha-attendance/model/store'
import { useBogchaSettingsStore } from '@/entities/bogcha-settings/model/store'
import { getMonthKey, getWeekdaysInMonth, toDateKey } from '@/shared/lib/bogcha-date'
import { getGroupMonthStats } from '@/shared/lib/bogcha-stats'
import { Meter } from '@/shared/ui/meter'
import { BOGCHA_ROLES, BOGCHA_ROUTES } from '@/shared/config/bogcha'

function OpaGroupCard({ group, monthKey }) {
  const children = useChildrenForGroup(group.id)
  const attendance = useAttendanceForGroupMonth(group.id, monthKey)
  const feePerDay = useBogchaSettingsStore((s) => s.feePerDay)
  const elapsedWeekdays = getWeekdaysInMonth(monthKey).filter((w) => !w.isFuture).length
  const stats = getGroupMonthStats(children, attendance, elapsedWeekdays, feePerDay)
  const todayKey = toDateKey(new Date())
  const markedToday = attendance.filter((a) => a.date === todayKey).length

  return (
    <Link to={BOGCHA_ROUTES.groupDetail(group.id)}>
      <Card className="h-full transition-colors hover:border-primary/40">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold text-foreground">{group.name}</p>
            <span className="shrink-0 text-xs text-muted-foreground">{children.length} bola</span>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarCheck className="size-3.5" />
            Bugun {markedToday}/{children.length} ta belgilandi
          </p>
          <Meter percent={stats.percent} label="Shu oy to'liq qatnashuvdan" />
        </CardContent>
      </Card>
    </Link>
  )
}

export function BogchaDashboardPage() {
  const role = useBogchaAuthStore((s) => s.role)
  const [monthKey, setMonthKey] = useState(getMonthKey())
  const groups = useBogchaGroupStore((s) => s.items)

  if (role === BOGCHA_ROLES.SUPERADMIN) {
    return <BogchaOverview monthKey={monthKey} onMonthChange={setMonthKey} />
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">{groups.length} ta guruhingiz bor</p>
      {groups.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="Sizga hali guruh biriktirilmagan"
          description="Superadmin sizni bir guruhga biriktirgach, u shu yerda ko'rinadi."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <OpaGroupCard key={group.id} group={group} monthKey={monthKey} />
          ))}
        </div>
      )}
    </div>
  )
}
