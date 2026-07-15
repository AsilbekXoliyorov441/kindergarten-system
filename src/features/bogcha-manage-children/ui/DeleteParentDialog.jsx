import { useState } from 'react'
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
import { useDeleteParent } from '@/entities/bogcha-parent/model/store'

export function DeleteParentDialog({ parent }) {
  const [open, setOpen] = useState(false)
  const deleteParent = useDeleteParent()

  const handleDelete = async () => {
    await deleteParent(parent.id)
    toast.success(`${parent.fullName} akkaunti o'chirildi`)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" aria-label="Ota-ona akkauntini o'chirish">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ota-ona akkauntini o'chirish</AlertDialogTitle>
          <AlertDialogDescription>
            <strong className="text-foreground">{parent.fullName}</strong> (@{parent.username}) tizimga kira olmay qoladi. Bu amalni ortga
            qaytarib bo'lmaydi.
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
