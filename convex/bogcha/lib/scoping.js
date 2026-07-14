import { ConvexError } from 'convex/values'
import { requireSession } from './authz'

/** Shared scoping helpers, called from within query/mutation handlers (needs `ctx.db`).
 * Superadmin sees everything (`{ all: true }`). An opa is scoped to the groups she's
 * assigned to via `bogchaGroupStaff`. A parent is scoped to her single child. */

export async function getScope(ctx, token) {
  const session = await requireSession(ctx, token)

  if (session.role === 'superadmin') return { all: true, session }

  if (session.role === 'opa') {
    return { all: false, role: 'opa', staffId: session.userId, session }
  }

  const parent = await ctx.db.get(session.userId)
  if (!parent) throw new ConvexError('Ota-ona topilmadi')
  return { all: false, role: 'parent', childId: parent.childId, session }
}

/** `null` means "no filter needed" (superadmin) — callers must handle that case explicitly. */
export async function getScopedGroupIdSet(ctx, token) {
  const scope = await getScope(ctx, token)
  if (scope.all) return null

  if (scope.role === 'opa') {
    const links = await ctx.db
      .query('bogchaGroupStaff')
      .withIndex('by_staff', (q) => q.eq('staffId', scope.staffId))
      .collect()
    return new Set(links.map((l) => l.groupId))
  }

  const child = await ctx.db.get(scope.childId)
  return new Set(child ? [child.groupId] : [])
}

export async function requireGroupAccess(ctx, token, groupId) {
  const scope = await getScope(ctx, token)
  if (scope.all) return scope.session
  if (scope.role !== 'opa') throw new ConvexError("Bu guruhga ruxsatingiz yo'q")

  const link = await ctx.db
    .query('bogchaGroupStaff')
    .withIndex('by_staff', (q) => q.eq('staffId', scope.staffId))
    .filter((q) => q.eq(q.field('groupId'), groupId))
    .unique()
  if (!link) throw new ConvexError("Bu guruhga ruxsatingiz yo'q")
  return scope.session
}

export async function requireChildAccess(ctx, token, childId) {
  const child = await ctx.db.get(childId)
  if (!child) throw new ConvexError('Bola topilmadi')

  const scope = await getScope(ctx, token)
  if (scope.all) return scope.session

  if (scope.role === 'parent') {
    if (scope.childId !== childId) throw new ConvexError("Bu bolaga ruxsatingiz yo'q")
    return scope.session
  }

  await requireGroupAccess(ctx, token, child.groupId)
  return scope.session
}

/** Only superadmin/opa can write attendance — parents are read-only. */
export async function requireStaffChildAccess(ctx, token, childId) {
  const scope = await getScope(ctx, token)
  if (scope.role === 'parent') throw new ConvexError('Xodim huquqi talab qilinadi')
  return requireChildAccess(ctx, token, childId)
}

/** Superadmin sees every thread (read access only enforced separately for writes — see
 * `messages.send`). A parent only her own. An opa only threads addressed to `'opa'` whose
 * group is one she's assigned to. */
export async function requireThreadAccess(ctx, token, threadId) {
  const thread = await ctx.db.get(threadId)
  if (!thread) throw new ConvexError('Murojaat topilmadi')

  const scope = await getScope(ctx, token)
  if (scope.all) return scope.session

  if (scope.role === 'parent') {
    if (thread.parentId !== scope.session.userId) throw new ConvexError("Bu murojaatga ruxsatingiz yo'q")
    return scope.session
  }

  if (thread.recipient !== 'opa') throw new ConvexError("Bu murojaatga ruxsatingiz yo'q")
  await requireGroupAccess(ctx, token, thread.groupId)
  return scope.session
}
