import { ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { EmptyState } from '@/shared/ui/empty-state'
import { CreateStaffDialog } from '@/features/bogcha-manage-staff/ui/CreateStaffDialog'
import { ResetPasswordDialog } from '@/features/bogcha-manage-staff/ui/ResetPasswordDialog'
import { ArchiveStaffDialog } from '@/features/bogcha-manage-staff/ui/ArchiveStaffDialog'
import { useBogchaStaffStore } from '@/entities/bogcha-staff/model/store'
import { useBogchaGroupStore } from '@/entities/bogcha-group/model/store'
import { BOGCHA_ROLES } from '@/shared/config/bogcha'

const ROLE_LABELS = {
  [BOGCHA_ROLES.SUPERADMIN]: 'Superadmin',
  [BOGCHA_ROLES.OPA]: 'Bogcha opa',
}

export function BogchaStaffPage() {
  const staff = useBogchaStaffStore((s) => s.items)
  const groups = useBogchaGroupStore((s) => s.items)
  const staffLinks = useBogchaGroupStore((s) => s.staffLinks)
  const groupById = new Map(groups.map((g) => [g.id, g]))

  const activeStaff = staff.filter((s) => s.status === 'active')

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{activeStaff.length} ta xodim</p>
        <CreateStaffDialog />
      </div>

      {activeStaff.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Hali xodim yo'q"
          description="Bogcha opa yoki superadmin qo'shing."
          action={<CreateStaffDialog />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {activeStaff.map((person) => {
            const assignedGroups = staffLinks
              .filter((l) => l.staffId === person.id)
              .map((l) => groupById.get(l.groupId))
              .filter(Boolean)

            return (
              <Card key={person.id} className="relative h-full">
                <CardContent className="space-y-3 p-5 pr-16">
                  <div>
                    <p className="truncate font-semibold text-foreground">{person.fullName}</p>
                    <p className="text-xs text-muted-foreground">@{person.username}</p>
                  </div>
                  <Badge variant={person.role === BOGCHA_ROLES.SUPERADMIN ? 'default' : 'secondary'}>
                    {ROLE_LABELS[person.role]}
                  </Badge>
                  {person.role === BOGCHA_ROLES.OPA && (
                    <div className="flex flex-wrap gap-1.5">
                      {assignedGroups.length === 0 ? (
                        <span className="text-xs text-muted-foreground">Guruh biriktirilmagan</span>
                      ) : (
                        assignedGroups.map((group) => (
                          <span key={group.id} className="rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                            {group.name}
                          </span>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
                <div className="absolute right-3 top-3 flex items-center gap-1">
                  <ResetPasswordDialog staff={person} />
                  <ArchiveStaffDialog staff={person} />
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
