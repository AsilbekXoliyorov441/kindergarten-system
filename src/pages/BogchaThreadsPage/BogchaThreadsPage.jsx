import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Baby, MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/empty-state'
import { ChatThread } from '@/features/bogcha-chat/ui/ChatThread'
import { ThreadListItem } from '@/features/bogcha-chat/ui/ThreadListItem'
import { NewThreadDialog } from '@/features/bogcha-send-feedback/ui/NewThreadDialog'
import { DeleteThreadDialog } from '@/features/bogcha-chat/ui/DeleteThreadDialog'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { useMyThreads, useMyThreadReads } from '@/entities/bogcha-thread/model/store'
import { useBogchaChildStore } from '@/entities/bogcha-child/model/store'
import { useBogchaGroupStore } from '@/entities/bogcha-group/model/store'
import { useBogchaStaffStore } from '@/entities/bogcha-staff/model/store'
import { BOGCHA_ROLES, BOGCHA_ROUTES, FEEDBACK_RECIPIENT_LABELS } from '@/shared/config/bogcha'

export function BogchaThreadsPage() {
  const role = useBogchaAuthStore((s) => s.role)
  const childId = useBogchaAuthStore((s) => s.childId)
  const threads = useMyThreads()
  const reads = useMyThreadReads()
  const children = useBogchaChildStore((s) => s.items)
  const groups = useBogchaGroupStore((s) => s.items)
  const staffLinks = useBogchaGroupStore((s) => s.staffLinks)
  const staff = useBogchaStaffStore((s) => s.items)
  const [selectedThreadId, setSelectedThreadId] = useState(null)

  const childById = new Map(children.map((c) => [c.id, c]))
  const groupById = new Map(groups.map((g) => [g.id, g]))
  const staffById = new Map(staff.map((s) => [s.id, s]))
  const lastReadByThread = new Map(reads.map((r) => [r.threadId, r.lastReadAt]))

  const opaNamesForGroup = (groupId) =>
    staffLinks
      .filter((l) => l.groupId === groupId)
      .map((l) => staffById.get(l.staffId)?.fullName)
      .filter(Boolean)
      .join(', ')

  const sorted = [...threads].sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))

  const labelsFor = (thread) => {
    if (role === BOGCHA_ROLES.PARENT) {
      return { primaryLabel: FEEDBACK_RECIPIENT_LABELS[thread.recipient], secondaryLabel: '' }
    }
    const child = childById.get(thread.childId)
    const group = groupById.get(thread.groupId)
    const secondary =
      role === BOGCHA_ROLES.SUPERADMIN
        ? [group?.name, opaNamesForGroup(thread.groupId) || "opa biriktirilmagan"].filter(Boolean).join(' · ')
        : (group?.name ?? '')
    return { primaryLabel: child?.fullName ?? 'Bola', secondaryLabel: secondary }
  }

  return (
    <div className="space-y-4">
      {role === BOGCHA_ROLES.PARENT && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{threads.length} ta murojaat</p>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="gap-1.5">
              <Link to={BOGCHA_ROUTES.childProfile(childId)}>
                <Baby className="size-4" /> Bolam profili
              </Link>
            </Button>
            <NewThreadDialog />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[22rem_1fr]">
        <Card className={selectedThreadId ? 'hidden lg:block' : ''}>
          <CardContent className="max-h-[36rem] space-y-1 overflow-y-auto p-2 lg:max-h-[42rem]">
            {sorted.length === 0 ? (
              <EmptyState
                icon={MessageCircle}
                title="Hali murojaat yo'q"
                description={
                  role === BOGCHA_ROLES.PARENT
                    ? "Bogcha opa yoki direktorga birinchi murojaatingizni yuboring."
                    : "Sizga hali murojaat kelmagan."
                }
                action={role === BOGCHA_ROLES.PARENT ? <NewThreadDialog /> : undefined}
              />
            ) : (
              sorted.map((thread) => {
                const { primaryLabel, secondaryLabel } = labelsFor(thread)
                const unread = (lastReadByThread.get(thread.id) ?? '') < thread.lastMessageAt
                return (
                  <ThreadListItem
                    key={thread.id}
                    thread={thread}
                    primaryLabel={primaryLabel}
                    secondaryLabel={secondaryLabel}
                    selected={selectedThreadId === thread.id}
                    unread={unread}
                    onClick={() => setSelectedThreadId(thread.id)}
                  />
                )
              })
            )}
          </CardContent>
        </Card>

        <Card className={selectedThreadId ? '' : 'hidden lg:block'}>
          <CardContent className="p-0">
            {selectedThreadId ? (
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-border/60 p-3 lg:hidden">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedThreadId(null)} aria-label="Orqaga">
                      <ArrowLeft className="size-4" />
                    </Button>
                    <p className="text-sm font-medium text-foreground">Suhbat</p>
                  </div>
                  {role === BOGCHA_ROLES.SUPERADMIN && (
                    <DeleteThreadDialog threadId={selectedThreadId} onDeleted={() => setSelectedThreadId(null)} />
                  )}
                </div>
                {role === BOGCHA_ROLES.SUPERADMIN && (
                  <div className="hidden items-center justify-end border-b border-border/60 p-2 lg:flex">
                    <DeleteThreadDialog threadId={selectedThreadId} onDeleted={() => setSelectedThreadId(null)} />
                  </div>
                )}
                <ChatThread threadId={selectedThreadId} />
              </div>
            ) : (
              <EmptyState icon={MessageCircle} title="Suhbatni tanlang" description="Chapdagi ro'yxatdan murojaatni tanlang." />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
