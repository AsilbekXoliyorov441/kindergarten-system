import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ShieldCheck, Users2 } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import { EmptyState } from '@/shared/ui/empty-state'
import { Switch } from '@/shared/ui/switch'
import { CreateTeacherDialog } from '@/features/manage-teachers/ui/CreateTeacherDialog'
import { ResetTeacherPasswordDialog } from '@/features/manage-teachers/ui/ResetTeacherPasswordDialog'
import { useTeacherStore } from '@/entities/teacher/model/store'

export function TeachersManagementPage() {
  const teachers = useTeacherStore((s) => s.items)
  const setSuperAdmin = useTeacherStore((s) => s.setSuperAdmin)
  const [pendingId, setPendingId] = useState(null)

  const handleToggleSuperAdmin = async (teacher, next) => {
    setPendingId(teacher.id)
    try {
      const result = await setSuperAdmin(teacher.id, next)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success(next ? `${teacher.fullName} superadmin qilindi` : `${teacher.fullName}dan superadmin huquqi olindi`)
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{teachers.length} ta ustoz</p>
        <CreateTeacherDialog />
      </div>

      {teachers.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="Hali ustoz yo'q"
          description="Yangi ustoz qo'shib, ularga o'z guruhlarini boshqarish imkonini bering."
          action={<CreateTeacherDialog />}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                <th className="py-2.5 font-medium">Ustoz</th>
                <th className="py-2.5 font-medium">Username</th>
                <th className="py-2.5 font-medium">Guruhlar</th>
                <th className="py-2.5 font-medium">Superadmin</th>
                <th className="py-2.5" />
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <motion.tr
                  key={teacher.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-border/40 last:border-0"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{teacher.fullName}</span>
                      {teacher.isSuperAdmin && (
                        <Badge variant="coin" className="gap-1">
                          <ShieldCheck className="size-3" /> Superadmin
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center rounded-lg bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                      {teacher.username}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{teacher.groupCount} ta guruh</td>
                  <td className="py-3">
                    <Switch
                      checked={teacher.isSuperAdmin}
                      disabled={pendingId === teacher.id}
                      onCheckedChange={(next) => handleToggleSuperAdmin(teacher, next)}
                    />
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-1">
                      <ResetTeacherPasswordDialog teacher={teacher} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
