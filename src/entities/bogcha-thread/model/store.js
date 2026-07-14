import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { mapId } from '@/shared/lib/convex/mapId'
import { BOGCHA_ROLES } from '@/shared/config/bogcha'

function useThreadsQuery(query) {
  const token = useBogchaAuthStore((s) => s.token)
  return (useQuery(query, token ? { token } : 'skip') ?? []).map(mapId)
}

export function useThreadsForParent() {
  return useThreadsQuery(api.bogcha.threads.listForParent)
}

export function useThreadsForOpa() {
  return useThreadsQuery(api.bogcha.threads.listForOpa)
}

export function useThreadsForDirector() {
  return useThreadsQuery(api.bogcha.threads.listAll)
}

/** Role-aware: returns whichever thread list applies to the current session. Every
 * query reference below is always passed to `useQuery` (never swapped for `null`) —
 * only the args are gated with `'skip'` per role, since `useQuery` requires a real
 * function reference at each call site. */
export function useMyThreads() {
  const token = useBogchaAuthStore((s) => s.token)
  const role = useBogchaAuthStore((s) => s.role)

  const parentThreads = (
    useQuery(api.bogcha.threads.listForParent, token && role === BOGCHA_ROLES.PARENT ? { token } : 'skip') ?? []
  ).map(mapId)
  const opaThreads = (
    useQuery(api.bogcha.threads.listForOpa, token && role === BOGCHA_ROLES.OPA ? { token } : 'skip') ?? []
  ).map(mapId)
  const directorThreads = (
    useQuery(api.bogcha.threads.listAll, token && role === BOGCHA_ROLES.SUPERADMIN ? { token } : 'skip') ?? []
  ).map(mapId)

  if (role === BOGCHA_ROLES.PARENT) return parentThreads
  if (role === BOGCHA_ROLES.OPA) return opaThreads
  if (role === BOGCHA_ROLES.SUPERADMIN) return directorThreads.filter((t) => t.recipient === 'director')
  return []
}

export function useCreateThread() {
  const token = useBogchaAuthStore((s) => s.token)
  const createMutation = useMutation(api.bogcha.threads.createThread)
  return (recipient, category, text) => createMutation({ token, recipient, category, text })
}

export function useMarkThreadRead() {
  const token = useBogchaAuthStore((s) => s.token)
  const markMutation = useMutation(api.bogcha.threads.markRead)
  return (threadId) => markMutation({ token, threadId })
}

/** All read-receipts belonging to the current user, for computing unread counts
 * client-side against each thread's `lastMessageAt` — same "raw data in, derive in the
 * client" convention as the attendance stats. */
export function useMyThreadReads() {
  const token = useBogchaAuthStore((s) => s.token)
  return (useQuery(api.bogcha.threads.listMyReads, token ? { token } : 'skip') ?? []).map(mapId)
}

export function useUnreadThreadCount(threads) {
  const reads = useMyThreadReads()
  const lastReadByThread = new Map(reads.map((r) => [r.threadId, r.lastReadAt]))
  return threads.filter((t) => (lastReadByThread.get(t.id) ?? '') < t.lastMessageAt).length
}
