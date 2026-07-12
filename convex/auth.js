import { query, mutation, internalQuery, internalMutation } from './_generated/server'
import { v } from 'convex/values'
import { resolveSession, requireTeacher } from './lib/authz'
import { requireSuperAdmin } from './lib/scoping'

export const getTeacherByUsername = internalQuery({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    return await ctx.db
      .query('teachers')
      .withIndex('by_username', (q) => q.eq('username', username))
      .unique()
  },
})

export const insertTeacher = internalMutation({
  args: {
    username: v.string(),
    passwordHash: v.string(),
    fullName: v.string(),
    isSuperAdmin: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('teachers', args)
  },
})

export const createSession = internalMutation({
  args: {
    token: v.string(),
    role: v.union(v.literal('teacher'), v.literal('student')),
    userId: v.union(v.id('teachers'), v.id('students')),
  },
  handler: async (ctx, { token, role, userId }) => {
    await ctx.db.insert('sessions', { token, role, userId, createdAt: Date.now() })
  },
})

/** Used from Node actions (which have no `ctx.db`) to enforce the teacher role before hashing/writing. */
export const requireTeacherToken = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireTeacher(ctx, token)
  },
})

/** Used from Node actions (which have no `ctx.db`) to enforce the superadmin role. */
export const requireSuperAdminToken = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireSuperAdmin(ctx, token)
  },
})

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await resolveSession(ctx, token)
    if (session) await ctx.db.delete(session._id)
  },
})

export const whoAmI = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, { token }) => {
    const session = await resolveSession(ctx, token)
    if (!session) return null

    if (session.role === 'teacher') {
      const teacher = await ctx.db.get(session.userId)
      if (!teacher) return null
      return {
        role: 'teacher',
        userId: session.userId,
        fullName: teacher.fullName,
        username: teacher.username,
        isSuperAdmin: !!teacher.isSuperAdmin,
      }
    }

    const student = await ctx.db.get(session.userId)
    if (!student || student.status !== 'active') return null
    return { role: 'student', userId: session.userId, fullName: student.fullName }
  },
})

export const updateTeacherProfile = mutation({
  args: { token: v.string(), fullName: v.string() },
  handler: async (ctx, { token, fullName }) => {
    const session = await requireTeacher(ctx, token)
    await ctx.db.patch(session.userId, { fullName })
  },
})
