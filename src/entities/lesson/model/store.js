import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useAuthStore } from '@/entities/session/model/store'
import { mapId } from '@/shared/lib/convex/mapId'

export function useLessonStore(selector) {
  const token = useAuthStore((s) => s.token)
  const items = (useQuery(api.lessons.list) ?? []).map(mapId)
  const saveSessionMutation = useMutation(api.lessons.saveSession)
  const removeCascadeMutation = useMutation(api.lessons.removeCascade)

  return selector({
    items,
    saveSession: (groupId, scores) => saveSessionMutation({ token, groupId, scores }),
    removeMany: (ids) => removeCascadeMutation({ token, ids }),
  })
}
