import { toast } from 'sonner'
import { useLessonStore } from '@/entities/lesson/model/store'

/** Deleting a lesson (or every lesson in a group) cascades to its CoinEntry and Transaction
 * records too — handled atomically server-side by `lessons.removeCascade`. */
export function useLessonActions() {
  const removeCascade = useLessonStore((s) => s.removeMany)

  const deleteLesson = async (lesson) => {
    await removeCascade([lesson.id])
    toast.success(`${lesson.lessonNumber}-dars o'chirildi`)
  }

  const deleteAllLessons = async (groupLessons) => {
    if (groupLessons.length === 0) return
    await removeCascade(groupLessons.map((l) => l.id))
    toast.success(`${groupLessons.length} ta dars va ularning coin yozuvlari o'chirildi`)
  }

  return { deleteLesson, deleteAllLessons }
}
