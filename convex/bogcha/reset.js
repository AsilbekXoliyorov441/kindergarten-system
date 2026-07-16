import { internalMutation } from '../_generated/server'

const OPERATIONAL_TABLES = [
  'bogchaThreadReads',
  'bogchaMessages',
  'bogchaThreads',
  'bogchaAttendance',
  'bogchaGroupStaff',
  'bogchaParents',
  'bogchaChildren',
  'bogchaGroups',
]

/** Wipes every operational record — groups, children, parents, attendance, and
 * threads/messages/read-receipts — while leaving staff logins and the fee setting
 * untouched. Only reachable via resetActions.resetAllData, which re-verifies the
 * caller's own password first. */
export const wipeOperationalData = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const table of OPERATIONAL_TABLES) {
      const rows = await ctx.db.query(table).collect()
      await Promise.all(rows.map((row) => ctx.db.delete(row._id)))
    }

    // Every parent account was just deleted, so any session still logged in as a
    // parent is now dangling — clear those out too. Staff sessions are left alone.
    const parentSessions = await ctx.db
      .query('bogchaSessions')
      .filter((q) => q.eq(q.field('role'), 'parent'))
      .collect()
    await Promise.all(parentSessions.map((s) => ctx.db.delete(s._id)))
  },
})
