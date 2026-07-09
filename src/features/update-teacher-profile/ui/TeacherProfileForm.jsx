import { useState } from 'react'
import { toast } from 'sonner'
import { Save } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { useAuthStore } from '@/entities/session/model/store'

export function TeacherProfileForm({ teacher }) {
  const [fullName, setFullName] = useState(teacher.fullName)
  const updateTeacherProfile = useAuthStore((s) => s.updateTeacherProfile)

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = fullName.trim()
    if (!trimmed) return
    updateTeacherProfile({ fullName: trimmed })
    toast.success('Profil yangilandi')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="teacher-name">To'liq ism</Label>
        <Input id="teacher-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="teacher-login">Login</Label>
        <Input id="teacher-login" value={teacher.username} disabled />
      </div>
      <Button type="submit" className="gap-1.5">
        <Save className="size-4" /> Saqlash
      </Button>
    </form>
  )
}
