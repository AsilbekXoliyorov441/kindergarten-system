import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { requireTeacher } from './lib/authz'

const TABLES = ['coinEntries', 'transactions', 'lessons', 'students', 'groups', 'gifts']

export const exportAll = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await requireTeacher(ctx, token)
    const teacher = await ctx.db.get(session.userId)
    return {
      exportedAt: new Date().toISOString(),
      teacher: teacher ? { username: teacher.username, passwordHash: teacher.passwordHash, fullName: teacher.fullName } : null,
      groups: await ctx.db.query('groups').collect(),
      students: await ctx.db.query('students').collect(),
      lessons: await ctx.db.query('lessons').collect(),
      coinEntries: await ctx.db.query('coinEntries').collect(),
      transactions: await ctx.db.query('transactions').collect(),
      gifts: await ctx.db.query('gifts').collect(),
    }
  },
})

/** Wipes every group/student/lesson/coin record — used by Settings > "Ma'lumotlarni
 * tozalash". Teacher login and the gift catalog are left in place. */
export const resetOperationalData = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireTeacher(ctx, token)
    for (const table of TABLES) {
      if (table === 'gifts') continue
      const rows = await ctx.db.query(table).collect()
      for (const row of rows) await ctx.db.delete(row._id)
    }
  },
})

/** Wipes every group/student/lesson/coin/gift record and restores them from a previous
 * `exportAll` payload, remapping the old row ids to freshly-inserted ones. The teacher
 * account backing the current session is patched in place (never deleted) so the import
 * can't lock the caller out. */
export const importAll = mutation({
  args: {
    token: v.string(),
    data: v.object({
      teacher: v.optional(v.any()),
      groups: v.array(v.any()),
      students: v.array(v.any()),
      lessons: v.array(v.any()),
      coinEntries: v.array(v.any()),
      transactions: v.array(v.any()),
      gifts: v.array(v.any()),
    }),
  },
  handler: async (ctx, { token, data }) => {
    const session = await requireTeacher(ctx, token)

    for (const table of TABLES) {
      const rows = await ctx.db.query(table).collect()
      for (const row of rows) await ctx.db.delete(row._id)
    }

    if (data.teacher) {
      await ctx.db.patch(session.userId, {
        username: data.teacher.username,
        passwordHash: data.teacher.passwordHash,
        fullName: data.teacher.fullName,
      })
    }

    const groupIdMap = new Map()
    for (const g of data.groups) {
      const newId = await ctx.db.insert('groups', { name: g.name, createdAt: g.createdAt })
      groupIdMap.set(g._id, newId)
    }

    const studentIdMap = new Map()
    for (const s of data.students) {
      const newId = await ctx.db.insert('students', {
        groupId: groupIdMap.get(s.groupId),
        fullName: s.fullName,
        avatar: s.avatar ?? null,
        joinedAt: s.joinedAt,
        login: s.login,
        passwordHash: s.passwordHash,
        status: s.status,
      })
      studentIdMap.set(s._id, newId)
    }

    const giftIdMap = new Map()
    for (const g of data.gifts) {
      const newId = await ctx.db.insert('gifts', { name: g.name, icon: g.icon, price: g.price })
      giftIdMap.set(g._id, newId)
    }

    const lessonIdMap = new Map()
    for (const l of data.lessons) {
      const newId = await ctx.db.insert('lessons', {
        groupId: groupIdMap.get(l.groupId),
        date: l.date,
        lessonNumber: l.lessonNumber,
        monthIndex: l.monthIndex,
      })
      lessonIdMap.set(l._id, newId)
    }

    const entryIdMap = new Map()
    for (const e of data.coinEntries) {
      const newId = await ctx.db.insert('coinEntries', {
        studentId: studentIdMap.get(e.studentId),
        lessonId: lessonIdMap.get(e.lessonId),
        category: e.category,
        value: e.value,
        maxValue: e.maxValue,
        givenAt: e.givenAt,
      })
      entryIdMap.set(e._id, newId)
    }

    for (const t of data.transactions) {
      await ctx.db.insert('transactions', {
        studentId: studentIdMap.get(t.studentId),
        type: t.type,
        amount: t.amount,
        relatedEntryId: t.relatedEntryId ? entryIdMap.get(t.relatedEntryId) : undefined,
        relatedGiftId: t.relatedGiftId ? giftIdMap.get(t.relatedGiftId) : undefined,
        timestamp: t.timestamp,
      })
    }
  },
})
