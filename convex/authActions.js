'use node'

import { v } from 'convex/values'
import { action, internalAction } from './_generated/server'
import { internal } from './_generated/api'
import { hashPassword, verifyPassword, generateToken } from './lib/passwords'

export const loginTeacher = action({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, { username, password }) => {
    const teacher = await ctx.runQuery(internal.auth.getTeacherByUsername, { username: username.trim() })
    if (!teacher || !verifyPassword(password, teacher.passwordHash)) {
      return { ok: false, error: "Login yoki parol noto'g'ri" }
    }
    const token = generateToken()
    await ctx.runMutation(internal.auth.createSession, { token, role: 'teacher', userId: teacher._id })
    return { ok: true, token, role: 'teacher', userId: teacher._id, fullName: teacher.fullName, username: teacher.username }
  },
})

export const loginStudent = action({
  args: { login: v.string(), password: v.string() },
  handler: async (ctx, { login, password }) => {
    const student = await ctx.runQuery(internal.students.getByLogin, { login: login.trim() })
    if (!student || student.status !== 'active' || !verifyPassword(password, student.passwordHash)) {
      return { ok: false, error: "Login yoki parol noto'g'ri" }
    }
    const token = generateToken()
    await ctx.runMutation(internal.auth.createSession, { token, role: 'student', userId: student._id })
    return { ok: true, token, role: 'student', userId: student._id, fullName: student.fullName }
  },
})

/** One-time bootstrap — not reachable from the client. Run via:
 * npx convex run authActions:seedTeacher '{"username":"ustoz","password":"ustoz2024","fullName":"Sardor Aliyev"}' */
export const seedTeacher = internalAction({
  args: { username: v.string(), password: v.string(), fullName: v.string() },
  handler: async (ctx, { username, password, fullName }) => {
    const existing = await ctx.runQuery(internal.auth.getTeacherByUsername, { username })
    if (existing) return { ok: false, error: 'Teacher already exists' }
    const passwordHash = hashPassword(password)
    await ctx.runMutation(internal.auth.insertTeacher, { username, passwordHash, fullName })
    return { ok: true }
  },
})
