import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { mapId } from '@/shared/lib/convex/mapId'

export function useMessagesForThread(threadId) {
  const token = useBogchaAuthStore((s) => s.token)
  const items = useQuery(api.bogcha.messages.listForThread, token && threadId ? { token, threadId } : 'skip')
  return (items ?? []).map(mapId).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export function useSendMessage() {
  const token = useBogchaAuthStore((s) => s.token)
  const sendMutation = useMutation(api.bogcha.messages.send)
  return (threadId, text) => sendMutation({ token, threadId, text })
}
