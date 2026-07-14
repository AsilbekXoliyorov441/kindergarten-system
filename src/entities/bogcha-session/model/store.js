import { create } from 'zustand'
import { api } from '@convex/_generated/api'
import { convexClient } from '@/shared/lib/convex/client'

const TOKEN_KEY = 'bogcha:token'

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function writeToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* noop */
  }
}

export const useBogchaAuthStore = create((set, get) => ({
  token: null,
  role: null,
  userId: null,
  fullName: null,
  username: null,
  childId: null,
  hydrated: false,

  async hydrate() {
    const token = readToken()
    if (!token) {
      set({ hydrated: true })
      return
    }
    const who = await convexClient.query(api.bogcha.auth.whoAmI, { token })
    if (!who) {
      writeToken(null)
      set({ hydrated: true })
      return
    }
    set({
      token,
      role: who.role,
      userId: who.userId,
      fullName: who.fullName,
      username: who.username ?? null,
      childId: who.childId ?? null,
      hydrated: true,
    })
  },

  async login(username, password) {
    const result = await convexClient.action(api.bogcha.authActions.login, { username, password })
    if (!result.ok) return { ok: false, error: result.error }
    writeToken(result.token)
    set({
      token: result.token,
      role: result.role,
      userId: result.userId,
      fullName: result.fullName,
      username: result.username ?? null,
      childId: result.childId ?? null,
    })
    return { ok: true }
  },

  logout() {
    const token = get().token
    writeToken(null)
    set({ token: null, role: null, userId: null, fullName: null, username: null, childId: null })
    if (token) convexClient.mutation(api.bogcha.auth.logout, { token }).catch(() => {})
  },
}))
