import { ConvexError } from 'convex/values'

/** Bogcha session-lookup helpers, called from within query/mutation handlers (needs `ctx.db`). */

export async function resolveSession(ctx, token) {
  if (!token) return null
  return await ctx.db
    .query('bogchaSessions')
    .withIndex('by_token', (q) => q.eq('token', token))
    .unique()
}

export async function requireSession(ctx, token) {
  const session = await resolveSession(ctx, token)
  if (!session) throw new ConvexError('Tizimga kirish talab qilinadi')
  return session
}

export async function requireStaff(ctx, token) {
  const session = await requireSession(ctx, token)
  if (session.role !== 'superadmin' && session.role !== 'opa') {
    throw new ConvexError('Xodim huquqi talab qilinadi')
  }
  return session
}

export async function requireSuperAdmin(ctx, token) {
  const session = await requireSession(ctx, token)
  if (session.role !== 'superadmin') {
    throw new ConvexError('Faqat superadmin uchun ruxsat berilgan')
  }
  return session
}
