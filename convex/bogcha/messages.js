import { query, mutation } from '../_generated/server'
import { v, ConvexError } from 'convex/values'
import { getScope, requireThreadAccess } from './lib/scoping'

export const listForThread = query({
  args: { token: v.string(), threadId: v.id('bogchaThreads') },
  handler: async (ctx, { token, threadId }) => {
    await requireThreadAccess(ctx, token, threadId)
    return await ctx.db
      .query('bogchaMessages')
      .withIndex('by_thread', (q) => q.eq('threadId', threadId))
      .collect()
  },
})

export const send = mutation({
  args: { token: v.string(), threadId: v.id('bogchaThreads'), text: v.string() },
  handler: async (ctx, { token, threadId, text }) => {
    const scope = await getScope(ctx, token)
    const session = await requireThreadAccess(ctx, token, threadId)

    const trimmed = text.trim()
    if (!trimmed) throw new ConvexError('Xabar matni bo\'sh bo\'lishi mumkin emas')

    const thread = await ctx.db.get(threadId)
    // Superadmin has read access to every thread (for oversight) but may only post in
    // her own director-addressed inbox — the opa<->parent view is monitoring-only.
    if (scope.all && thread.recipient !== 'director') {
      throw new ConvexError("Bu murojaatga yozish huquqingiz yo'q")
    }

    const senderRole = scope.all ? 'superadmin' : scope.role
    const now = new Date().toISOString()
    await ctx.db.insert('bogchaMessages', { threadId, senderRole, senderId: session.userId, text: trimmed, createdAt: now })
    await ctx.db.patch(threadId, { lastMessageAt: now })
  },
})
