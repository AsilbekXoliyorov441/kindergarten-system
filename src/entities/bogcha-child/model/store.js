import { useQuery, useMutation, useAction } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { mapId } from '@/shared/lib/convex/mapId'
import { BOGCHA_ROLES } from '@/shared/config/bogcha'

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
    archive: (childId, reason) => archiveMutation({ token, childId, reason }),
    transferGroup: (childId, groupId) => transferGroupMutation({ token, childId, groupId }),
  })
}

export function useChildrenForGroup(groupId) {
  const token = useBogchaAuthStore((s) => s.token)
  return (useQuery(api.bogcha.children.listForGroup, token && groupId ? { token, groupId } : 'skip') ?? []).map(mapId)
}

/** `listAllForStats` is superadmin-only on the backend (it returns archived children too,
 * unlike the scoped roster queries above) — gated here the same way as the staff store. */
export function useAllChildrenForStats() {
  const token = useBogchaAuthStore((s) => s.token)
  const isSuperAdmin = useBogchaAuthStore((s) => s.role) === BOGCHA_ROLES.SUPERADMIN
  const items = useQuery(api.bogcha.children.listAllForStats, token && isSuperAdmin ? { token } : 'skip')
  return (items ?? []).map(mapId)
}
