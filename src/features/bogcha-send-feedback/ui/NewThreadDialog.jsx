import { useState } from 'react'
import { toast } from 'sonner'
import { MessageCirclePlus } from 'lucide-react'
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
import { cn } from '@/shared/lib/utils'
import { useCreateThread } from '@/entities/bogcha-thread/model/store'
import { FEEDBACK_CATEGORY_LIST, FEEDBACK_CATEGORY_META, FEEDBACK_RECIPIENT, FEEDBACK_RECIPIENT_LABELS } from '@/shared/config/bogcha'

const RECIPIENT_LIST = [FEEDBACK_RECIPIENT.OPA, FEEDBACK_RECIPIENT.DIRECTOR]

export function NewThreadDialog() {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState(null)
  const [recipient, setRecipient] = useState(null)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const createThread = useCreateThread()

  const reset = () => {
    setCategory(null)
    setRecipient(null)
    setText('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!category || !recipient || !trimmed) return

    setSubmitting(true)
    try {
      await createThread(recipient, category, trimmed)
      toast.success('Murojaatingiz yuborildi')
      reset()
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
        if (!next) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <MessageCirclePlus className="size-4" /> Yangi murojaat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Yangi murojaat</DialogTitle>
            <DialogDescription>Turi va qabul qiluvchini tanlang, so'ng xabaringizni yozing.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label>Murojaat turi</Label>
              <div className="grid grid-cols-3 gap-2">
                {FEEDBACK_CATEGORY_LIST.map((key) => {
                  const meta = FEEDBACK_CATEGORY_META[key]
                  const active = category === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key)}
                      className={cn(
                        'flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-sm font-medium transition-colors',
                        active ? 'border-transparent bg-secondary' : 'border-border bg-card/50 hover:bg-accent',
                      )}
                    >
                      <span className={cn('size-2.5 rounded-full', meta.dotClass)} aria-hidden />
                      {meta.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Kimga yuborilsin</Label>
              <div className="grid grid-cols-2 gap-2">
                {RECIPIENT_LIST.map((key) => {
                  const active = recipient === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setRecipient(key)}
                      className={cn(
                        'rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                        active ? 'border-transparent bg-secondary text-foreground' : 'border-border bg-card/50 text-muted-foreground hover:bg-accent',
                      )}
                    >
                      {FEEDBACK_RECIPIENT_LABELS[key]}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="feedback-text">Xabar</Label>
              <Textarea
                id="feedback-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Fikringizni yozing..."
                className="min-h-24"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting || !category || !recipient || !text.trim()}>
              Yuborish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
