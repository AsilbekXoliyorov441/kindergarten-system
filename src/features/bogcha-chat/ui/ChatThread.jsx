import { useEffect, useRef, useState } from 'react'
import { Send, Eye, MessageCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { EmptyState } from '@/shared/ui/empty-state'
import { cn } from '@/shared/lib/utils'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { useMessagesForThread, useSendMessage } from '@/entities/bogcha-message/model/store'
import { useMarkThreadRead } from '@/entities/bogcha-thread/model/store'

const ROLE_LABELS = { parent: "Ota-ona", opa: 'Bogcha opa', superadmin: 'Direktor' }

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function formatTime(isoString) {
  const d = new Date(isoString)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function ChatThread({ threadId, readOnly = false }) {
  const userId = useBogchaAuthStore((s) => s.userId)
  const fullName = useBogchaAuthStore((s) => s.fullName)
  const messages = useMessagesForThread(threadId)
  const sendMessage = useSendMessage()
  const markRead = useMarkThreadRead()
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    // Re-marks read whenever a new message arrives on the thread that's already open
    // (not just when switching threads), so the unread badge doesn't stay lit while
    // the conversation is being actively viewed.
    if (threadId) markRead(threadId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, messages.length])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setSubmitting(true)
    try {
      await sendMessage(threadId, trimmed)
      setText('')
      // Sending bumps the thread's lastMessageAt — re-mark read so our own message
      // doesn't show up as "unread" to us a moment later.
      await markRead(threadId)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex h-full min-h-112 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <EmptyState icon={MessageCircle} title="Xabarlar yo'q" description="Suhbat hali boshlanmagan." />
        ) : (
          messages.map((message) => {
            const isMine = message.senderId === userId
            return (
              <div key={message.id} className={cn('flex items-end gap-2', isMine ? 'flex-row-reverse' : 'flex-row')}>
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="text-xs">{getInitials(isMine ? fullName ?? '?' : ROLE_LABELS[message.senderRole])}</AvatarFallback>
                </Avatar>
                <div className={cn('max-w-[75%] space-y-1', isMine ? 'items-end text-right' : 'items-start text-left')}>
                  <p className="text-[11px] text-muted-foreground">{ROLE_LABELS[message.senderRole]}</p>
                  <div
                    className={cn(
                      'whitespace-pre-wrap wrap-break-word rounded-2xl px-3.5 py-2.5 text-sm shadow-sm',
                      isMine ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                    )}
                  >
                    {message.text}
                  </div>
                  <p className="text-[10px] text-muted-foreground/70">{formatTime(message.createdAt)}</p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {readOnly ? (
        <div className="flex items-center justify-center gap-1.5 border-t border-border/60 p-3 text-xs text-muted-foreground">
          <Eye className="size-3.5" /> Faqat kuzatuv rejimi — javob yozib bo'lmaydi
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-border/60 p-3">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Xabar yozing..."
            className="min-h-11 flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button type="submit" size="icon" disabled={submitting || !text.trim()} aria-label="Yuborish">
            <Send className="size-4" />
          </Button>
        </form>
      )}
    </div>
  )
}
