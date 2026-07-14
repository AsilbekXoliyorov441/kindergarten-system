import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Baby } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { EmptyState } from '@/shared/ui/empty-state'
import { ChildAttendanceCalendar } from '@/widgets/ChildAttendanceCalendar/ChildAttendanceCalendar'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { useBogchaChildStore } from '@/entities/bogcha-child/model/store'
import { useBogchaGroupStore } from '@/entities/bogcha-group/model/store'
import { getMonthKey } from '@/shared/lib/bogcha-date'
import { BOGCHA_ROLES, BOGCHA_ROUTES } from '@/shared/config/bogcha'

export function BogchaChildProfilePage() {
  const { childId } = useParams()
  const [monthKey, setMonthKey] = useState(getMonthKey())

  const role = useBogchaAuthStore((s) => s.role)
  const children = useBogchaChildStore((s) => s.items)
  const groups = useBogchaGroupStore((s) => s.items)

  const child = children.find((c) => c.id === childId)

  if (!child) {
    return (
      <EmptyState
        icon={Baby}
        title="Bola topilmadi"
        description="Bu bola sizga ko'rinmaydi yoki mavjud emas."
        action={
          role !== BOGCHA_ROLES.PARENT && (
            <Button asChild variant="outline">
              <Link to={BOGCHA_ROUTES.DASHBOARD}>Bosh sahifaga qaytish</Link>
            </Button>
          )
        }
      />
    )
  }

  const group = groups.find((g) => g.id === child.groupId)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {role !== BOGCHA_ROLES.PARENT && (
          <Button asChild variant="ghost" size="icon">
            <Link to={group ? BOGCHA_ROUTES.groupDetail(group.id) : BOGCHA_ROUTES.DASHBOARD} aria-label="Orqaga">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        )}
        <div>
          <h2 className="text-lg font-semibold text-foreground">{child.fullName}</h2>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {group && <Badge variant="secondary">{group.name}</Badge>}
            {child.birthDate && <Badge variant="outline">{child.birthDate}</Badge>}
          </div>
        </div>
      </div>

      <ChildAttendanceCalendar childId={child.id} monthKey={monthKey} onMonthChange={setMonthKey} />
    </div>
  )
}
