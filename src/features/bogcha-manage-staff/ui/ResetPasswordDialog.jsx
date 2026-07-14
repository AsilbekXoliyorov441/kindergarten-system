import { useState } from 'react'
import { toast } from 'sonner'
import { KeyRound } from 'lucide-react'
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
import { useBogchaStaffStore } from '@/entities/bogcha-staff/model/store'

export function ResetPasswordDialog({ staff }) {
  const [open, setOpen] = useState(false)
  const resetPassword = useBogchaStaffStore((s) => s.resetPassword)

  const handleReset = async () => {
    const { username, password } = await resetPassword(staff.id)
    toast.success(`${staff.fullName} uchun yangi parol: ${password} (login: ${username})`, { duration: 10000 })
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-primary" aria-label="Parolni tiklash">
          <KeyRound className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Parolni tiklash</AlertDialogTitle>
          <AlertDialogDescription>
            <strong className="text-foreground">{staff.fullName}</strong> uchun yangi parol yaratiladi (login bilan bir xil bo'ladi).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset}>Ha, tiklash</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
