import { motion } from 'framer-motion'
import { Gift as GiftIconLucide } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { EmptyState } from '@/shared/ui/empty-state'
import { GiftIcon } from '@/entities/gift/ui/GiftIcon'
import { cn } from '@/shared/lib/utils'

/**
 * Catalog grid shared by the Coin Market page and the student-profile redeem panel.
 * `actions(gift, affordable)` renders the trailing control per gift — CRUD, redeem, or nothing.
 *
 * Uses an auto-fill grid (not fixed viewport breakpoints) so column count adapts to
 * whatever width the *parent* actually gives it — this grid gets embedded in both a
 * full-width page and a narrow split-column panel, and viewport breakpoints alone
 * can't tell those apart.
 */
export function GiftGrid({ gifts, balance = null, actions }) {
  if (gifts.length === 0) {
    return (
      <EmptyState
        icon={GiftIconLucide}
        title="Sovg'alar yo'q"
        description="Hozircha katalogda sovg'a mavjud emas."
      />
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-3">
      {gifts.map((gift, index) => {
        const affordable = balance == null ? true : balance >= gift.price
        return (
          <motion.div
            key={gift.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.03, 0.3) }}
          >
            <Card className={cn('h-full transition-opacity', balance != null && !affordable && 'opacity-55')}>
              <CardContent className="flex h-full flex-col gap-3 p-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-coin/15 text-coin-foreground dark:text-coin">
                    <GiftIcon icon={gift.icon} className="size-6" />
                  </div>
                  <p className="line-clamp-2 min-h-9 text-sm font-medium leading-tight text-foreground">
                    {gift.name}
                  </p>
                </div>
                <div className="mt-auto flex flex-col items-stretch gap-2 border-t border-border/60 pt-3">
                  <Badge variant="coin" className="w-fit self-center">
                    {gift.price} coin
                  </Badge>
                  {actions ? actions(gift, affordable) : null}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
