import { query, mutation, internalQuery, internalMutation } from '../_generated/server'
import { v, ConvexError } from 'convex/values'
import { resolveSession } from './lib/authz'

export const getStaffByUsername = internalQuery({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    return await ctx.db
      .query('bogchaStaff')
      .withIndex('by_username', (q) => q.eq('username', username))
      .unique()
  },
})

export const getParentByUsername = internalQuery({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    return await ctx.db
      .query('bogchaParents')
      .withIndex('by_username', (q) => q.eq('username', username))
      .unique()
  },
})

export const insertStaff = internalMutation({
  args: {
    username: v.string(),
    passwordHash: v.string(),
    fullName: v.string(),
    role: v.union(v.literal('superadmin'), v.literal('opa')),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Re-check uniqueness (against both staff and parents) inside the mutation itself —
    // Convex mutations are serialized, so this is the one place that's actually race-free,
    // unlike the pre-check the calling action already did against a possibly-stale read.
    const [staffClash, parentClash] = await Promise.all([
      ctx.db.query('bogchaStaff').withIndex('by_username', (q) => q.eq('username', args.username)).unique(),
      ctx.db.query('bogchaParents').withIndex('by_username', (q) => q.eq('username', args.username)).unique(),
    ])
    if (staffClash || parentClash) throw new ConvexError('Bu login band')

    return await ctx.db.insert('bogchaStaff', { ...args, status: 'active' })
  },
})

export const createSession = internalMutation({
  args: {
    token: v.string(),
    role: v.union(v.literal('superadmin'), v.literal('opa'), v.literal('parent')),
    userId: v.union(v.id('bogchaStaff'), v.id('bogchaParents')),
  },
  handler: async (ctx, { token, role, userId }) => {
    await ctx.db.insert('bogchaSessions', { token, role, userId, createdAt: Date.now() })
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

    if (session.role === 'parent') {
      const parent = await ctx.db.get(session.userId)
      if (!parent) return null
      return {
        role: 'parent',
        userId: session.userId,
        fullName: parent.fullName,
        username: parent.username,
        childId: parent.childId,
      }
    }

    const staff = await ctx.db.get(session.userId)
    if (!staff || staff.status !== 'active') return null
    return {
      role: staff.role,
      userId: session.userId,
      fullName: staff.fullName,
      username: staff.username,
    }
  },
})
