'use node'

import { v, ConvexError } from 'convex/values'
import { action } from '../_generated/server'
import { internal } from '../_generated/api'
import { verifyPassword } from '../lib/passwords'

/** Superadmin-only, destructive: wipes every group/child/parent/attendance/thread
 * record. Requires the caller to re-type their own username and password — a valid
 * session token alone is not enough — so a left-open tab or hijacked token can't trigger
 * it by itself. Staff logins and the fee setting are left untouched. */
export const resetAllData = action({
  args: { token: v.string(), username: v.string(), password: v.string() },
  handler: async (ctx, { token, username, password }) => {
    const staff = await ctx.runQuery(internal.bogcha.staff.getSuperAdminForToken, { token })
    if (!staff || staff.username !== username.trim() || !verifyPassword(password, staff.passwordHash)) {
      throw new ConvexError("Login yoki parol noto'g'ri")
    }

    await ctx.runMutation(internal.bogcha.reset.wipeOperationalData, {})
    return { ok: true }
  },
})
