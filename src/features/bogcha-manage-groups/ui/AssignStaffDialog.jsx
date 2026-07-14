import { useState } from 'react'
import { UserCog } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Switch } from '@/shared/ui/switch'
import { EmptyState } from '@/shared/ui/empty-state'
import { useBogchaGroupStore } from '@/entities/bogcha-group/model/store'
import { useBogchaStaffStore } from '@/entities/bogcha-staff/model/store'
import { BOGCHA_ROLES } from '@/shared/config/bogcha'

export function AssignStaffDialog({ group }) {
  const [open, setOpen] = useState(false)
  const staffLinks = useBogchaGroupStore((s) => s.staffLinks)
  const assignStaff = useBogchaGroupStore((s) => s.assignStaff)
  const unassignStaff = useBogchaGroupStore((s) => s.unassignStaff)
  const staff = useBogchaStaffStore((s) => s.items)

  const opas = staff.filter((s) => s.role === BOGCHA_ROLES.OPA && s.status === 'active')
  const assignedStaffIds = new Set(staffLinks.filter((l) => l.groupId === group.id).map((l) => l.staffId))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-primary" aria-label="Bogcha opa biriktirish">
          <UserCog className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bogcha opa biriktirish</DialogTitle>
          <DialogDescription>
            <strong className="text-foreground">{group.name}</strong> guruhiga kimlar yoqlama qila olishini belgilang.
          </DialogDescription>
        </DialogHeader>
        {opas.length === 0 ? (
          <EmptyState
            icon={UserCog}
            title="Hali bogcha opa yo'q"
            description="Avval Xodimlar bo'limidan bogcha opa qo'shing."
          />
        ) : (
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {opas.map((person) => {
              const assigned = assignedStaffIds.has(person.id)
              return (
                <div key={person.id} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-accent/50">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{person.fullName}</p>
                    <p className="text-xs text-muted-foreground">@{person.username}</p>
                  </div>
                  <Switch
                    checked={assigned}
                    onCheckedChange={(checked) =>
                      checked ? assignStaff(group.id, person.id) : unassignStaff(group.id, person.id)
                    }
                  />
                </div>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
