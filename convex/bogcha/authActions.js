'use node'

import { v } from 'convex/values'
import { action, internalAction } from '../_generated/server'
import { internal } from '../_generated/api'
import { hashPassword, verifyPassword, generateToken } from '../lib/passwords'

/** Single login form for all three bogcha roles — tries a staff account (superadmin/opa)
 * first, then a parent account, so the client never has to know the role up front. */
export const login = action({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, { username, password }) => {
    const trimmed = username.trim()

    const staff = await ctx.runQuery(internal.bogcha.auth.getStaffByUsername, { username: trimmed })
    if (staff && staff.status === 'active' && verifyPassword(password, staff.passwordHash)) {
      const token = generateToken()
      await ctx.runMutation(internal.bogcha.auth.createSession, { token, role: staff.role, userId: staff._id })
      return { ok: true, token, role: staff.role, userId: staff._id, fullName: staff.fullName, username: staff.username }
    }

    const parent = await ctx.runQuery(internal.bogcha.auth.getParentByUsername, { username: trimmed })
    if (parent && verifyPassword(password, parent.passwordHash)) {
      const token = generateToken()
      await ctx.runMutation(internal.bogcha.auth.createSession, { token, role: 'parent', userId: parent._id })
      return {
        ok: true,
        token,
        role: 'parent',
        userId: parent._id,
        fullName: parent.fullName,
        username: parent.username,
        childId: parent.childId,
      }
    }

    return { ok: false, error: "Login yoki parol noto'g'ri" }
  },
})

/** One-time bootstrap — not reachable from the client. Run via:
 * npx convex run bogcha/authActions:seedSuperAdmin '{"username":"admin","password":"...","fullName":"..."}' */
export const seedSuperAdmin = internalAction({
  args: { username: v.string(), password: v.string(), fullName: v.string() },
  handler: async (ctx, { username, password, fullName }) => {
    const existing = await ctx.runQuery(internal.bogcha.auth.getStaffByUsername, { username })
    if (existing) return { ok: false, error: 'Bu username allaqachon mavjud' }
    const passwordHash = hashPassword(password)
    await ctx.runMutation(internal.bogcha.auth.insertStaff, {
      username,
      passwordHash,
      fullName,
      role: 'superadmin',
    })
    return { ok: true }
  },
})
