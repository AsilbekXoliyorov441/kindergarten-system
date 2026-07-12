import { query, internalQuery, internalMutation } from './_generated/server'
import { v } from 'convex/values'
import { requireSuperAdmin } from './lib/scoping'

export const list = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireSuperAdmin(ctx, token)
    const teachers = await ctx.db.query('teachers').collect()
    const groups = await ctx.db.query('groups').collect()
    return teachers.map((t) => ({
      id: t._id,
      username: t.username,
      fullName: t.fullName,
      isSuperAdmin: !!t.isSuperAdmin,
      groupCount: groups.filter((g) => g.teacherId === t._id).length,
    }))
  },
})

/** Used from Node actions (which have no `ctx.db`) to write the new password hash. */
export const updatePasswordHash = internalMutation({
  args: { id: v.id('teachers'), passwordHash: v.string() },
  handler: async (ctx, { id, passwordHash }) => {
    await ctx.db.patch(id, { passwordHash })
  },
})

export const countSuperAdmins = internalQuery({
  args: {},
  handler: async (ctx) => {
    const teachers = await ctx.db.query('teachers').collect()
    return teachers.filter((t) => t.isSuperAdmin).length
  },
})

export const updateSuperAdminFlag = internalMutation({
  args: { id: v.id('teachers'), isSuperAdmin: v.boolean() },
  handler: async (ctx, { id, isSuperAdmin }) => {
    await ctx.db.patch(id, { isSuperAdmin })
  },
})
