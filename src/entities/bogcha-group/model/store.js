import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { mapId } from '@/shared/lib/convex/mapId'
import { BOGCHA_ROLES } from '@/shared/config/bogcha'

export function useBogchaGroupStore(selector) {
  const token = useBogchaAuthStore((s) => s.token)
  const role = useBogchaAuthStore((s) => s.role)
  const isSuperAdmin = role === BOGCHA_ROLES.SUPERADMIN
  const items = (useQuery(api.bogcha.groups.list, token ? { token } : 'skip') ?? []).map(mapId)
  const staffLinks = (useQuery(api.bogcha.groups.listStaffLinks, token && isSuperAdmin ? { token } : 'skip') ?? []).map(mapId)
  const createMutation = useMutation(api.bogcha.groups.create)
  const renameMutation = useMutation(api.bogcha.groups.rename)
  const archiveMutation = useMutation(api.bogcha.groups.archive)
  const assignStaffMutation = useMutation(api.bogcha.groups.assignStaff)
  const unassignStaffMutation = useMutation(api.bogcha.groups.unassignStaff)

  return selector({
    items,
    staffLinks,
    create: (name) => createMutation({ token, name }),
    rename: (id, name) => renameMutation({ token, id, name }),
    archive: (id) => archiveMutation({ token, id }),
    assignStaff: (groupId, staffId) => assignStaffMutation({ token, groupId, staffId }),
    unassignStaff: (groupId, staffId) => unassignStaffMutation({ token, groupId, staffId }),
  })
}
