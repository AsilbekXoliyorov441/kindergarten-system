import { query, mutation, internalMutation } from './_generated/server'
import { v } from 'convex/values'
import { requireTeacher } from './lib/authz'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('gifts').collect()
  },
})

export const create = mutation({
  args: { token: v.string(), name: v.string(), icon: v.string(), price: v.number() },
  handler: async (ctx, { token, name, icon, price }) => {
    await requireTeacher(ctx, token)
    return await ctx.db.insert('gifts', { name, icon, price })
  },
})

export const update = mutation({
  args: { token: v.string(), id: v.id('gifts'), name: v.string(), icon: v.string(), price: v.number() },
  handler: async (ctx, { token, id, name, icon, price }) => {
    await requireTeacher(ctx, token)
    await ctx.db.patch(id, { name, icon, price })
  },
})

export const remove = mutation({
  args: { token: v.string(), id: v.id('gifts') },
  handler: async (ctx, { token, id }) => {
    await requireTeacher(ctx, token)
    await ctx.db.delete(id)
  },
})

/** One-time bootstrap of the starter gift catalog — run via:
 * npx convex run gifts:seedDefaults */
export const seedDefaults = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('gifts').first()
    if (existing) return { ok: false, error: 'Gifts already seeded' }

    const defaults = [
      { name: "Stikerlar to'plami", price: 20, icon: 'Sticker' },
      { name: 'Bloknot', price: 40, icon: 'NotebookPen' },
      { name: 'Krujka', price: 60, icon: 'Coffee' },
      { name: 'Flesh-karta 32GB', price: 70, icon: 'Usb' },
      { name: 'PDP kepkasi', price: 90, icon: 'Crown' },
      { name: 'Sichqoncha', price: 130, icon: 'Mouse' },
      { name: 'Futbolka', price: 150, icon: 'Shirt' },
      { name: 'Ryukzak', price: 300, icon: 'Backpack' },
    ]
    for (const gift of defaults) await ctx.db.insert('gifts', gift)
    return { ok: true }
  },
})
