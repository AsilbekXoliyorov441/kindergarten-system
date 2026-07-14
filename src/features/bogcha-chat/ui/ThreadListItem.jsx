import { cn } from '@/shared/lib/utils'
import { FEEDBACK_CATEGORY_META, FEEDBACK_RECIPIENT_LABELS } from '@/shared/config/bogcha'
import { formatUzDate } from '@/shared/lib/date'

export function ThreadListItem({ thread, primaryLabel, secondaryLabel, selected, unread, onClick }) {
  const meta = FEEDBACK_CATEGORY_META[thread.category]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl px-3.5 py-3 text-left transition-colors',
        selected ? 'bg-secondary' : 'hover:bg-accent/60',
      )}
    >
      <span className={cn('mt-1.5 size-2.5 shrink-0 rounded-full', meta.dotClass)} aria-hidden />
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">{primaryLabel}</p>
          {unread && <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="O'qilmagan" />}
        </div>
        <p className="truncate text-xs text-muted-foreground">{secondaryLabel}</p>
        <div className="flex items-center gap-2 pt-0.5">
          <span className={cn('text-xs font-medium', meta.textClass)}>{meta.label}</span>
          <span className="text-[11px] text-muted-foreground/70">→ {FEEDBACK_RECIPIENT_LABELS[thread.recipient]}</span>
        </div>
        <p className="text-[11px] text-muted-foreground/70">{formatUzDate(thread.createdAt, { withTime: true })}</p>
      </div>
    </button>
  )
}
