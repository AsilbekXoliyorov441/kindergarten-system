import { query, mutation, internalQuery, internalMutation } from '../_generated/server'
import { v, ConvexError } from 'convex/values'
import { getScope, requireGroupAccess } from './lib/scoping'
import { requireSuperAdmin } from './lib/authz'

/** Scoped roster: superadmin sees every active child, an opa sees children in her
 * assigned groups, a parent sees only her own child. */
export const list = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const scope = await getScope(ctx, token)
    const children = await ctx.db.query('bogchaChildren').collect()
    const active = children.filter((c) => c.status === 'active')

    if (scope.all) return active
    if (scope.role === 'parent') return active.filter((c) => c._id === scope.childId)

    const links = await ctx.db
      .query('bogchaGroupStaff')
      .withIndex('by_staff', (q) => q.eq('staffId', scope.staffId))
      .collect()
    const groupIdSet = new Set(links.map((l) => l.groupId))
    return active.filter((c) => groupIdSet.has(c.groupId))
  },
})

export const listForGroup = query({
  args: { token: v.string(), groupId: v.id('bogchaGroups') },
  handler: async (ctx, { token, groupId }) => {
    await requireGroupAccess(ctx, token, groupId)
    const children = await ctx.db
      .query('bogchaChildren')
      .withIndex('by_group', (q) => q.eq('groupId', groupId))
      .collect()
    return children.filter((c) => c.status === 'active')
  },
})

export const archive = mutation({
  args: { token: v.string(), childId: v.id('bogchaChildren'), reason: v.string() },
  handler: async (ctx, { token, childId, reason }) => {
    const trimmed = reason.trim()
    if (!trimmed) throw new ConvexError("O'chirish sababi ko'rsatilishi kerak")

    const child = await ctx.db.get(childId)
    if (!child) throw new ConvexError('Bola topilmadi')
    await requireGroupAccess(ctx, token, child.groupId)
    await ctx.db.patch(childId, { status: 'archived', archivedAt: new Date().toISOString(), archiveReason: trimmed })
  },
})

/** Every child, active and archived — superadmin-only, used for the statistics page's
 * enrollment/churn figures (which need archived rows too, unlike the scoped roster
 * queries above that only ever return active children). */
export const listAllForStats = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireSuperAdmin(ctx, token)
    return await ctx.db.query('bogchaChildren').collect()
  },
})

export const transferGroup = mutation({
  args: { token: v.string(), childId: v.id('bogchaChildren'), groupId: v.id('bogchaGroups') },
  handler: async (ctx, { token, childId, groupId }) => {
    await requireSuperAdmin(ctx, token)
    await ctx.db.patch(childId, { groupId })
  },
})

export const listParentUsernames = internalQuery({
  args: {},
  handler: async (ctx) => {
    const parents = await ctx.db.query('bogchaParents').collect()
    return parents.map((p) => p.username)
  },
})

export const insertChildWithParent = internalMutation({
  args: {
    groupId: v.id('bogchaGroups'),
    fullName: v.string(),
    birthDate: v.optional(v.string()),
    parentFullName: v.string(),
    parentUsername: v.string(),
    parentPasswordHash: v.string(),
    parentPhone: v.optional(v.string()),
  },
  handler: async (ctx, { groupId, fullName, birthDate, parentFullName, parentUsername, parentPasswordHash, parentPhone }) => {
    const childId = await ctx.db.insert('bogchaChildren', {
      groupId,
      fullName,
      birthDate,
      joinedAt: new Date().toISOString(),
      status: 'active',
    })
    await ctx.db.insert('bogchaParents', {
      childId,
      username: parentUsername,
      passwordHash: parentPasswordHash,
      fullName: parentFullName,
      phone: parentPhone,
    })
    return childId
  },
})

/** Used from Node actions (which have no `ctx.db`) to enforce group access before writing. */
export const requireGroupAccessToken = internalQuery({
  args: { token: v.string(), groupId: v.id('bogchaGroups') },
  handler: async (ctx, { token, groupId }) => {
    await requireGroupAccess(ctx, token, groupId)
  },
})
