import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { EmptyState } from '@/shared/ui/empty-state'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { ChatThread } from '@/features/bogcha-chat/ui/ChatThread'
import { ThreadListItem } from '@/features/bogcha-chat/ui/ThreadListItem'
import { useThreadsForDirector } from '@/entities/bogcha-thread/model/store'
import { useBogchaChildStore } from '@/entities/bogcha-child/model/store'
import { useBogchaGroupStore } from '@/entities/bogcha-group/model/store'
import { useBogchaStaffStore } from '@/entities/bogcha-staff/model/store'
import { BOGCHA_ROLES, FEEDBACK_CATEGORY_LIST, FEEDBACK_CATEGORY_META } from '@/shared/config/bogcha'

const ALL = 'all'

export function BogchaCorrespondencePage() {
  const threads = useThreadsForDirector().filter((t) => t.recipient === 'opa')
  const children = useBogchaChildStore((s) => s.items)
  const groups = useBogchaGroupStore((s) => s.items)
  const staffLinks = useBogchaGroupStore((s) => s.staffLinks)
  const staff = useBogchaStaffStore((s) => s.items)
  const opas = staff.filter((s) => s.role === BOGCHA_ROLES.OPA)

  const [groupId, setGroupId] = useState(ALL)
  const [opaId, setOpaId] = useState(ALL)
  const [category, setCategory] = useState(ALL)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedThreadId, setSelectedThreadId] = useState(null)

  const childById = new Map(children.map((c) => [c.id, c]))
  const groupById = new Map(groups.map((g) => [g.id, g]))
  const staffById = new Map(staff.map((s) => [s.id, s]))

  const opaNamesForGroup = (gId) =>
    staffLinks
      .filter((l) => l.groupId === gId)
      .map((l) => staffById.get(l.staffId)?.fullName)
      .filter(Boolean)
      .join(', ')

  const groupIdsForOpa = opaId === ALL ? null : new Set(staffLinks.filter((l) => l.staffId === opaId).map((l) => l.groupId))

  const filtered = threads.filter((t) => {
    if (groupId !== ALL && t.groupId !== groupId) return false
    if (groupIdsForOpa && !groupIdsForOpa.has(t.groupId)) return false
    if (category !== ALL && t.category !== category) return false
    if (dateFrom && t.createdAt.slice(0, 10) < dateFrom) return false
    if (dateTo && t.createdAt.slice(0, 10) > dateTo) return false
    return true
  })
  const sorted = [...filtered].sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Guruh</Label>
            <Select value={groupId} onValueChange={setGroupId}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Barcha guruhlar</SelectItem>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Bogcha opa</Label>
            <Select value={opaId} onValueChange={setOpaId}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Barcha opalar</SelectItem>
                {opas.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Turi</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Barchasi</SelectItem>
                {FEEDBACK_CATEGORY_LIST.map((key) => (
                  <SelectItem key={key} value={key}>
                    {FEEDBACK_CATEGORY_META[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Sanadan</Label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-40" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Sanagacha</Label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-40" />
          </div>
          <p className="ml-auto text-sm text-muted-foreground">{sorted.length} ta yozishma</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[24rem_1fr]">
        <Card>
          <CardContent className="max-h-[36rem] space-y-1 overflow-y-auto p-2 lg:max-h-[38rem]">
            {sorted.length === 0 ? (
              <EmptyState icon={MessageCircle} title="Yozishma topilmadi" description="Filtrlarni o'zgartirib ko'ring." />
            ) : (
              sorted.map((thread) => {
                const child = childById.get(thread.childId)
                const group = groupById.get(thread.groupId)
                const secondaryLabel = [group?.name, opaNamesForGroup(thread.groupId) || "opa biriktirilmagan"]
                  .filter(Boolean)
                  .join(' · ')
                return (
                  <ThreadListItem
                    key={thread.id}
                    thread={thread}
                    primaryLabel={child?.fullName ?? 'Bola'}
                    secondaryLabel={secondaryLabel}
                    selected={selectedThreadId === thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                  />
                )
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {selectedThreadId ? (
              <ChatThread threadId={selectedThreadId} readOnly />
            ) : (
              <EmptyState icon={MessageCircle} title="Yozishmani tanlang" description="Chapdagi ro'yxatdan tanlang." />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
