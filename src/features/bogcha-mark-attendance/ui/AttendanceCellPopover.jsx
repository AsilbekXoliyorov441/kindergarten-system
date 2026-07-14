import { useState } from 'react'
import { toast } from 'sonner'
import { Check, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'
import { cn } from '@/shared/lib/utils'
import { useMarkAttendance } from '@/entities/bogcha-attendance/model/store'
import { ATTENDANCE_STATUS } from '@/shared/config/bogcha'

const CELL_CLASS = {
  present: 'bg-success/15 text-success hover:bg-success/25',
  absent: 'bg-destructive/15 text-destructive hover:bg-destructive/25',
  empty: 'bg-muted/60 text-muted-foreground hover:bg-accent',
}

export function AttendanceCellPopover({ childId, childName, dateKey, record, disabled }) {
  const [open, setOpen] = useState(false)
  const [showReasonFor, setShowReasonFor] = useState(false)
  const [reason, setReason] = useState(record?.reason ?? '')
  const mark = useMarkAttendance()

  const state = record?.status ?? 'empty'

  const handlePresent = async () => {
    await mark(childId, dateKey, ATTENDANCE_STATUS.PRESENT)
    toast.success(`${childName} — bugun keldi deb belgilandi`)
    setOpen(false)
  }

  const handleAbsent = async (event) => {
    event.preventDefault()
    const trimmed = reason.trim()
    if (!trimmed) return
    await mark(childId, dateKey, ATTENDANCE_STATUS.ABSENT, trimmed)
    toast.success(`${childName} — kelmadi deb belgilandi`)
    setShowReasonFor(false)
    setOpen(false)
  }

  if (disabled) {
    return <div className={cn('flex size-8 items-center justify-center rounded-lg', CELL_CLASS.empty, 'opacity-40')} />
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setShowReasonFor(false)
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex size-8 items-center justify-center rounded-lg transition-colors',
            CELL_CLASS[state],
          )}
          aria-label={`${childName} — ${dateKey}`}
        >
          {state === 'present' && <Check className="size-4" />}
          {state === 'absent' && <X className="size-4" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <p className="mb-3 text-sm font-medium text-foreground">{childName}</p>
        {!showReasonFor ? (
          <div className="flex gap-2">
            <Button type="button" size="sm" className="flex-1 gap-1.5 bg-success text-success-foreground hover:bg-success/90" onClick={handlePresent}>
              <Check className="size-3.5" /> Keldi
            </Button>
            <Button type="button" size="sm" variant="destructive" className="flex-1 gap-1.5" onClick={() => setShowReasonFor(true)}>
              <X className="size-3.5" /> Kelmadi
            </Button>
          </div>
        ) : (
          <form onSubmit={handleAbsent} className="space-y-2">
            <Label htmlFor={`reason-${childId}-${dateKey}`} className="text-xs">
              Kelmagan sababi
            </Label>
            <Textarea
              id={`reason-${childId}-${dateKey}`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Masalan: kasal bo'lib qoldi"
              className="min-h-[64px] text-sm"
              autoFocus
              required
            />
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" className="flex-1" onClick={() => setShowReasonFor(false)}>
                Ortga
              </Button>
              <Button type="submit" size="sm" variant="destructive" className="flex-1" disabled={!reason.trim()}>
                Saqlash
              </Button>
            </div>
          </form>
        )}
      </PopoverContent>
    </Popover>
  )
}
