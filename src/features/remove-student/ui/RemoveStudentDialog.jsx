import { useState } from 'react'
import { toast } from 'sonner'
import { UserMinus } from 'lucide-react'
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
import { useStudentStore } from '@/entities/student/model/store'
import { STUDENT_STATUS } from '@/shared/config/constants'

export function RemoveStudentDialog({ student }) {
  const [open, setOpen] = useState(false)
  const updateStatus = useStudentStore((s) => s.updateStatus)

  const handleRemove = () => {
    updateStatus(student.id, STUDENT_STATUS.REMOVED)
    toast.success(`${student.fullName} guruhdan chiqarildi`)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-destructive"
          aria-label="O'quvchini o'chirish"
        >
          <UserMinus className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>O'quvchini guruhdan chiqarish</AlertDialogTitle>
          <AlertDialogDescription>
            <strong className="text-foreground">{student.fullName}</strong> endi faol o'quvchi sifatida ko'rinmaydi.
            Uning coinlar tarixi va arxivi saqlanib qoladi. Davom etasizmi?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemove}>Ha, chiqarish</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
