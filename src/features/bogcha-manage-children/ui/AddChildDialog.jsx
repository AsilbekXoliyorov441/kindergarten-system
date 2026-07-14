import { useState } from 'react'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'
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
import { useBogchaChildStore } from '@/entities/bogcha-child/model/store'

export function AddChildDialog({ group }) {
  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [parentFullName, setParentFullName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const createChild = useBogchaChildStore((s) => s.create)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedChild = fullName.trim()
    const trimmedParent = parentFullName.trim()
    if (!trimmedChild || !trimmedParent) return

    setSubmitting(true)
    try {
      const { parentUsername, parentPassword } = await createChild(
        group.id,
        trimmedChild,
        birthDate || undefined,
        trimmedParent,
        parentPhone.trim() || undefined,
      )
      toast.success(`${trimmedChild} qo'shildi — ota-ona uchun login: ${parentUsername}, parol: ${parentPassword}`, {
        duration: 12000,
      })
      setFullName('')
      setBirthDate('')
      setParentFullName('')
      setParentPhone('')
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <UserPlus className="size-4" /> Bola qo'shish
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Yangi bola qo'shish</DialogTitle>
            <DialogDescription>
              {group.name} guruhiga qo'shiladi. Ota-ona uchun login/parol avtomatik yaratiladi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="child-name">Bolaning to'liq ismi</Label>
              <Input
                id="child-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masalan: Amirbek Rustamov"
                autoFocus
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="child-birthdate">Tug'ilgan sana (ixtiyoriy)</Label>
              <Input id="child-birthdate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="parent-name">Ota-onaning to'liq ismi</Label>
              <Input
                id="parent-name"
                value={parentFullName}
                onChange={(e) => setParentFullName(e.target.value)}
                placeholder="Masalan: Nodira Rustamova"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="parent-phone">Ota-ona telefoni (ixtiyoriy)</Label>
              <Input
                id="parent-phone"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              Qo'shish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
