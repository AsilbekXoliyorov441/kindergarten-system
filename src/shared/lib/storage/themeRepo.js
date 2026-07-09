import { STORAGE_KEYS } from '@/shared/lib/storage/keys'

export const themeRepo = {
  get() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.THEME)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  set(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme))
    } catch (err) {
      console.error('coin-system: failed to persist theme', err)
    }
  },
}
