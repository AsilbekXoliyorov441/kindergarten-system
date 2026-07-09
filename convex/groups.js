import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { requireTeacher } from './lib/authz'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('groups').collect()
  },
})

export const create = mutation({
  args: { token: v.string(), name: v.string() },
  handler: async (ctx, { token, name }) => {
    await requireTeacher(ctx, token)
    return await ctx.db.insert('groups', { name, createdAt: new Date().toISOString() })
  },
})

export const remove = mutation({
  args: { token: v.string(), id: v.id('groups') },
  handler: async (ctx, { token, id }) => {
    await requireTeacher(ctx, token)
    await ctx.db.delete(id)
  },
})
