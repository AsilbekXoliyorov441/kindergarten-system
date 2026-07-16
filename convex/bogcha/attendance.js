import { query, mutation } from '../_generated/server'
import { v, ConvexError } from 'convex/values'
import { getScopedGroupIdSet, requireGroupAccess, requireChildAccess, requireStaffChildAccess } from './lib/scoping'
import { requireStaff } from './lib/authz'

function monthRange(monthKey) {
  return { start: `${monthKey}-01`, end: `${monthKey}-31` }
}

/** Convex functions run on servers in an arbitrary (usually UTC) timezone, but every
 * client is in Uzbekistan — so "today" must be Tashkent's calendar date (fixed UTC+5,
 * no DST), not the server's, or marking today's attendance flips to "future" for part
 * of the day. */
const TASHKENT_OFFSET_MS = 5 * 60 * 60 * 1000

function todayKey() {
  return new Date(Date.now() + TASHKENT_OFFSET_MS).toISOString().slice(0, 10)
}

/** 0 = Sunday, 6 = Saturday — kindergarten only runs Mon-Fri. */
function isWeekday(dateKey) {
  const day = new Date(`${dateKey}T00:00:00Z`).getUTCDay()
  return day >= 1 && day <= 5
}

export const listForGroupMonth = query({
  args: { token: v.string(), groupId: v.id('bogchaGroups'), monthKey: v.string() },
  handler: async (ctx, { token, groupId, monthKey }) => {
    await requireGroupAccess(ctx, token, groupId)
    const { start, end } = monthRange(monthKey)
    return await ctx.db
      .query('bogchaAttendance')
      .withIndex('by_group_date', (q) => q.eq('groupId', groupId).gte('date', start).lte('date', end))
      .collect()
  },
})

export const listForChildMonth = query({
  args: { token: v.string(), childId: v.id('bogchaChildren'), monthKey: v.string() },
  handler: async (ctx, { token, childId, monthKey }) => {
    await requireChildAccess(ctx, token, childId)
    const { start, end } = monthRange(monthKey)
    return await ctx.db
      .query('bogchaAttendance')
      .withIndex('by_child_date', (q) => q.eq('childId', childId).gte('date', start).lte('date', end))
      .collect()
  },
})

/** Every attendance record in scope for a given month, across every group the caller can
 * see — used for the superadmin/opa overview dashboards (small dataset, so a single
 * collect+filter is simpler than fanning out one query per group). */
export const listForMonth = query({
  args: { token: v.string(), monthKey: v.string() },
  handler: async (ctx, { token, monthKey }) => {
    await requireStaff(ctx, token)
    const groupIdSet = await getScopedGroupIdSet(ctx, token)
    const all = await ctx.db.query('bogchaAttendance').collect()
    const inMonth = all.filter((a) => a.date.startsWith(monthKey))
    return groupIdSet === null ? inMonth : inMonth.filter((a) => groupIdSet.has(a.groupId))
  },
})

export const mark = mutation({
  args: {
    token: v.string(),
    childId: v.id('bogchaChildren'),
    date: v.string(),
    status: v.union(v.literal('present'), v.literal('absent')),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { token, childId, date, status, reason }) => {
    const session = await requireStaffChildAccess(ctx, token, childId)

    if (date > todayKey()) throw new ConvexError('Kelajakdagi kunni belgilab bo\'lmaydi')
    if (!isWeekday(date)) throw new ConvexError("Dam olish kunlari uchun yoqlama qilinmaydi")
    if (status === 'absent' && !reason?.trim()) throw new ConvexError('Kelmagan sabab ko\'rsatilishi kerak')

    const child = await ctx.db.get(childId)
    if (!child) throw new ConvexError('Bola topilmadi')

    const existing = await ctx.db
      .query('bogchaAttendance')
      .withIndex('by_child_date', (q) => q.eq('childId', childId).eq('date', date))
      .unique()

    const patch = {
      status,
      reason: status === 'absent' ? reason.trim() : undefined,
      markedBy: session.userId,
      markedAt: new Date().toISOString(),
    }

    if (existing) {
      await ctx.db.patch(existing._id, patch)
      return existing._id
    }

    return await ctx.db.insert('bogchaAttendance', { childId, groupId: child.groupId, date, ...patch })
  },
})
