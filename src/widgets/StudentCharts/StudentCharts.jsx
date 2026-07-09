import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts'
import { BarChart3, Radar as RadarIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'
import { ChartTooltip } from '@/shared/ui/chart-tooltip'
import { EmptyState } from '@/shared/ui/empty-state'
import { COIN_CATEGORY_LIST } from '@/shared/config/constants'
import { getWeeklyBreakdown, getMonthlyBreakdown, getCategoryBreakdown } from '@/shared/lib/stats'
import { getMonthLabel } from '@/shared/lib/date'

export function StudentCharts({ studentId, coinEntries, lessons }) {
  const weekly = getWeeklyBreakdown(studentId, coinEntries).slice(-8)
  const monthly = getMonthlyBreakdown(studentId, coinEntries, lessons).map((m) => ({
    ...m,
    label: getMonthLabel(m.monthIndex),
  }))
  const category = getCategoryBreakdown(studentId, coinEntries)
  const categoryData = COIN_CATEGORY_LIST.map((c) => ({ label: c.label, value: category[c.key] }))

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Oylik progress</CardTitle>
          <CardDescription>12 dars = 1 oy bo'yicha yig'ilgan coinlar</CardDescription>
        </CardHeader>
        <CardContent className="h-64 pt-0">
          {monthly.length === 0 ? (
            <EmptyState icon={BarChart3} title="Ma'lumot yo'q" description="Hali dars yozuvlari mavjud emas." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  width={32}
                />
                <Tooltip content={<ChartTooltip formatter={(v) => `${v} coin`} />} cursor={{ fill: 'var(--accent)' }} />
                <Bar dataKey="total" name="Coinlar" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kategoriya profili</CardTitle>
          <CardDescription>Yo'nalishlar bo'yicha kuchli tomonlar</CardDescription>
        </CardHeader>
        <CardContent className="h-64 pt-0">
          {categoryData.every((c) => c.value === 0) ? (
            <EmptyState icon={RadarIcon} title="Ma'lumot yo'q" description="Hali baholanmagan." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={categoryData} outerRadius="72%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="label" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                <Radar
                  dataKey="value"
                  name="Coinlar"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Tooltip content={<ChartTooltip formatter={(v) => `${v} coin`} />} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Haftalik progress</CardTitle>
          <CardDescription>So'nggi haftalar bo'yicha faollik</CardDescription>
        </CardHeader>
        <CardContent className="h-56 pt-0">
          {weekly.length === 0 ? (
            <EmptyState icon={BarChart3} title="Ma'lumot yo'q" description="Hali haftalik ma'lumot mavjud emas." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  width={32}
                />
                <Tooltip content={<ChartTooltip formatter={(v) => `${v} coin`} />} cursor={{ fill: 'var(--accent)' }} />
                <Bar dataKey="total" name="Coinlar" fill="var(--chart-2)" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
