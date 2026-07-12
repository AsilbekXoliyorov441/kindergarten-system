import { cn } from '@/shared/lib/utils'

const CAP_WARNING_PERCENT = 75
const CAP_CRITICAL_PERCENT = 100

function getSeverity(percent) {
  if (percent >= CAP_CRITICAL_PERCENT) return 'critical'
  if (percent >= CAP_WARNING_PERCENT) return 'warning'
  return 'good'
}

const FILL_CLASS = { good: 'bg-success', warning: 'bg-warning', critical: 'bg-destructive' }
const TEXT_CLASS = { good: 'text-success', warning: 'text-warning', critical: 'text-destructive' }

/** A single-ratio-against-a-limit meter (e.g. "% of policy cap used"). Severity is
 * derived from `percent` alone: <75% good, 75-100% warning, >=100% over the limit. */
export function Meter({ percent, label, className }) {
  const clamped = Math.max(0, Math.min(percent, 100))
  const severity = getSeverity(percent)

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className={cn('font-semibold tabular-nums', TEXT_CLASS[severity])}>{Math.round(percent)}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full transition-[width]', FILL_CLASS[severity])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
