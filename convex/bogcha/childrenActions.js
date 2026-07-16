'use node'

import { v, ConvexError } from 'convex/values'
import { action } from '../_generated/server'
import { internal } from '../_generated/api'
import { hashPassword } from '../lib/passwords'
import { generateLoginFromName } from '../../src/shared/lib/credentials'

/** Creates a child together with her parent's login in one step. Returns the parent's
 * plaintext username/password once — only the hash is ever persisted. */
export const create = action({
  args: {
    token: v.string(),
    groupId: v.id('bogchaGroups'),
    fullName: v.string(),
    birthDate: v.optional(v.string()),
    parentFullName: v.string(),
    parentPhone: v.optional(v.string()),
  },
  handler: async (ctx, { token, groupId, fullName, birthDate, parentFullName, parentPhone }) => {
    await ctx.runQuery(internal.bogcha.children.requireGroupAccessToken, { token, groupId })

    const trimmedFullName = fullName.trim()
    const trimmedParentFullName = parentFullName.trim()
    if (!trimmedFullName) throw new ConvexError("Bolaning ismi bo'sh bo'lishi mumkin emas")
    if (!trimmedParentFullName) throw new ConvexError("Ota-onaning ismi bo'sh bo'lishi mumkin emas")

    // Usernames must be unique across parents AND staff — the single login form (see
    // authActions.login) tries staff first, so a collision would let a parent authenticate
    // as an unrelated staff account whenever both are still on their default password.
    const [existingParentUsernames, existingStaffUsernames] = await Promise.all([
      ctx.runQuery(internal.bogcha.children.listParentUsernames, {}),
      ctx.runQuery(internal.bogcha.staff.listUsernames, {}),
    ])
    const parentUsername = generateLoginFromName(trimmedParentFullName, [...existingParentUsernames, ...existingStaffUsernames], 'otaona')
    const parentPasswordHash = hashPassword(parentUsername)

    const childId = await ctx.runMutation(internal.bogcha.children.insertChildWithParent, {
      groupId,
      fullName: trimmedFullName,
      birthDate,
      parentFullName: trimmedParentFullName,
      parentUsername,
      parentPasswordHash,
      parentPhone,
    })

    return { childId, parentUsername, parentPassword: parentUsername }
  },
})
