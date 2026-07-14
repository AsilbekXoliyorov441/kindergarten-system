import { useQuery, useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { DEFAULT_FEE_PER_DAY } from '@/shared/config/bogcha'

export function useBogchaSettingsStore(selector) {
  const token = useBogchaAuthStore((s) => s.token)
  const settings = useQuery(api.bogcha.settings.get, token ? { token } : 'skip')
  const updateMutation = useMutation(api.bogcha.settings.update)

  return selector({
    feePerDay: settings?.feePerDay ?? DEFAULT_FEE_PER_DAY,
    update: (feePerDay) => updateMutation({ token, feePerDay }),
  })
}
