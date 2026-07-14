import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Users2, Baby } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs'
import { EmptyState } from '@/shared/ui/empty-state'
import { AttendanceMonthGrid } from '@/widgets/AttendanceMonthGrid/AttendanceMonthGrid'
import { AddChildDialog } from '@/features/bogcha-manage-children/ui/AddChildDialog'
import { ArchiveChildDialog } from '@/features/bogcha-manage-children/ui/ArchiveChildDialog'
import { TransferChildDialog } from '@/features/bogcha-manage-children/ui/TransferChildDialog'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { useBogchaGroupStore } from '@/entities/bogcha-group/model/store'
import { useChildrenForGroup } from '@/entities/bogcha-child/model/store'
import { getMonthKey } from '@/shared/lib/bogcha-date'
import { BOGCHA_ROLES, BOGCHA_ROUTES } from '@/shared/config/bogcha'

export function BogchaGroupDetailPage() {
  const { groupId } = useParams()
  const [monthKey, setMonthKey] = useState(getMonthKey())

  const role = useBogchaAuthStore((s) => s.role)
  const isSuperAdmin = role === BOGCHA_ROLES.SUPERADMIN
  const groups = useBogchaGroupStore((s) => s.items)
  const group = groups.find((g) => g.id === groupId)
  const children = useChildrenForGroup(groupId)

  if (!group) {
    return (
      <EmptyState
        icon={Users2}
        title="Guruh topilmadi"
        description="Bu guruh sizga biriktirilmagan yoki mavjud emas."
        action={
          <Button asChild variant="outline">
            <Link to={BOGCHA_ROUTES.DASHBOARD}>Bosh sahifaga qaytish</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link to={BOGCHA_ROUTES.DASHBOARD} aria-label="Orqaga">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{group.name}</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="secondary">{children.length} bola</Badge>
            </div>
          </div>
        </div>
        {isSuperAdmin && <AddChildDialog group={group} />}
      </div>

      <Tabs defaultValue="yoqlama">
        <TabsList>
          <TabsTrigger value="yoqlama">Yoqlama</TabsTrigger>
          <TabsTrigger value="bolalar">Bolalar</TabsTrigger>
        </TabsList>
        <TabsContent value="yoqlama">
          <AttendanceMonthGrid groupId={group.id} monthKey={monthKey} onMonthChange={setMonthKey} />
        </TabsContent>
        <TabsContent value="bolalar">
          {children.length === 0 ? (
            <EmptyState icon={Baby} title="Guruhda bola yo'q" description="Bola qo'shish uchun superadminga murojaat qiling." />
          ) : (
            <Card>
              <CardContent className="divide-y divide-border/60 p-0">
                {children.map((child) => (
                  <div key={child.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <Link to={BOGCHA_ROUTES.childProfile(child.id)} className="min-w-0 hover:text-primary">
                      <p className="truncate font-medium text-foreground">{child.fullName}</p>
                      {child.birthDate && <p className="text-xs text-muted-foreground">{child.birthDate}</p>}
                    </Link>
                    {isSuperAdmin && (
                      <div className="flex shrink-0 items-center gap-1">
                        <TransferChildDialog child={child} />
                        <ArchiveChildDialog child={child} />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
