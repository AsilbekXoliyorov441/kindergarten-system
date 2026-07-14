import { useQuery, useMutation, useAction } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { mapId } from '@/shared/lib/convex/mapId'
import { BOGCHA_ROLES } from '@/shared/config/bogcha'

/** `staff.list` is superadmin-only on the backend — gated here so this hook is safe to
 * call from any role (it just returns an empty list for non-superadmins) instead of
 * throwing and crashing whatever page happens to call it. */
export function useBogchaStaffStore(selector) {
  const token = useBogchaAuthStore((s) => s.token)
  const isSuperAdmin = useBogchaAuthStore((s) => s.role) === BOGCHA_ROLES.SUPERADMIN
  const items = (useQuery(api.bogcha.staff.list, token && isSuperAdmin ? { token } : 'skip') ?? []).map(mapId)
  const createAction = useAction(api.bogcha.staffActions.create)
  const updateCredentialsAction = useAction(api.bogcha.staffActions.updateCredentials)
  const updateStatusMutation = useMutation(api.bogcha.staff.updateStatus)

  return selector({
    items,
    create: (fullName, role, phone) => createAction({ token, fullName, role, phone }),
    updateCredentials: (staffId, username, password) => updateCredentialsAction({ token, staffId, username, password }),
    updateStatus: (id, status) => updateStatusMutation({ token, id, status }),
  })
}
