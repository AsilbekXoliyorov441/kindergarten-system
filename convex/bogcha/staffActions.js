'use node'

import { v } from 'convex/values'
import { action } from '../_generated/server'
import { internal } from '../_generated/api'
import { hashPassword } from '../lib/passwords'
import { generateLoginFromName } from '../../src/shared/lib/credentials'

/** Returns the plaintext username/password once so the superadmin can hand them to the
 * opa — only the hash is ever persisted. Password always equals the username. */
export const create = action({
  args: {
    token: v.string(),
    fullName: v.string(),
    role: v.union(v.literal('superadmin'), v.literal('opa')),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, { token, fullName, role, phone }) => {
    await ctx.runQuery(internal.bogcha.staff.requireSuperAdminToken, { token })

    const existingUsernames = await ctx.runQuery(internal.bogcha.staff.listUsernames, {})
    const username = generateLoginFromName(fullName, existingUsernames, 'xodim')
    const passwordHash = hashPassword(username)

    const id = await ctx.runMutation(internal.bogcha.auth.insertStaff, { username, passwordHash, fullName, role, phone })
    return { id, username, password: username }
  },
})

/** Superadmin-only: sets a custom username and/or password for a staff (opa/superadmin)
 * account — either field may be omitted to leave it unchanged. */
export const updateCredentials = action({
  args: {
    token: v.string(),
    staffId: v.id('bogchaStaff'),
    username: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, { token, staffId, username, password }) => {
    await ctx.runQuery(internal.bogcha.staff.requireSuperAdminToken, { token })

    const trimmedUsername = username?.trim()
    if (trimmedUsername) {
      const taken = await ctx.runQuery(internal.bogcha.staff.isUsernameTaken, {
        username: trimmedUsername,
        exceptStaffId: staffId,
      })
      if (taken) throw new Error("Bu login band")
    }

    const passwordHash = password?.trim() ? hashPassword(password.trim()) : undefined
    await ctx.runMutation(internal.bogcha.staff.updateCredentials, {
      id: staffId,
      username: trimmedUsername || undefined,
      passwordHash,
    })

    return { ok: true }
  },
})
