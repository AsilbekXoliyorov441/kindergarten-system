import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import { mapId } from '@/shared/lib/convex/mapId'

export function useCoinEntryStore(selector) {
  const items = (useQuery(api.coinEntries.list) ?? []).map(mapId)
  return selector({ items })
}
