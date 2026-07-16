import { query, mutation } from '../_generated/server'
import { v, ConvexError } from 'convex/values'
import { getScope, getScopedGroupIdSet, requireThreadAccess } from './lib/scoping'
import { requireSuperAdmin, requireStaff } from './lib/authz'

export const createThread = mutation({
  args: {
    token: v.string(),
    recipient: v.union(v.literal('opa'), v.literal('director')),
    category: v.union(v.literal('shikoyat'), v.literal('taklif'), v.literal('maqtov')),
    text: v.string(),
  },
  handler: async (ctx, { token, recipient, category, text }) => {
    const scope = await getScope(ctx, token)
    if (scope.role !== 'parent') throw new ConvexError('Faqat ota-ona murojaat yubora oladi')

    const trimmed = text.trim()
    if (!trimmed) throw new ConvexError('Xabar matni bo\'sh bo\'lishi mumkin emas')

    const parent = await ctx.db.get(scope.session.userId)
    if (!parent) throw new ConvexError('Ota-ona topilmadi')
    const child = await ctx.db.get(parent.childId)
    if (!child) throw new ConvexError('Bola topilmadi')

    const now = new Date().toISOString()
    const threadId = await ctx.db.insert('bogchaThreads', {
      parentId: parent._id,
      childId: child._id,
      groupId: child.groupId,
      recipient,
      category,
      createdAt: now,
      lastMessageAt: now,
    })
    await ctx.db.insert('bogchaMessages', {
      threadId,
      senderRole: 'parent',
      senderId: parent._id,
      text: trimmed,
      createdAt: now,
    })
    return threadId
  },
})

export const listForParent = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const scope = await getScope(ctx, token)
    if (scope.role !== 'parent') throw new ConvexError('Faqat ota-ona uchun')
    return await ctx.db
      .query('bogchaThreads')
      .withIndex('by_parent', (q) => q.eq('parentId', scope.session.userId))
      .collect()
  },
})

export const listForOpa = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireStaff(ctx, token)
    const groupIdSet = await getScopedGroupIdSet(ctx, token)
    const threads = await ctx.db
      .query('bogchaThreads')
      .withIndex('by_recipient', (q) => q.eq('recipient', 'opa'))
      .collect()
    return groupIdSet === null ? threads : threads.filter((t) => groupIdSet.has(t.groupId))
  },
})

export const listAll = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireSuperAdmin(ctx, token)
    return await ctx.db.query('bogchaThreads').collect()
  },
})

export const markRead = mutation({
  args: { token: v.string(), threadId: v.id('bogchaThreads') },
  handler: async (ctx, { token, threadId }) => {
    const session = await requireThreadAccess(ctx, token, threadId)
    const existing = await ctx.db
      .query('bogchaThreadReads')
      .withIndex('by_thread_user', (q) => q.eq('threadId', threadId).eq('userId', session.userId))
      .unique()
    const lastReadAt = new Date().toISOString()
    if (existing) await ctx.db.patch(existing._id, { lastReadAt })
    else await ctx.db.insert('bogchaThreadReads', { threadId, userId: session.userId, lastReadAt })
  },
})

/** Every read-receipt belonging to the caller — used client-side to compute unread
 * counts against each thread's `lastMessageAt` (see `useUnreadThreadCount`). */
export const listMyReads = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const scope = await getScope(ctx, token)
    return await ctx.db
      .query('bogchaThreadReads')
      .withIndex('by_user', (q) => q.eq('userId', scope.session.userId))
      .collect()
  },
})
