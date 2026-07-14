import { useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
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
import { useBogchaGroupStore } from '@/entities/bogcha-group/model/store'

export function CreateGroupDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const createGroup = useBogchaGroupStore((s) => s.create)

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    createGroup(trimmed)
    toast.success(`"${trimmed}" guruhi yaratildi`)
    setName('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="size-4" /> Guruh yaratish
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Yangi guruh yaratish</DialogTitle>
            <DialogDescription>Guruh nomini kiriting, so'ng unga bola va bogcha opa qo'shishingiz mumkin.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-4">
            <Label htmlFor="group-name">Guruh nomi</Label>
            <Input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Quyoshcha guruhi"
              autoFocus
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Yaratish</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
