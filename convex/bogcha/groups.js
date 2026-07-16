import { query, mutation, internalQuery } from '../_generated/server'
import { v, ConvexError } from 'convex/values'
import { getScopedGroupIdSet, requireGroupAccess } from './lib/scoping'
import { requireSuperAdmin } from './lib/authz'

export const list = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const groupIdSet = await getScopedGroupIdSet(ctx, token)
    const groups = await ctx.db.query('bogchaGroups').collect()
    const scoped = groupIdSet === null ? groups : groups.filter((g) => groupIdSet.has(g._id))
    return scoped.filter((g) => g.status === 'active')
  },
})

/** Superadmin-only: every opa↔group assignment, for building the "who's assigned where"
 * table on the groups management page. */
export const listStaffLinks = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireSuperAdmin(ctx, token)
    return await ctx.db.query('bogchaGroupStaff').collect()
  },
})

export const create = mutation({
  args: { token: v.string(), name: v.string() },
  handler: async (ctx, { token, name }) => {
    await requireSuperAdmin(ctx, token)
    const trimmed = name.trim()
    if (!trimmed) throw new ConvexError("Guruh nomi bo'sh bo'lishi mumkin emas")
    return await ctx.db.insert('bogchaGroups', { name: trimmed, createdAt: new Date().toISOString(), status: 'active' })
  },
})

export const rename = mutation({
  args: { token: v.string(), id: v.id('bogchaGroups'), name: v.string() },
  handler: async (ctx, { token, id, name }) => {
    await requireSuperAdmin(ctx, token)
    const trimmed = name.trim()
    if (!trimmed) throw new ConvexError("Guruh nomi bo'sh bo'lishi mumkin emas")
    await ctx.db.patch(id, { name: trimmed })
  },
})

export const archive = mutation({
  args: { token: v.string(), id: v.id('bogchaGroups') },
  handler: async (ctx, { token, id }) => {
    await requireSuperAdmin(ctx, token)
    const children = await ctx.db
      .query('bogchaChildren')
      .withIndex('by_group', (q) => q.eq('groupId', id))
      .collect()
    if (children.some((c) => c.status === 'active')) {
      throw new ConvexError("Bu guruhda faol bolalar bor — avval ularni boshqa guruhga o'tkazing")
    }
    await ctx.db.patch(id, { status: 'archived' })
  },
})

export const assignStaff = mutation({
  args: { token: v.string(), groupId: v.id('bogchaGroups'), staffId: v.id('bogchaStaff') },
  handler: async (ctx, { token, groupId, staffId }) => {
    await requireSuperAdmin(ctx, token)
    const existing = await ctx.db
      .query('bogchaGroupStaff')
      .withIndex('by_staff', (q) => q.eq('staffId', staffId))
      .filter((q) => q.eq(q.field('groupId'), groupId))
      .unique()
    if (existing) return existing._id
    return await ctx.db.insert('bogchaGroupStaff', { groupId, staffId })
  },
})

export const unassignStaff = mutation({
  args: { token: v.string(), groupId: v.id('bogchaGroups'), staffId: v.id('bogchaStaff') },
  handler: async (ctx, { token, groupId, staffId }) => {
    await requireSuperAdmin(ctx, token)
    const existing = await ctx.db
      .query('bogchaGroupStaff')
      .withIndex('by_staff', (q) => q.eq('staffId', staffId))
      .filter((q) => q.eq(q.field('groupId'), groupId))
      .unique()
    if (existing) await ctx.db.delete(existing._id)
  },
})

/** Used from Node actions (which have no `ctx.db`) to enforce group access before writing. */
export const requireGroupAccessToken = internalQuery({
  args: { token: v.string(), groupId: v.id('bogchaGroups') },
  handler: async (ctx, { token, groupId }) => {
    await requireGroupAccess(ctx, token, groupId)
  },
})
