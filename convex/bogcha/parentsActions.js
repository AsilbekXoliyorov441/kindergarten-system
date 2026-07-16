'use node'

import { v } from 'convex/values'
import { action } from '../_generated/server'
import { internal } from '../_generated/api'
import { hashPassword } from '../lib/passwords'

/** Superadmin-only: sets a custom username and/or password for a parent account
 * (rather than just regenerating the auto-assigned one). Either field may be omitted
 * to leave it unchanged. */
export const updateCredentials = action({
  args: {
    token: v.string(),
    parentId: v.id('bogchaParents'),
    username: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, { token, parentId, username, password }) => {
    await ctx.runQuery(internal.bogcha.parents.requireSuperAdminToken, { token })

    const trimmedUsername = username?.trim()
    if (trimmedUsername) {
      const [takenByParent, takenByStaff] = await Promise.all([
        ctx.runQuery(internal.bogcha.parents.isUsernameTaken, { username: trimmedUsername, exceptParentId: parentId }),
        ctx.runQuery(internal.bogcha.staff.isUsernameTaken, { username: trimmedUsername }),
      ])
      if (takenByParent || takenByStaff) throw new Error("Bu login band")
    }

    const passwordHash = password?.trim() ? hashPassword(password.trim()) : undefined
    await ctx.runMutation(internal.bogcha.parents.updateCredentials, {
      id: parentId,
      username: trimmedUsername || undefined,
      passwordHash,
    })

    return { ok: true }
  },
})
