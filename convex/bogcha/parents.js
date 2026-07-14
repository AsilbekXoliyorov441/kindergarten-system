import { query, mutation, internalQuery, internalMutation } from '../_generated/server'
import { v } from 'convex/values'
import { requireGroupAccess } from './lib/scoping'
import { requireSuperAdmin } from './lib/authz'

function stripCredentials(parent) {
  const rest = { ...parent }
  delete rest.passwordHash
  return rest
}

/** Every parent belonging to a child in this group — small scale (collect + filter is
 * simpler than a join), used to show/manage parent accounts from the group roster. */
export const listForGroup = query({
  args: { token: v.string(), groupId: v.id('bogchaGroups') },
  handler: async (ctx, { token, groupId }) => {
    await requireGroupAccess(ctx, token, groupId)
    const children = await ctx.db
      .query('bogchaChildren')
      .withIndex('by_group', (q) => q.eq('groupId', groupId))
      .collect()
    const childIdSet = new Set(children.map((c) => c._id))
    const parents = await ctx.db.query('bogchaParents').collect()
    return parents.filter((p) => childIdSet.has(p.childId)).map(stripCredentials)
  },
})

export const remove = mutation({
  args: { token: v.string(), parentId: v.id('bogchaParents') },
  handler: async (ctx, { token, parentId }) => {
    await requireSuperAdmin(ctx, token)
    await ctx.db.delete(parentId)
  },
})

export const getById = internalQuery({
  args: { id: v.id('bogchaParents') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})

export const requireSuperAdminToken = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireSuperAdmin(ctx, token)
  },
})

export const updateCredentials = internalMutation({
  args: {
    id: v.id('bogchaParents'),
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
  args: { username: v.string(), exceptParentId: v.optional(v.id('bogchaParents')) },
  handler: async (ctx, { username, exceptParentId }) => {
    const existing = await ctx.db
      .query('bogchaParents')
      .withIndex('by_username', (q) => q.eq('username', username))
      .unique()
    return !!existing && existing._id !== exceptParentId
  },
})
