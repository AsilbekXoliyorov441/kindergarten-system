import { useQuery, useMutation, useAction } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { mapId } from '@/shared/lib/convex/mapId'

export function useBogchaChildStore(selector) {
  const token = useBogchaAuthStore((s) => s.token)
  const items = (useQuery(api.bogcha.children.list, token ? { token } : 'skip') ?? []).map(mapId)
  const createAction = useAction(api.bogcha.childrenActions.create)
  const archiveMutation = useMutation(api.bogcha.children.archive)
  const transferGroupMutation = useMutation(api.bogcha.children.transferGroup)

  return selector({
    items,
    create: (groupId, fullName, birthDate, parentFullName, parentPhone) =>
      createAction({ token, groupId, fullName, birthDate, parentFullName, parentPhone }),
    archive: (childId) => archiveMutation({ token, childId }),
    transferGroup: (childId, groupId) => transferGroupMutation({ token, childId, groupId }),
  })
}

export function useChildrenForGroup(groupId) {
  const token = useBogchaAuthStore((s) => s.token)
  return (useQuery(api.bogcha.children.listForGroup, token && groupId ? { token, groupId } : 'skip') ?? []).map(mapId)
}
