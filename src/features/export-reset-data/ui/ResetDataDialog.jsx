import { useState } from 'react'
import { RefreshCcw } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
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
import { useAuthStore } from '@/entities/session/model/store'

export function ResetDataDialog() {
  const [open, setOpen] = useState(false)
  const token = useAuthStore((s) => s.token)
  const resetOperationalData = useMutation(api.backup.resetOperationalData)

  const handleReset = async () => {
    await resetOperationalData({ token })
    window.location.reload()
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-1.5">
          <RefreshCcw className="size-4" /> Ma'lumotlarni tozalash
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Barcha ma'lumotlarni tozalash</AlertDialogTitle>
          <AlertDialogDescription>
            Barcha guruhlar, o'quvchilar, darslar va coinlar tarixi butunlay o'chiriladi. Login parolingiz va sovg'alar
            katalogi saqlanib qoladi. Bu amalni ortga qaytarib bo'lmaydi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset}>Ha, tozalash</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
