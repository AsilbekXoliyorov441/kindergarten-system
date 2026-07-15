import { useState } from 'react'
import { toast } from 'sonner'
import { KeyRound } from 'lucide-react'
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
import { useUpdateParentCredentials } from '@/entities/bogcha-parent/model/store'

export function EditParentDialog({ parent }) {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState(parent.username)
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const updateCredentials = useUpdateParentCredentials()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedUsername = username.trim()
    if (!trimmedUsername) return

    setSubmitting(true)
    try {
      const usernameChanged = trimmedUsername !== parent.username
      await updateCredentials(parent.id, usernameChanged ? trimmedUsername : undefined, password.trim() || undefined)
      toast.success(`${parent.fullName} — login yangilandi: ${trimmedUsername}${password.trim() ? `, parol: ${password.trim()}` : ''}`, {
        duration: 10000,
      })
      setPassword('')
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
        if (next) {
          setUsername(parent.username)
          setPassword('')
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-primary" aria-label="Ota-ona login/parolini tahrirlash">
          <KeyRound className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ota-ona login/parolini tahrirlash</DialogTitle>
            <DialogDescription>
              <strong className="text-foreground">{parent.fullName}</strong> uchun login/parolni o'zgartiring.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="parent-username">Login</Label>
              <Input id="parent-username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="parent-password">Yangi parol</Label>
              <Input
                id="parent-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="O'zgartirmaslik uchun bo'sh qoldiring"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting || !username.trim()}>
              Saqlash
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
