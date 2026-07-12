import { useState } from 'react'
import { toast } from 'sonner'
import { KeyRound, RefreshCw } from 'lucide-react'
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
import { useTeacherStore } from '@/entities/teacher/model/store'
import { generateStudentPassword } from '@/shared/lib/credentials'

export function ResetTeacherPasswordDialog({ teacher }) {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState(generateStudentPassword)
  const [submitting, setSubmitting] = useState(false)
  const resetPassword = useTeacherStore((s) => s.resetPassword)

  const handleOpenChange = (next) => {
    setOpen(next)
    if (next) setPassword(generateStudentPassword())
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!password) return

    setSubmitting(true)
    try {
      const result = await resetPassword(teacher.id, password)
      toast.success(`${teacher.fullName} uchun yangi parol: ${result.password}`)
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" aria-label="Parolni tiklash">
          <KeyRound className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Parolni tiklash</DialogTitle>
            <DialogDescription>
              {teacher.fullName} ({teacher.username}) uchun yangi parol o'rnatiladi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-4">
            <Label htmlFor="reset-password">Yangi parol</Label>
            <div className="flex gap-2">
              <Input id="reset-password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus required />
              <Button type="button" variant="outline" size="icon" onClick={() => setPassword(generateStudentPassword())}>
                <RefreshCw className="size-4" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              Saqlash
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
