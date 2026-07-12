import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useAuthStore } from '@/entities/session/model/store'
import { mapId } from '@/shared/lib/convex/mapId'

export function useTransactionStore(selector) {
  const token = useAuthStore((s) => s.token)
  const items = (useQuery(api.transactions.list, token ? { token } : 'skip') ?? []).map(mapId)
  const redeemGiftMutation = useMutation(api.transactions.redeemGift)

  return selector({
    items,
    redeemGift: (studentId, giftId) => redeemGiftMutation({ token, studentId, giftId }),
  })
}
