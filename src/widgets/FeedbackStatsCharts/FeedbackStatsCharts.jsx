import { useMemo, useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MessageSquareWarning, PieChart as PieChartIcon, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { ChartTooltip } from '@/shared/ui/chart-tooltip'
import { ChartLegend } from '@/shared/ui/chart-legend'
import { EmptyState } from '@/shared/ui/empty-state'
import { FEEDBACK_CATEGORY_LIST, FEEDBACK_CATEGORY_META } from '@/shared/config/bogcha'

const ALL = 'all'

/** Threads (already filtered to whatever scope the caller wants — e.g. all threads, or
 * just opa-addressed ones) broken down by category, plus a per-group breakdown. */
export function FeedbackStatsCharts({ threads, groups }) {
  const [groupId, setGroupId] = useState(ALL)

  const scoped = groupId === ALL ? threads : threads.filter((t) => t.groupId === groupId)

  const distribution = useMemo(
    () =>
      FEEDBACK_CATEGORY_LIST.map((key) => ({
        key,
        label: FEEDBACK_CATEGORY_META[key].label,
        total: scoped.filter((t) => t.category === key).length,
      })),
    [scoped],
  )

  const perGroup = useMemo(
    () =>
      groups.map((group) => {
        const groupThreads = threads.filter((t) => t.groupId === group.id)
        const row = { groupName: group.name }
        FEEDBACK_CATEGORY_LIST.forEach((key) => {
          row[key] = groupThreads.filter((t) => t.category === key).length
        })
        return row
      }),
    [threads, groups],
  )

  const totalCount = distribution.reduce((sum, d) => sum + d.total, 0)
  const hasGroupData = perGroup.some((row) => FEEDBACK_CATEGORY_LIST.some((key) => row[key] > 0))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={groupId} onValueChange={setGroupId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Guruh" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Barcha guruhlar</SelectItem>
            {groups.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChartIcon className="size-4 text-primary" /> Turlar bo'yicha taqsimot
            </CardTitle>
            <CardDescription>Shikoyat / taklif / maqtov nisbati</CardDescription>
          </CardHeader>
          <CardContent className="h-72 pt-0">
            {totalCount === 0 ? (
              <EmptyState icon={MessageSquareWarning} title="Ma'lumot yo'q" description="Bu filtr bo'yicha murojaat topilmadi." />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="total"
                      nameKey="label"
                      innerRadius="58%"
                      outerRadius="88%"
                      paddingAngle={3}
                      cornerRadius={6}
                      stroke="var(--card)"
                      strokeWidth={2}
                    >
                      {distribution.map((entry) => (
                        <Cell key={entry.key} fill={FEEDBACK_CATEGORY_META[entry.key].cssVar} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip formatter={(v) => `${v} ta`} />} />
                  </PieChart>
                </ResponsiveContainer>
                <ChartLegend
                  items={distribution.map((d) => ({ label: `${d.label} (${d.total})`, color: FEEDBACK_CATEGORY_META[d.key].cssVar }))}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="size-4 text-primary" /> Guruhlar bo'yicha taqqoslash
            </CardTitle>
            <CardDescription>Har bir guruhdan kelgan murojaatlar soni</CardDescription>
          </CardHeader>
          <CardContent className="h-72 pt-0">
            {!hasGroupData ? (
              <EmptyState icon={BarChart3} title="Ma'lumot yo'q" description="Hali guruhlar bo'yicha murojaat kelmagan." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perGroup} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="groupName" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} width={28} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip formatter={(v) => `${v} ta`} />} cursor={{ fill: 'var(--accent)' }} />
                  {FEEDBACK_CATEGORY_LIST.map((key) => (
                    <Bar key={key} dataKey={key} name={FEEDBACK_CATEGORY_META[key].label} stackId="feedback" fill={FEEDBACK_CATEGORY_META[key].cssVar} radius={[0, 0, 0, 0]} maxBarSize={40} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
