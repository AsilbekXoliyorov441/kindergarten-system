import { useState } from 'react'
import { toast } from 'sonner'
import { UserPlus, RefreshCw } from 'lucide-react'
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

export function CreateTeacherDialog() {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState(generateStudentPassword)
  const [submitting, setSubmitting] = useState(false)
  const createTeacher = useTeacherStore((s) => s.create)

  const resetForm = () => {
    setUsername('')
    setFullName('')
    setPassword(generateStudentPassword())
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedUsername = username.trim()
    const trimmedFullName = fullName.trim()
    if (!trimmedUsername || !trimmedFullName || !password) return

    setSubmitting(true)
    try {
      const result = await createTeacher(trimmedUsername, password, trimmedFullName)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success(`${trimmedFullName} qo'shildi — login: ${result.username}, parol: ${result.password}`)
      resetForm()
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenChange = (next) => {
    setOpen(next)
    if (!next) resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <UserPlus className="size-4" /> Ustoz qo'shish
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Yangi ustoz qo'shish</DialogTitle>
            <DialogDescription>Yaratilgan ustoz o'zi uchun guruh va o'quvchilarni mustaqil boshqaradi.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="teacher-fullname">To'liq ism</Label>
              <Input
                id="teacher-fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masalan: Nodira Yusupova"
                autoFocus
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="teacher-username">Username</Label>
              <Input
                id="teacher-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masalan: nodira"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="teacher-password">Parol</Label>
              <div className="flex gap-2">
                <Input id="teacher-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="button" variant="outline" size="icon" onClick={() => setPassword(generateStudentPassword())}>
                  <RefreshCw className="size-4" />
                </Button>
              </div>
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
