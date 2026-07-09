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
import { useStudentStore } from '@/entities/student/model/store'

export function AddStudentDialog({ group }) {
  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const createStudent = useStudentStore((s) => s.create)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = fullName.trim()
    if (!trimmed) return

    setSubmitting(true)
    try {
      const { login, password } = await createStudent(group.id, trimmed)
      toast.success(`${trimmed} qo'shildi — login: ${login}, parol: ${password}`)
      setFullName('')
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <UserPlus className="size-4" /> O'quvchi qo'shish
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Yangi o'quvchi qo'shish</DialogTitle>
            <DialogDescription>
              {group.name} guruhiga o'quvchi qo'shiladi, login va parol avtomatik yaratiladi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-4">
            <Label htmlFor="student-name">To'liq ism</Label>
            <Input
              id="student-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masalan: Aziz Karimov"
              autoFocus
              required
            />
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
