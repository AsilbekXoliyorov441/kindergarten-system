import { useState } from 'react'
import { toast } from 'sonner'
import { UserX } from 'lucide-react'
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

export function ArchiveStaffDialog({ staff }) {
  const [open, setOpen] = useState(false)
  const updateStatus = useBogchaStaffStore((s) => s.updateStatus)

  const handleArchive = () => {
    updateStatus(staff.id, 'archived')
    toast.success(`${staff.fullName} arxivlandi`)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" aria-label="Xodimni arxivlash">
          <UserX className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xodimni arxivlash</AlertDialogTitle>
          <AlertDialogDescription>
            <strong className="text-foreground">{staff.fullName}</strong> tizimga kira olmay qoladi. Guruh biriktirmalari saqlanadi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction onClick={handleArchive}>Ha, arxivlash</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
