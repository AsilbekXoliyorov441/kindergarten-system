import { useQuery, useMutation, useAction } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { mapId } from '@/shared/lib/convex/mapId'

export function useParentsForGroup(groupId) {
  const token = useBogchaAuthStore((s) => s.token)
  const items = useQuery(api.bogcha.parents.listForGroup, token && groupId ? { token, groupId } : 'skip')
  return (items ?? []).map(mapId)
}

export function useUpdateParentCredentials() {
  const token = useBogchaAuthStore((s) => s.token)
  const updateAction = useAction(api.bogcha.parentsActions.updateCredentials)
  return (parentId, username, password) => updateAction({ token, parentId, username, password })
}

export function useDeleteParent() {
  const token = useBogchaAuthStore((s) => s.token)
  const removeMutation = useMutation(api.bogcha.parents.remove)
  return (parentId) => removeMutation({ token, parentId })
}
