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

export const resetPassword = action({
  args: { token: v.string(), staffId: v.id('bogchaStaff') },
  handler: async (ctx, { token, staffId }) => {
    await ctx.runQuery(internal.bogcha.staff.requireSuperAdminToken, { token })

    const staff = await ctx.runQuery(internal.bogcha.staff.getById, { id: staffId })
    if (!staff) throw new Error('Xodim topilmadi')

    const passwordHash = hashPassword(staff.username)
    await ctx.runMutation(internal.bogcha.staff.updatePasswordHash, { id: staffId, passwordHash })
    return { username: staff.username, password: staff.username }
  },
})
