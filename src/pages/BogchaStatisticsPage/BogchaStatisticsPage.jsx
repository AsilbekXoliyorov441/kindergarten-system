import { useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { ChevronLeft, ChevronRight, Wallet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { ChartTooltip } from '@/shared/ui/chart-tooltip'
import { EmptyState } from '@/shared/ui/empty-state'
import { FeedbackStatsCharts } from '@/widgets/FeedbackStatsCharts/FeedbackStatsCharts'
import { useThreadsForDirector } from '@/entities/bogcha-thread/model/store'
import { useBogchaGroupStore } from '@/entities/bogcha-group/model/store'
import { useBogchaChildStore } from '@/entities/bogcha-child/model/store'
import { useAttendanceForMonth } from '@/entities/bogcha-attendance/model/store'
import { useBogchaSettingsStore } from '@/entities/bogcha-settings/model/store'
import { getMonthKey, getWeekdaysInMonth, shiftMonthKey } from '@/shared/lib/bogcha-date'
import { getGroupMonthStats } from '@/shared/lib/bogcha-stats'
import { formatUzMonthYear } from '@/shared/lib/date'

function monthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  return formatUzMonthYear(year, month - 1)
}

export function BogchaStatisticsPage() {
  const [monthKey, setMonthKey] = useState(getMonthKey())
  const threads = useThreadsForDirector()
  const groups = useBogchaGroupStore((s) => s.items)
  const children = useBogchaChildStore((s) => s.items)
  const attendance = useAttendanceForMonth(monthKey)
  const feePerDay = useBogchaSettingsStore((s) => s.feePerDay)

  const elapsedWeekdays = getWeekdaysInMonth(monthKey).filter((w) => !w.isFuture).length
  const paymentData = groups.map((group) => {
    const groupChildren = children.filter((c) => c.groupId === group.id)
    const groupAttendance = attendance.filter((a) => a.groupId === group.id)
    const stats = getGroupMonthStats(groupChildren, groupAttendance, elapsedWeekdays, feePerDay)
    return { groupName: group.name, accrued: stats.accrued }
  })
  const hasPaymentData = paymentData.some((row) => row.accrued > 0)

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
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setMonthKey(shiftMonthKey(monthKey, -1))} aria-label="Oldingi oy">
              <ChevronLeft className="size-4" />
            </Button>
            <p className="w-32 text-center text-sm font-semibold capitalize text-foreground">{monthLabel(monthKey)}</p>
            <Button variant="ghost" size="icon" onClick={() => setMonthKey(shiftMonthKey(monthKey, 1))} aria-label="Keyingi oy">
              <ChevronRight className="size-4" />
            </Button>
          </div>
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

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Murojaatlar statistikasi</h3>
        <FeedbackStatsCharts threads={threads} groups={groups} />
      </div>
    </div>
  )
}
