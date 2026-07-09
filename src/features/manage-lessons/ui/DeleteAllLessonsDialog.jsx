import { useState } from 'react'
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
import { useLessonActions } from '@/features/manage-lessons/model/useLessonActions'

export function DeleteAllLessonsDialog({ lessons }) {
  const [open, setOpen] = useState(false)
  const { deleteAllLessons } = useLessonActions()

  const handleDelete = () => {
    deleteAllLessons(lessons)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-1.5" disabled={lessons.length === 0}>
          <Trash2 className="size-4" /> Hammasini o'chirish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Barcha darslarni o'chirish</AlertDialogTitle>
          <AlertDialogDescription>
            Bu guruhning barcha <strong className="text-foreground">{lessons.length} ta darsi</strong> va ularda
            berilgan barcha coinlar butunlay o'chiriladi. Keyingi dars 1-darsdan qayta boshlanadi. Bu amalni ortga
            qaytarib bo'lmaydi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Ha, hammasini o'chirish</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
