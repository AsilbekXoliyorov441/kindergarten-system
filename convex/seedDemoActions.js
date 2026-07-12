'use node'

import { internalAction } from './_generated/server'
import { internal, api } from './_generated/api'
import { hashPassword, generateToken } from './lib/passwords'

const DEMO_PASSWORD = 'Demo#2026'

const TEACHERS = [
  { username: 'demo_admin', fullName: 'Aziza Rustamova', isSuperAdmin: true },
  { username: 'demo_teacher', fullName: 'Botir Ermatov', isSuperAdmin: false },
]

const GROUPS = [
  {
    teacherIndex: 0,
    name: '9-A matematika',
    students: [
      'Aziz Karimov',
      'Malika Yusupova',
      'Sardor Rahimov',
      'Dilnoza Ergasheva',
      'Jasur Toshpulatov',
      'Nodira Xolmatova',
      'Otabek Saidov',
      'Shahnoza Nazarova',
    ],
  },
  {
    teacherIndex: 0,
    name: '10-B ingliz tili',
    students: [
      'Bekzod Islomov',
      'Feruza Abdullayeva',
      "Ulug'bek Mirzayev",
      'Sevinch Qodirova',
      'Farrux Yoldashev',
      'Gulnora Sultonova',
      "Diyorbek Ne'matov",
      'Zarina Umarova',
    ],
  },
  {
    teacherIndex: 1,
    name: "8-A dasturlash asoslari",
    students: [
      'Sanjar Xudoyberdiyev',
      'Madina Aliyeva',
      'Islom Nurmatov',
      'Kamola Sharipova',
      'Ravshan Tursunov',
      'Nigora Boltayeva',
      'Akbar Yusupov',
      'Lobar Ismoilova',
    ],
  },
]

const CATEGORIES = [
  { key: 'uy_vazifasi', max: 5 },
  { key: 'sinf_ishi', max: 2 },
  { key: 'savol_javob', max: 3 },
]

const LESSONS_PER_GROUP = 8
const LESSON_STEP_DAYS = 4

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

function lessonDates(count, stepDays) {
  const dates = []
  const today = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i * stepDays)
    dates.push(isoDate(d))
  }
  return dates
}

function randomScore(max) {
  if (Math.random() < 0.35) return 0
  return 1 + Math.floor(Math.random() * max)
}

/** Builds a fully independent demo dataset (teachers, groups, students, lessons, coin
 * entries, gift redemptions) by driving the real public mutations/actions exactly like the
 * app UI would, so the demo deployment ends up structurally identical to production data
 * without ever touching it. Safe to run only once — aborts if the demo teacher already
 * exists. Run via: npx convex run seedDemoActions:run '{}' */
export const run = internalAction({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.runQuery(internal.auth.getTeacherByUsername, { username: TEACHERS[0].username })
    if (existing) return { ok: false, error: 'Demo data already seeded' }

    await ctx.runMutation(internal.gifts.seedDefaults, {})
    const gifts = await ctx.runQuery(api.gifts.list, {})
    const giftsByPriceAsc = [...gifts].sort((a, b) => a.price - b.price)

    const teacherCreds = []
    const teacherTokens = []
    for (const teacher of TEACHERS) {
      const passwordHash = hashPassword(DEMO_PASSWORD)
      const teacherId = await ctx.runMutation(internal.auth.insertTeacher, {
        username: teacher.username,
        passwordHash,
        fullName: teacher.fullName,
        isSuperAdmin: teacher.isSuperAdmin,
      })
      const token = generateToken()
      await ctx.runMutation(internal.auth.createSession, { token, role: 'teacher', userId: teacherId })
      teacherTokens.push(token)
      teacherCreds.push({ username: teacher.username, password: DEMO_PASSWORD, fullName: teacher.fullName })
    }

    const sampleStudentCreds = []
    let totalStudents = 0
    let totalLessons = 0
    let totalRedemptions = 0

    for (const group of GROUPS) {
      const token = teacherTokens[group.teacherIndex]
      const groupId = await ctx.runMutation(api.groups.create, { token, name: group.name })

      const studentIds = []
      const balances = new Map()
      for (const fullName of group.students) {
        const student = await ctx.runAction(api.studentsActions.create, { token, groupId, fullName })
        studentIds.push(student.id)
        balances.set(student.id, 0)
        totalStudents += 1
        if (studentIds.length === 1) {
          sampleStudentCreds.push({ group: group.name, fullName, login: student.login, password: student.password })
        }
      }

      const dates = lessonDates(LESSONS_PER_GROUP, LESSON_STEP_DAYS)
      for (const date of dates) {
        const scores = []
        for (const studentId of studentIds) {
          for (const category of CATEGORIES) {
            const value = randomScore(category.max)
            if (value <= 0) continue
            scores.push({ studentId, category: category.key, value })
            balances.set(studentId, balances.get(studentId) + value)
          }
        }
        await ctx.runMutation(api.lessons.saveSession, { token, groupId, scores, date })
        totalLessons += 1
      }

      const topStudents = [...balances.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2)
      for (const [studentId, balance] of topStudents) {
        const affordable = giftsByPriceAsc.filter((g) => g.price <= balance)
        if (affordable.length === 0) continue
        const gift = affordable[affordable.length - 1]
        await ctx.runMutation(api.transactions.redeemGift, { token, studentId, giftId: gift._id })
        totalRedemptions += 1
      }
    }

    for (const token of teacherTokens) {
      await ctx.runMutation(api.auth.logout, { token })
    }

    return {
      ok: true,
      teachers: teacherCreds,
      sampleStudents: sampleStudentCreds,
      counts: {
        teachers: TEACHERS.length,
        groups: GROUPS.length,
        students: totalStudents,
        lessons: totalLessons,
        gifts: gifts.length,
        redemptions: totalRedemptions,
      },
    }
  },
})
