import { useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { ChevronLeft, ChevronRight, Wallet, CalendarCheck, UserPlus, UserMinus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Meter } from '@/shared/ui/meter'
import { ChartTooltip } from '@/shared/ui/chart-tooltip'
import { EmptyState } from '@/shared/ui/empty-state'
import { FeedbackStatsCharts } from '@/widgets/FeedbackStatsCharts/FeedbackStatsCharts'
import { useThreadsForDirector } from '@/entities/bogcha-thread/model/store'
import { useBogchaGroupStore } from '@/entities/bogcha-group/model/store'
import { useBogchaChildStore, useAllChildrenForStats } from '@/entities/bogcha-child/model/store'
import { useAttendanceForMonth } from '@/entities/bogcha-attendance/model/store'
import { useBogchaSettingsStore } from '@/entities/bogcha-settings/model/store'
import { getMonthKey, getWeekdaysInMonth, shiftMonthKey } from '@/shared/lib/bogcha-date'
import { getGroupMonthStats, getOverviewStats, getEnrollmentStats } from '@/shared/lib/bogcha-stats'
import { formatUzMonthYear } from '@/shared/lib/date'

function monthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  return formatUzMonthYear(year, month - 1)
}

function MonthNav({ monthKey, onMonthChange }) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" onClick={() => onMonthChange(shiftMonthKey(monthKey, -1))} aria-label="Oldingi oy">
        <ChevronLeft className="size-4" />
      </Button>
      <p className="w-32 text-center text-sm font-semibold capitalize text-foreground">{monthLabel(monthKey)}</p>
      <Button variant="ghost" size="icon" onClick={() => onMonthChange(shiftMonthKey(monthKey, 1))} aria-label="Keyingi oy">
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}

export function BogchaStatisticsPage() {
  const [monthKey, setMonthKey] = useState(getMonthKey())
  const threads = useThreadsForDirector()
  const groups = useBogchaGroupStore((s) => s.items)
  const children = useBogchaChildStore((s) => s.items)
  const allChildren = useAllChildrenForStats()
  const attendance = useAttendanceForMonth(monthKey)
  const feePerDay = useBogchaSettingsStore((s) => s.feePerDay)

  const elapsedWeekdays = getWeekdaysInMonth(monthKey).filter((w) => !w.isFuture).length
  const breakdown = {}
  groups.forEach((group) => {
    const groupChildren = children.filter((c) => c.groupId === group.id)
    const groupAttendance = attendance.filter((a) => a.groupId === group.id)
    breakdown[group.id] = getGroupMonthStats(groupChildren, groupAttendance, elapsedWeekdays, feePerDay)
  })
  const overview = getOverviewStats(breakdown)
  const enrollment = getEnrollmentStats(allChildren, monthKey)

  const paymentData = groups.map((group) => ({ groupName: group.name, accrued: breakdown[group.id].accrued }))
  const attendanceData = groups.map((group) => ({ groupName: group.name, percent: Math.round(breakdown[group.id].percent) }))
  const hasPaymentData = paymentData.some((row) => row.accrued > 0)
  const hasAttendanceData = attendanceData.some((row) => row.percent > 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="size-4 text-primary" /> To'lov statistikasi
            </CardTitle>
            <CardDescription>Har bir guruhda shu oy yig'ilgan summa</CardDescription>
          </div>
          <MonthNav monthKey={monthKey} onMonthChange={setMonthKey} />
        </CardHeader>
        <CardContent className="h-72">
          {!hasPaymentData ? (
            <EmptyState icon={Wallet} title="Ma'lumot yo'q" description="Bu oyda hali to'lov hisoblanmagan." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="groupName" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  width={44}
                  domain={[0, 'dataMax']}
                  tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
                />
                <Tooltip content={<ChartTooltip formatter={(v) => `${v.toLocaleString('ru-RU')} so'm`} />} cursor={{ fill: 'var(--accent)' }} />
                <Bar dataKey="accrued" name="Yig'ilgan summa" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarCheck className="size-4 text-primary" /> Umumiy davomat statistikasi
            </CardTitle>
            <CardDescription>Har bir guruhning shu oydagi davomat foizi</CardDescription>
          </div>
          <Meter percent={overview.percent} label="Umumiy davomat" className="w-44" />
        </CardHeader>
        <CardContent className="h-72">
          {!hasAttendanceData ? (
            <EmptyState icon={CalendarCheck} title="Ma'lumot yo'q" description="Bu oyda hali yoqlama qilinmagan." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="groupName" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  width={36}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} cursor={{ fill: 'var(--accent)' }} />
                <Bar dataKey="percent" name="Davomat" fill="var(--success)" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Talabalar dinamikasi</CardTitle>
          <MonthNav monthKey={monthKey} onMonthChange={setMonthKey} />
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-success/10 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-success/15 text-success">
              <UserPlus className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Yangi qo'shilgan ({enrollment.joinedCount} ta)</p>
              <p className="text-xl font-semibold text-success">{enrollment.joinedPercent.toFixed(1)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
              <UserMinus className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Guruhni tark etgan ({enrollment.leftCount} ta)</p>
              <p className="text-xl font-semibold text-destructive">{enrollment.leftPercent.toFixed(1)}%</p>
            </div>
          </div>
          <p className="col-span-full text-xs text-muted-foreground">
            Jami {enrollment.totalCount} ta o'quvchi (faol va arxivlangan) soniga nisbatan hisoblangan.
          </p>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Murojaatlar statistikasi</h3>
        <FeedbackStatsCharts threads={threads} groups={groups} />
      </div>
    </div>
  )
}
