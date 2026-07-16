import { query, mutation, internalQuery, internalMutation } from '../_generated/server'
import { v } from 'convex/values'
import { requireSuperAdmin } from './lib/authz'

function stripCredentials(staff) {
  const rest = { ...staff }
  delete rest.passwordHash
  return rest
}

export const list = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireSuperAdmin(ctx, token)
    const staff = await ctx.db.query('bogchaStaff').collect()
    return staff.map(stripCredentials)
  },
})

export const listUsernames = internalQuery({
  args: {},
  handler: async (ctx) => {
    const staff = await ctx.db.query('bogchaStaff').collect()
    return staff.map((s) => s.username)
  },
})

export const updateStatus = mutation({
  args: { token: v.string(), id: v.id('bogchaStaff'), status: v.union(v.literal('active'), v.literal('archived')) },
  handler: async (ctx, { token, id, status }) => {
    await requireSuperAdmin(ctx, token)
    await ctx.db.patch(id, { status })
  },
})

export const updateCredentials = internalMutation({
  args: {
    id: v.id('bogchaStaff'),
    username: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
  },
  handler: async (ctx, { id, username, passwordHash }) => {
    const patch = {}
    if (username !== undefined) patch.username = username
    if (passwordHash !== undefined) patch.passwordHash = passwordHash
    await ctx.db.patch(id, patch)
  },
})

export const isUsernameTaken = internalQuery({
  args: { username: v.string(), exceptStaffId: v.optional(v.id('bogchaStaff')) },
  handler: async (ctx, { username, exceptStaffId }) => {
    const existing = await ctx.db
      .query('bogchaStaff')
      .withIndex('by_username', (q) => q.eq('username', username))
      .unique()
    return !!existing && existing._id !== exceptStaffId
  },
})

/** Used from Node actions (which have no `ctx.db`) to enforce superadmin before hashing/writing. */
export const requireSuperAdminToken = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireSuperAdmin(ctx, token)
  },
})

/** Used from Node actions to re-verify the caller's own password before a destructive
 * action (full data reset) — returns the full staff row, including passwordHash, for an
 * internal-only comparison. Never exposed to the client. */
export const getSuperAdminForToken = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await requireSuperAdmin(ctx, token)
    return await ctx.db.get(session.userId)
  },
})

