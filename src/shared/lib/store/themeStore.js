import { create } from 'zustand'
import { themeRepo } from '@/shared/lib/storage/themeRepo'

function applyThemeClass(theme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

function getInitialTheme() {
  const stored = themeRepo.get()
  if (stored === 'light' || stored === 'dark') return stored
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),

  setTheme(theme) {
    themeRepo.set(theme)
    applyThemeClass(theme)
    set({ theme })
  },

  toggleTheme() {
    get().setTheme(get().theme === 'dark' ? 'light' : 'dark')
  },
}))
