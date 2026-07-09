import { Plus, PenLine } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { GiftGrid } from '@/widgets/GiftGrid/GiftGrid'
import { GiftFormDialog } from '@/features/manage-gifts/ui/GiftFormDialog'
import { DeleteGiftDialog } from '@/features/manage-gifts/ui/DeleteGiftDialog'
import { useAuthStore } from '@/entities/session/model/store'
import { useGiftStore } from '@/entities/gift/model/store'
import { useStudentStore } from '@/entities/student/model/store'
import { useTransactionStore } from '@/entities/transaction/model/store'
import { getStudentBalance } from '@/shared/lib/stats'
import { ROLES } from '@/shared/config/constants'

export function CoinMarketPage() {
  const role = useAuthStore((s) => s.role)
  const userId = useAuthStore((s) => s.userId)
  const gifts = useGiftStore((s) => s.items)
  const students = useStudentStore((s) => s.items)
  const transactions = useTransactionStore((s) => s.items)

  const isTeacher = role === ROLES.TEACHER
  const currentStudent = !isTeacher ? students.find((s) => s.id === userId) : null
  const balance = currentStudent ? getStudentBalance(currentStudent.id, transactions) : null

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {isTeacher ? `${gifts.length} ta mahsulot` : balance != null ? `Balansingiz: ${balance} coin` : ''}
        </p>
        {isTeacher && (
          <GiftFormDialog
            trigger={
              <Button className="gap-1.5">
                <Plus className="size-4" /> Sovg'a qo'shish
              </Button>
            }
          />
        )}
      </div>

      <Card>
        <CardContent className="p-5">
          <GiftGrid
            gifts={gifts}
            balance={isTeacher ? null : balance}
            actions={
              isTeacher
                ? (gift) => (
                    <div className="flex items-center justify-center gap-1">
                      <GiftFormDialog
                        gift={gift}
                        trigger={
                          <Button size="icon" variant="ghost" className="size-8" aria-label="Tahrirlash">
                            <PenLine className="size-4" />
                          </Button>
                        }
                      />
                      <DeleteGiftDialog gift={gift} />
                    </div>
                  )
                : undefined
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
