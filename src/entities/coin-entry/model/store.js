import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useAuthStore } from '@/entities/session/model/store'
import { mapId } from '@/shared/lib/convex/mapId'

export function useCoinEntryStore(selector) {
  const token = useAuthStore((s) => s.token)
  const items = (useQuery(api.coinEntries.list, token ? { token } : 'skip') ?? []).map(mapId)
  return selector({ items })
}
