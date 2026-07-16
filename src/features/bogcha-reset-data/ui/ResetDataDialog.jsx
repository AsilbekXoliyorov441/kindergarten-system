import { useState } from 'react'
import { toast } from 'sonner'
import { RefreshCcw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { useResetAllData } from '@/entities/bogcha-settings/model/store'

export function ResetDataDialog() {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const resetAllData = useResetAllData()

  const reset = () => {
    setUsername('')
    setPassword('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!username.trim() || !password) return

    setSubmitting(true)
    try {
      await resetAllData(username.trim(), password)
      toast.success("Ma'lumotlar tozalandi")
      setOpen(false)
      reset()
      window.location.reload()
    } catch (error) {
      toast.error(error?.data ?? error?.message ?? "Ma'lumotlarni tozalashda xatolik yuz berdi")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-1.5">
          <RefreshCcw className="size-4" /> Ma'lumotlarni tozalash
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Barcha ma'lumotlarni tozalash</DialogTitle>
            <DialogDescription>
              Barcha guruhlar, bolalar, ota-onalar, davomat va murojaatlar butunlay o'chiriladi. Xodimlar (bogcha
              opa/direktor) login-parollari va kunlik narx sozlamasi saqlanib qoladi. Bu amalni ortga qaytarib
              bo'lmaydi — davom etish uchun o'z login va parolingizni kiriting.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="reset-username">Login</Label>
              <Input
                id="reset-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reset-password">Parol</Label>
              <Input
                id="reset-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" variant="destructive" disabled={submitting || !username.trim() || !password}>
              Ha, butunlay tozalash
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
