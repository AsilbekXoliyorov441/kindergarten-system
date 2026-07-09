import { Users, Layers, Coins, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/shared/ui/card'
import { AnimatedNumber } from '@/shared/ui/animated-number'
import { cn } from '@/shared/lib/utils'
import { useGroupStore } from '@/entities/group/model/store'
import { useStudentStore } from '@/entities/student/model/store'
import { useLessonStore } from '@/entities/lesson/model/store'
import { useCoinEntryStore } from '@/entities/coin-entry/model/store'
import { useTransactionStore } from '@/entities/transaction/model/store'
import { getDashboardOverview } from '@/shared/lib/stats'
import { getCurrentCalendarMonthLabel } from '@/shared/lib/date'

function StatCard({ icon: Icon, label, value, hint, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -3 }}
    >
      <Card className="h-full">
        <CardContent className="flex items-center gap-4 p-5">
          <div className={cn('flex size-12 shrink-0 items-center justify-center rounded-2xl', accent)}>
            <Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold tabular-nums text-foreground">
              <AnimatedNumber value={value} />
            </p>
            <p className="truncate text-sm text-muted-foreground">{label}</p>
            {hint && <p className="text-xs text-muted-foreground/70">{hint}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function StatsOverview() {
  const groups = useGroupStore((s) => s.items)
  const students = useStudentStore((s) => s.items)
  const lessons = useLessonStore((s) => s.items)
  const coinEntries = useCoinEntryStore((s) => s.items)
  const transactions = useTransactionStore((s) => s.items)

  const overview = getDashboardOverview({ groups, students, coinEntries, lessons, transactions })

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        index={0}
        icon={Users}
        label="Umumiy o'quvchilar"
        value={overview.totalStudents}
        accent="bg-secondary text-primary"
      />
      <StatCard
        index={1}
        icon={Layers}
        label="Umumiy guruhlar"
        value={overview.totalGroups}
        accent="bg-secondary text-primary"
      />
      <StatCard
        index={2}
        icon={Coins}
        label="Jami tarqatilgan coinlar"
        value={overview.totalCoinsDistributed}
        accent="bg-coin/15 text-coin-foreground dark:text-coin"
      />
      <StatCard
        index={3}
        icon={TrendingUp}
        label="Shu oy faolligi"
        value={overview.coinsThisMonth}
        hint={getCurrentCalendarMonthLabel()}
        accent="bg-success/15 text-success"
      />
    </div>
  )
}
