import { useState } from 'react'
import { toast } from 'sonner'
import { UserX } from 'lucide-react'
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
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { useBogchaChildStore } from '@/entities/bogcha-child/model/store'

export function ArchiveChildDialog({ child }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const archiveChild = useBogchaChildStore((s) => s.archive)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = reason.trim()
    if (!trimmed) return

    setSubmitting(true)
    try {
      await archiveChild(child.id, trimmed)
      toast.success(`${child.fullName} arxivlandi`)
      setReason('')
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setReason('')
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" aria-label="Bolani arxivlash">
          <UserX className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Bolani arxivlash</DialogTitle>
            <DialogDescription>
              <strong className="text-foreground">{child.fullName}</strong> ro'yxatdan yashiriladi, yoqlama tarixi saqlanib qoladi.
              Sababini ko'rsating.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-4">
            <Label htmlFor="archive-reason">Sababi</Label>
            <Textarea
              id="archive-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Masalan: boshqa bogchaga o'tdi, oilaviy sabab..."
              autoFocus
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" variant="destructive" disabled={submitting || !reason.trim()}>
              Arxivlash
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
