import { ConvexError } from 'convex/values'

/** Shared session-lookup helpers, called from within query/mutation handlers (needs `ctx.db`). */

export async function resolveSession(ctx, token) {
  if (!token) return null
  return await ctx.db
    .query('sessions')
    .withIndex('by_token', (q) => q.eq('token', token))
    .unique()
}

export async function requireTeacher(ctx, token) {
  const session = await resolveSession(ctx, token)
  if (!session || session.role !== 'teacher') {
    throw new ConvexError("O'qituvchi huquqi talab qilinadi")
  }
  return session
}

export async function requireSession(ctx, token) {
  const session = await resolveSession(ctx, token)
  if (!session) throw new ConvexError('Tizimga kirish talab qilinadi')
  return session
}
