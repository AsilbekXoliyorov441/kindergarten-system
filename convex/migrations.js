import { internalMutation } from './_generated/server'

/** One-time migration for the multi-teacher rollout. Promotes the sole pre-existing
 * teacher to superadmin and backfills `teacherId` on every existing group so old data
 * stays attached to them instead of becoming ownerless. Refuses to run once a second
 * teacher exists (by then the "one owner for everything old" assumption is no longer safe).
 * Run via: npx convex run migrations:backfillTeacherOwnership '{}' */
export const backfillTeacherOwnership = internalMutation({
  args: {},
  handler: async (ctx) => {
    const teachers = await ctx.db.query('teachers').collect()
    if (teachers.length !== 1) {
      return { ok: false, error: `Expected exactly 1 teacher, found ${teachers.length}. Aborted.` }
    }
    const [owner] = teachers
    if (!owner.isSuperAdmin) {
      await ctx.db.patch(owner._id, { isSuperAdmin: true })
    }

    const groups = await ctx.db.query('groups').collect()
    let patched = 0
    for (const group of groups) {
      if (!group.teacherId) {
        await ctx.db.patch(group._id, { teacherId: owner._id })
        patched += 1
      }
    }

    return { ok: true, superAdminId: owner._id, groupsPatched: patched, totalGroups: groups.length }
  },
})
