import { query, mutation } from '../_generated/server'
import { v, ConvexError } from 'convex/values'
import { requireSession, requireSuperAdmin } from './lib/authz'

const DEFAULT_FEE_PER_DAY = 28000

export const get = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireSession(ctx, token)
    const settings = await ctx.db.query('bogchaSettings').first()
    return { feePerDay: settings?.feePerDay ?? DEFAULT_FEE_PER_DAY }
  },
})

export const update = mutation({
  args: { token: v.string(), feePerDay: v.number() },
  handler: async (ctx, { token, feePerDay }) => {
    await requireSuperAdmin(ctx, token)
    if (!Number.isFinite(feePerDay) || feePerDay <= 0) throw new ConvexError("To'lov summasi musbat son bo'lishi kerak")
    const settings = await ctx.db.query('bogchaSettings').first()
    if (settings) await ctx.db.patch(settings._id, { feePerDay })
    else await ctx.db.insert('bogchaSettings', { feePerDay })
  },
})
