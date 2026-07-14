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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { useBogchaStaffStore } from '@/entities/bogcha-staff/model/store'
import { BOGCHA_ROLES } from '@/shared/config/bogcha'

export function CreateStaffDialog() {
  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState(BOGCHA_ROLES.OPA)
  const [submitting, setSubmitting] = useState(false)
  const createStaff = useBogchaStaffStore((s) => s.create)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = fullName.trim()
    if (!trimmed) return

    setSubmitting(true)
    try {
      const { username, password } = await createStaff(trimmed, role, phone.trim() || undefined)
      toast.success(`${trimmed} qo'shildi — login: ${username}, parol: ${password}`, { duration: 10000 })
      setFullName('')
      setPhone('')
      setRole(BOGCHA_ROLES.OPA)
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <UserPlus className="size-4" /> Xodim qo'shish
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Yangi xodim qo'shish</DialogTitle>
            <DialogDescription>Login va parol avtomatik yaratiladi, faqat bir marta ko'rsatiladi.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="staff-name">To'liq ism</Label>
              <Input
                id="staff-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masalan: Malika Yusupova"
                autoFocus
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="staff-phone">Telefon (ixtiyoriy)</Label>
              <Input
                id="staff-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Lavozim</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BOGCHA_ROLES.OPA}>Bogcha opa</SelectItem>
                  <SelectItem value={BOGCHA_ROLES.SUPERADMIN}>Superadmin</SelectItem>
                </SelectContent>
              </Select>
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
