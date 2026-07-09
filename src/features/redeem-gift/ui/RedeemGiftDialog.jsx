import { useState } from 'react'
import { toast } from 'sonner'
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
import { useTransactionStore } from '@/entities/transaction/model/store'

/** The server recomputes the student's live balance and rejects atomically if it's
 * insufficient — this dialog no longer needs to pre-check anything client-side. */
export function RedeemGiftDialog({ student, gift, trigger }) {
  const [open, setOpen] = useState(false)
  const redeemGift = useTransactionStore((s) => s.redeemGift)

  const handleConfirm = async () => {
    try {
      await redeemGift(student.id, gift.id)
      toast.success(`🎁 ${gift.name} — ${student.fullName}ga berildi`)
    } catch (err) {
      toast.error(err.data ?? "Sovg'a berib bo'lmadi")
    }
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sovg'a berishni tasdiqlang</AlertDialogTitle>
          <AlertDialogDescription>
            <strong className="text-foreground">{student.fullName}</strong>ga{' '}
            <strong className="text-foreground">{gift.name}</strong> ({gift.price} coin) beriladi va balansidan{' '}
            {gift.price} coin yechiladi. Davom etasizmi?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Ha, berish</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
