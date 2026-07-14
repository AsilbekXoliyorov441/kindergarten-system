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

export const updatePasswordHash = internalMutation({
  args: { id: v.id('bogchaStaff'), passwordHash: v.string() },
  handler: async (ctx, { id, passwordHash }) => {
    await ctx.db.patch(id, { passwordHash })
  },
})

/** Used from Node actions (which have no `ctx.db`) to enforce superadmin before hashing/writing. */
export const requireSuperAdminToken = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireSuperAdmin(ctx, token)
  },
})

export const getById = internalQuery({
  args: { id: v.id('bogchaStaff') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})
