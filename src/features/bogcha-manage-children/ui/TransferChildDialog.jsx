import { useState } from 'react'
import { toast } from 'sonner'
import { ArrowRightLeft } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { useBogchaChildStore } from '@/entities/bogcha-child/model/store'
import { useBogchaGroupStore } from '@/entities/bogcha-group/model/store'

export function TransferChildDialog({ child }) {
  const [open, setOpen] = useState(false)
  const [groupId, setGroupId] = useState('')
  const groups = useBogchaGroupStore((s) => s.items)
  const transferGroup = useBogchaChildStore((s) => s.transferGroup)

  const otherGroups = groups.filter((g) => g.id !== child.groupId)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!groupId) return
    transferGroup(child.id, groupId)
    const target = groups.find((g) => g.id === groupId)
    toast.success(`${child.fullName} "${target?.name}" guruhiga ko'chirildi`)
    setGroupId('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-primary" aria-label="Guruhni almashtirish">
          <ArrowRightLeft className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Guruhni almashtirish</DialogTitle>
            <DialogDescription>
              <strong className="text-foreground">{child.fullName}</strong> uchun yangi guruhni tanlang.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-4">
            <Select value={groupId} onValueChange={setGroupId}>
              <SelectTrigger>
                <SelectValue placeholder="Guruhni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {otherGroups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!groupId}>
              Ko'chirish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
