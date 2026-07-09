export const ROLES = {
  TEACHER: 'teacher',
  STUDENT: 'student',
}

/** Fixed coin categories and their per-lesson max value — enforced across every coin input. */
export const COIN_CATEGORIES = {
  uy_vazifasi: { key: 'uy_vazifasi', label: 'Uy vazifasi', max: 5 },
  sinf_ishi: { key: 'sinf_ishi', label: 'Sinf ishi', max: 2 },
  savol_javob: { key: 'savol_javob', label: "Savol-javob", max: 3 },
}

export const COIN_CATEGORY_LIST = Object.values(COIN_CATEGORIES)

export const LESSONS_PER_MONTH = 12

export const TRANSACTION_TYPES = {
  COIN_GIVEN: 'coin_given',
  GIFT_REDEEMED: 'gift_redeemed',
}

export const STUDENT_STATUS = {
  ACTIVE: 'active',
  REMOVED: 'removed',
}

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  GROUPS: '/guruhlar',
  GROUP_DETAIL: '/guruhlar/:groupId',
  groupDetail: (id) => `/guruhlar/${id}`,
  STUDENT_PROFILE: '/oquvchi/:studentId',
  studentProfile: (id) => `/oquvchi/${id}`,
  COIN_MARKET: '/coin-market',
  LEADERBOARD: '/reyting',
  SETTINGS: '/sozlamalar',
}
