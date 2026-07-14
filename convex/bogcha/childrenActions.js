'use node'

import { v } from 'convex/values'
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

    const existingUsernames = await ctx.runQuery(internal.bogcha.children.listParentUsernames, {})
    const parentUsername = generateLoginFromName(parentFullName, existingUsernames, 'otaona')
    const parentPasswordHash = hashPassword(parentUsername)

    const childId = await ctx.runMutation(internal.bogcha.children.insertChildWithParent, {
      groupId,
      fullName,
      birthDate,
      parentFullName,
      parentUsername,
      parentPasswordHash,
      parentPhone,
    })

    return { childId, parentUsername, parentPassword: parentUsername }
  },
})
