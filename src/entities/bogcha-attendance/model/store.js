import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { mapId } from '@/shared/lib/convex/mapId'

export function useAttendanceForGroupMonth(groupId, monthKey) {
  const token = useBogchaAuthStore((s) => s.token)
  const items = useQuery(
    api.bogcha.attendance.listForGroupMonth,
    token && groupId && monthKey ? { token, groupId, monthKey } : 'skip',
  )
  return (items ?? []).map(mapId)
}

export function useAttendanceForChildMonth(childId, monthKey) {
  const token = useBogchaAuthStore((s) => s.token)
  const items = useQuery(
    api.bogcha.attendance.listForChildMonth,
    token && childId && monthKey ? { token, childId, monthKey } : 'skip',
  )
  return (items ?? []).map(mapId)
}

export function useAttendanceForMonth(monthKey) {
  const token = useBogchaAuthStore((s) => s.token)
  const items = useQuery(api.bogcha.attendance.listForMonth, token && monthKey ? { token, monthKey } : 'skip')
  return (items ?? []).map(mapId)
}

export function useMarkAttendance() {
  const token = useBogchaAuthStore((s) => s.token)
  const markMutation = useMutation(api.bogcha.attendance.mark)
  return (childId, date, status, reason) => markMutation({ token, childId, date, status, reason })
}
