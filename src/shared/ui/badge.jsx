import { cn } from '@/shared/lib/utils'
import { badgeVariants } from '@/shared/ui/badge-variants'

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }
