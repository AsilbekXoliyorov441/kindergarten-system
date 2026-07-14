import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  teachers: defineTable({
    username: v.string(),
    passwordHash: v.string(),
    fullName: v.string(),
    isSuperAdmin: v.optional(v.boolean()),
  }).index('by_username', ['username']),

  students: defineTable({
    groupId: v.id('groups'),
    fullName: v.string(),
    avatar: v.union(v.string(), v.null()),
    joinedAt: v.string(),
    login: v.string(),
    passwordHash: v.string(),
    status: v.union(v.literal('active'), v.literal('removed')),
  })
    .index('by_login', ['login'])
    .index('by_group', ['groupId']),

  groups: defineTable({
    name: v.string(),
    createdAt: v.string(),
    teacherId: v.optional(v.id('teachers')),
  }).index('by_teacher', ['teacherId']),

  lessons: defineTable({
    groupId: v.id('groups'),
    date: v.string(),
    lessonNumber: v.number(),
    monthIndex: v.number(),
  }).index('by_group', ['groupId']),

  coinEntries: defineTable({
    studentId: v.id('students'),
    lessonId: v.id('lessons'),
    category: v.union(v.literal('uy_vazifasi'), v.literal('sinf_ishi'), v.literal('savol_javob')),
    value: v.number(),
    maxValue: v.number(),
    givenAt: v.string(),
  })
    .index('by_lesson', ['lessonId'])
    .index('by_student', ['studentId']),

  transactions: defineTable({
    studentId: v.id('students'),
    type: v.union(v.literal('coin_given'), v.literal('gift_redeemed')),
    amount: v.number(),
    relatedEntryId: v.optional(v.id('coinEntries')),
    relatedGiftId: v.optional(v.id('gifts')),
    timestamp: v.string(),
  }).index('by_student', ['studentId']),

  gifts: defineTable({
    name: v.string(),
    icon: v.optional(v.string()),
    image: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    link: v.optional(v.string()),
    price: v.number(),
  }),

  sessions: defineTable({
    token: v.string(),
    role: v.union(v.literal('teacher'), v.literal('student')),
    userId: v.union(v.id('teachers'), v.id('students')),
    createdAt: v.number(),
  }).index('by_token', ['token']),

  // --- Bogcha (kindergarten) module — fully separate from the coin-system tables above ---

  bogchaStaff: defineTable({
    username: v.string(),
    passwordHash: v.string(),
    fullName: v.string(),
    role: v.union(v.literal('superadmin'), v.literal('opa')),
    phone: v.optional(v.string()),
    status: v.union(v.literal('active'), v.literal('archived')),
  }).index('by_username', ['username']),

  bogchaGroups: defineTable({
    name: v.string(),
    createdAt: v.string(),
    status: v.union(v.literal('active'), v.literal('archived')),
  }),

  bogchaGroupStaff: defineTable({
    groupId: v.id('bogchaGroups'),
    staffId: v.id('bogchaStaff'),
  })
    .index('by_group', ['groupId'])
    .index('by_staff', ['staffId']),

  bogchaChildren: defineTable({
    groupId: v.id('bogchaGroups'),
    fullName: v.string(),
    birthDate: v.optional(v.string()),
    joinedAt: v.string(),
    status: v.union(v.literal('active'), v.literal('archived')),
  }).index('by_group', ['groupId']),

  bogchaParents: defineTable({
    childId: v.id('bogchaChildren'),
    username: v.string(),
    passwordHash: v.string(),
    fullName: v.string(),
    phone: v.optional(v.string()),
  })
    .index('by_username', ['username'])
    .index('by_child', ['childId']),

  bogchaAttendance: defineTable({
    childId: v.id('bogchaChildren'),
    groupId: v.id('bogchaGroups'),
    date: v.string(), // YYYY-MM-DD
    status: v.union(v.literal('present'), v.literal('absent')),
    reason: v.optional(v.string()),
    markedBy: v.id('bogchaStaff'),
    markedAt: v.string(),
  })
    .index('by_child_date', ['childId', 'date'])
    .index('by_group_date', ['groupId', 'date']),

  bogchaSettings: defineTable({
    feePerDay: v.number(),
  }),

  bogchaSessions: defineTable({
    token: v.string(),
    role: v.union(v.literal('superadmin'), v.literal('opa'), v.literal('parent')),
    userId: v.union(v.id('bogchaStaff'), v.id('bogchaParents')),
    createdAt: v.number(),
  }).index('by_token', ['token']),

  bogchaThreads: defineTable({
    parentId: v.id('bogchaParents'),
    childId: v.id('bogchaChildren'),
    groupId: v.id('bogchaGroups'),
    recipient: v.union(v.literal('opa'), v.literal('director')),
    category: v.union(v.literal('shikoyat'), v.literal('taklif'), v.literal('maqtov')),
    createdAt: v.string(),
    lastMessageAt: v.string(),
  })
    .index('by_parent', ['parentId'])
    .index('by_group_recipient', ['groupId', 'recipient'])
    .index('by_recipient', ['recipient']),

  bogchaMessages: defineTable({
    threadId: v.id('bogchaThreads'),
    senderRole: v.union(v.literal('parent'), v.literal('opa'), v.literal('superadmin')),
    senderId: v.union(v.id('bogchaParents'), v.id('bogchaStaff')),
    text: v.string(),
    createdAt: v.string(),
  }).index('by_thread', ['threadId']),

  bogchaThreadReads: defineTable({
    threadId: v.id('bogchaThreads'),
    userId: v.union(v.id('bogchaParents'), v.id('bogchaStaff')),
    lastReadAt: v.string(),
  })
    .index('by_thread_user', ['threadId', 'userId'])
    .index('by_user', ['userId']),
})
