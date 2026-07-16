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
import { useDeleteThread } from '@/entities/bogcha-thread/model/store'

export function DeleteThreadDialog({ threadId, onDeleted }) {
  const [open, setOpen] = useState(false)
  const deleteThread = useDeleteThread()

  const handleDelete = async () => {
    try {
      await deleteThread(threadId)
      toast.success("Murojaat o'chirildi")
      setOpen(false)
      onDeleted?.()
    } catch (error) {
      toast.error(error?.data ?? error?.message ?? "Murojaatni o'chirishda xatolik yuz berdi")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" aria-label="Murojaatni o'chirish">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Murojaatni o'chirish</AlertDialogTitle>
          <AlertDialogDescription>
            Bu murojaat va undagi barcha xabarlar butunlay o'chiriladi. Buni keyinroq qaytarib bo'lmaydi.
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
