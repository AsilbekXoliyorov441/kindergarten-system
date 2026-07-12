import { useState } from 'react'
import { toast } from 'sonner'
import { Pencil } from 'lucide-react'
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
import { useGroupStore } from '@/entities/group/model/store'

export function RenameGroupDialog({ group, trigger }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(group.name)
  const renameGroup = useGroupStore((s) => s.rename)

  const handleOpenChange = (next) => {
    if (next) setName(group.name)
    setOpen(next)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || trimmed === group.name) {
      setOpen(false)
      return
    }

    renameGroup(group.id, trimmed)
    toast.success(`Guruh nomi "${trimmed}"ga o'zgartirildi`)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            aria-label="Guruh nomini tahrirlash"
          >
            <Pencil className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Guruh nomini tahrirlash</DialogTitle>
            <DialogDescription>Guruh uchun yangi nom kiriting.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-4">
            <Label htmlFor="group-rename">Guruh nomi</Label>
            <Input
              id="group-rename"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Frontend PDP-24F"
              autoFocus
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Saqlash</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
