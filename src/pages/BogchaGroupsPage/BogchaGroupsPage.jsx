import { Link } from 'react-router-dom'
import { Users2 } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { EmptyState } from '@/shared/ui/empty-state'
import { CreateGroupDialog } from '@/features/bogcha-manage-groups/ui/CreateGroupDialog'
import { ArchiveGroupDialog } from '@/features/bogcha-manage-groups/ui/ArchiveGroupDialog'
import { AssignStaffDialog } from '@/features/bogcha-manage-groups/ui/AssignStaffDialog'
import { useBogchaGroupStore } from '@/entities/bogcha-group/model/store'
import { useBogchaChildStore } from '@/entities/bogcha-child/model/store'
import { useBogchaStaffStore } from '@/entities/bogcha-staff/model/store'
import { BOGCHA_ROUTES } from '@/shared/config/bogcha'

export function BogchaGroupsPage() {
  const groups = useBogchaGroupStore((s) => s.items)
  const staffLinks = useBogchaGroupStore((s) => s.staffLinks)
  const children = useBogchaChildStore((s) => s.items)
  const staff = useBogchaStaffStore((s) => s.items)
  const staffById = new Map(staff.map((s) => [s.id, s]))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{groups.length} ta guruh</p>
        <CreateGroupDialog />
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="Hali guruh yo'q"
          description="Birinchi guruhingizni yarating va bogcha opa hamda bolalar qo'shishni boshlang."
          action={<CreateGroupDialog />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => {
            const childCount = children.filter((c) => c.groupId === group.id).length
            const assignedStaff = staffLinks
              .filter((l) => l.groupId === group.id)
              .map((l) => staffById.get(l.staffId))
              .filter((person) => person && person.status === 'active')

            return (
              <Card key={group.id} className="relative h-full">
                <CardContent className="space-y-4 p-5">
                  <Link to={BOGCHA_ROUTES.groupDetail(group.id)} className="block pr-16">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <Users2 className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{group.name}</p>
                        <p className="text-xs text-muted-foreground">{childCount} bola</p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-wrap gap-1.5">
                    {assignedStaff.length === 0 ? (
                      <span className="text-xs text-muted-foreground">Bogcha opa biriktirilmagan</span>
                    ) : (
                      assignedStaff.map((person) => (
                        <span key={person.id} className="rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                          {person.fullName}
                        </span>
                      ))
                    )}
                  </div>
                </CardContent>
                <div className="absolute right-3 top-3 flex items-center gap-1">
                  <AssignStaffDialog group={group} />
                  <ArchiveGroupDialog group={group} />
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
