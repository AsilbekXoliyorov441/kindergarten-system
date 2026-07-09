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
import { getMonthLabel } from '@/shared/lib/date'

export function DeleteLessonDialog({ lesson }) {
  const [open, setOpen] = useState(false)
  const { deleteLesson } = useLessonActions()

  const handleDelete = () => {
    deleteLesson(lesson)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-destructive"
          aria-label="Darsni o'chirish"
        >
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Darsni o'chirish</AlertDialogTitle>
          <AlertDialogDescription>
            <strong className="text-foreground">{lesson.lessonNumber}-dars</strong> (
            {getMonthLabel(lesson.monthIndex)}) va unda berilgan barcha coinlar butunlay o'chiriladi. Bu amalni
            ortga qaytarib bo'lmaydi.
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
