'use node'

import { v } from 'convex/values'
import { action } from './_generated/server'
import { internal } from './_generated/api'
import { hashPassword } from './lib/passwords'

/** Superadmin-only: creates a new teacher account. Returns the plaintext password once
 * so the superadmin can hand it to the new teacher — only the hash is ever persisted. */
export const createTeacher = action({
  args: { token: v.string(), username: v.string(), password: v.string(), fullName: v.string() },
  handler: async (ctx, { token, username, password, fullName }) => {
    await ctx.runQuery(internal.auth.requireSuperAdminToken, { token })

    const trimmedUsername = username.trim()
    const existing = await ctx.runQuery(internal.auth.getTeacherByUsername, { username: trimmedUsername })
    if (existing) return { ok: false, error: 'Bu username band' }

    const passwordHash = hashPassword(password)
    const id = await ctx.runMutation(internal.auth.insertTeacher, {
      username: trimmedUsername,
      passwordHash,
      fullName,
      isSuperAdmin: false,
    })
    return { ok: true, id, username: trimmedUsername, password }
  },
})

/** Superadmin-only: resets another teacher's password and returns the new plaintext value. */
export const resetTeacherPassword = action({
  args: { token: v.string(), teacherId: v.id('teachers'), newPassword: v.string() },
  handler: async (ctx, { token, teacherId, newPassword }) => {
    await ctx.runQuery(internal.auth.requireSuperAdminToken, { token })
    const passwordHash = hashPassword(newPassword)
    await ctx.runMutation(internal.teachers.updatePasswordHash, { id: teacherId, passwordHash })
    return { ok: true, password: newPassword }
  },
})

/** Superadmin-only: grants or revokes superadmin on another (or the caller's own) account.
 * Refuses to revoke the last remaining superadmin so the system can never end up locked
 * out of teacher management. */
export const setSuperAdmin = action({
  args: { token: v.string(), teacherId: v.id('teachers'), isSuperAdmin: v.boolean() },
  handler: async (ctx, { token, teacherId, isSuperAdmin }) => {
    await ctx.runQuery(internal.auth.requireSuperAdminToken, { token })

    if (!isSuperAdmin) {
      const superAdminCount = await ctx.runQuery(internal.teachers.countSuperAdmins, {})
      if (superAdminCount <= 1) return { ok: false, error: 'Kamida bitta superadmin qolishi kerak' }
    }

    await ctx.runMutation(internal.teachers.updateSuperAdminFlag, { id: teacherId, isSuperAdmin })
    return { ok: true }
  },
})
