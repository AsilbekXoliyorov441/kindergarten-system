'use node'

import { v } from 'convex/values'
import { action } from './_generated/server'
import { internal } from './_generated/api'
import { hashPassword } from './lib/passwords'
import { generateStudentLogin, generateStudentPassword } from '../src/shared/lib/credentials'

/** Returns the plaintext login/password once so the teacher can hand them to the student —
 * only the hash is ever persisted. */
export const create = action({
  args: { token: v.string(), groupId: v.id('groups'), fullName: v.string() },
  handler: async (ctx, { token, groupId, fullName }) => {
    await ctx.runQuery(internal.auth.requireTeacherToken, { token })

    const existingLogins = await ctx.runQuery(internal.students.listLogins, {})
    const login = generateStudentLogin(fullName, existingLogins)
    const password = generateStudentPassword()
    const passwordHash = hashPassword(password)

    const id = await ctx.runMutation(internal.students.insertStudent, { groupId, fullName, login, passwordHash })
    return { id, login, password }
  },
})
