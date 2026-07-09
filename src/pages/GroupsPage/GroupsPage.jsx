import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users2, Calendar, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { EmptyState } from '@/shared/ui/empty-state'
import { CreateGroupDialog } from '@/features/create-group/ui/CreateGroupDialog'
import { DeleteGroupDialog } from '@/features/remove-group/ui/DeleteGroupDialog'
import { useGroupStore } from '@/entities/group/model/store'
import { useStudentStore } from '@/entities/student/model/store'
import { useLessonStore } from '@/entities/lesson/model/store'
import { useCoinEntryStore } from '@/entities/coin-entry/model/store'
import { getGroupStats } from '@/shared/lib/stats'
import { formatUzDate } from '@/shared/lib/date'
import { ROUTES } from '@/shared/config/constants'

export function GroupsPage() {
  const groups = useGroupStore((s) => s.items)
  const students = useStudentStore((s) => s.items)
  const lessons = useLessonStore((s) => s.items)
  const coinEntries = useCoinEntryStore((s) => s.items)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{groups.length} ta guruh</p>
        <CreateGroupDialog />
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="Hali guruh yo'q"
          description="Birinchi guruhingizni yarating va o'quvchilar qo'shishni boshlang."
          action={<CreateGroupDialog />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group, index) => {
            const stats = getGroupStats(group, students, lessons, coinEntries)
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -3 }}
                className="relative"
              >
                <Link to={ROUTES.groupDetail(group.id)}>
                  <Card className="h-full">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-center gap-3 pr-8">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                          <Users2 className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">{group.name}</p>
                          <p className="text-xs text-muted-foreground">{stats.studentCount} o'quvchi</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-muted/60 p-3">
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <TrendingUp className="size-3" /> O'rtacha
                          </p>
                          <p className="font-semibold text-foreground">{stats.avgCoins} coin</p>
                        </div>
                        <div className="rounded-xl bg-muted/60 p-3">
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="size-3" /> Oxirgi dars
                          </p>
                          <p className="font-semibold text-foreground">
                            {stats.lastLessonDate ? formatUzDate(stats.lastLessonDate) : "Hali yo'q"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <div className="absolute right-3 top-3">
                  <DeleteGroupDialog group={group} />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
