import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'
import { Button } from '@/shared/ui/button'
import { useGroupStore } from '@/entities/group/model/store'
import { useStudentStore } from '@/entities/student/model/store'
import { ROUTES, STUDENT_STATUS } from '@/shared/config/constants'

/**
 * Deletes a group. Any of its still-active students are deactivated (not hard-deleted)
 * so their coin/transaction history stays intact, matching how remove-student behaves.
 */
export function DeleteGroupDialog({ group, redirectAfter = false, trigger }) {
  const [open, setOpen] = useState(false)
  const students = useStudentStore((s) => s.items)
  const updateStatus = useStudentStore((s) => s.updateStatus)
  const removeGroup = useGroupStore((s) => s.remove)
  const navigate = useNavigate()

  const activeStudents = students.filter((s) => s.groupId === group.id && s.status === STUDENT_STATUS.ACTIVE)

  const handleDelete = () => {
    activeStudents.forEach((student) => updateStatus(student.id, STUDENT_STATUS.REMOVED))
    removeGroup(group.id)
    toast.success(`"${group.name}" guruhi o'chirildi`)
    setOpen(false)
    if (redirectAfter) navigate(ROUTES.GROUPS, { replace: true })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            aria-label="Guruhni o'chirish"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Guruhni o'chirish</AlertDialogTitle>
          <AlertDialogDescription>
            <strong className="text-foreground">{group.name}</strong> butunlay o'chiriladi.
            {activeStudents.length > 0 && (
              <> Bu guruhdagi {activeStudents.length} ta o'quvchi ham faolsizlantiriladi (tarixi saqlanadi).</>
            )}{' '}
            Bu amalni ortga qaytarib bo'lmaydi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Ha, o'chirish</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
