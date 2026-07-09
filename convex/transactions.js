import { query, mutation } from './_generated/server'
import { v, ConvexError } from 'convex/values'
import { requireTeacher } from './lib/authz'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('transactions').collect()
  },
})

/** Recomputes the student's balance from the transaction log server-side and rejects
 * atomically if it's insufficient, instead of trusting a client-precomputed balance. */
export const redeemGift = mutation({
  args: { token: v.string(), studentId: v.id('students'), giftId: v.id('gifts') },
  handler: async (ctx, { token, studentId, giftId }) => {
    await requireTeacher(ctx, token)

    const gift = await ctx.db.get(giftId)
    if (!gift) throw new ConvexError("Sovg'a topilmadi")

    const studentTransactions = await ctx.db
      .query('transactions')
      .withIndex('by_student', (q) => q.eq('studentId', studentId))
      .collect()
    const balance = studentTransactions.reduce(
      (sum, t) => (t.type === 'coin_given' ? sum + t.amount : sum - t.amount),
      0,
    )
    if (balance < gift.price) throw new ConvexError("Balansda yetarli coin yo'q")

    await ctx.db.insert('transactions', {
      studentId,
      type: 'gift_redeemed',
      amount: gift.price,
      relatedGiftId: giftId,
      timestamp: new Date().toISOString(),
    })
  },
})
