export const BOGCHA_ROLES = {
  SUPERADMIN: 'superadmin',
  OPA: 'opa',
  PARENT: 'parent',
}

export const DEFAULT_FEE_PER_DAY = 28000

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
}

export const BOGCHA_ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  GROUPS: '/guruhlar',
  GROUP_DETAIL: '/guruhlar/:groupId',
  groupDetail: (id) => `/guruhlar/${id}`,
  CHILD_PROFILE: '/bola/:childId',
  childProfile: (id) => `/bola/${id}`,
  STAFF: '/xodimlar',
  SETTINGS: '/sozlamalar',
  THREADS: '/murojaatlar',
  CORRESPONDENCE: '/yozishmalar',
  STATISTICS: '/statistika',
}

export const FEEDBACK_RECIPIENT = {
  OPA: 'opa',
  DIRECTOR: 'director',
}

export const FEEDBACK_RECIPIENT_LABELS = {
  [FEEDBACK_RECIPIENT.OPA]: 'Bogcha opa',
  [FEEDBACK_RECIPIENT.DIRECTOR]: 'Direktor',
}

export const FEEDBACK_CATEGORY = {
  COMPLAINT: 'shikoyat',
  SUGGESTION: 'taklif',
  COMPLIMENT: 'maqtov',
}

/** Fixed order — never cycled/reordered — so the same category always reads the same
 * color everywhere (chat, lists, filters, charts). */
export const FEEDBACK_CATEGORY_LIST = [FEEDBACK_CATEGORY.COMPLAINT, FEEDBACK_CATEGORY.SUGGESTION, FEEDBACK_CATEGORY.COMPLIMENT]

export const FEEDBACK_CATEGORY_META = {
  [FEEDBACK_CATEGORY.COMPLAINT]: { label: 'Shikoyat', dotClass: 'bg-feedback-shikoyat', textClass: 'text-feedback-shikoyat', cssVar: 'var(--feedback-shikoyat)' },
  [FEEDBACK_CATEGORY.SUGGESTION]: { label: 'Taklif', dotClass: 'bg-feedback-taklif', textClass: 'text-feedback-taklif', cssVar: 'var(--feedback-taklif)' },
  [FEEDBACK_CATEGORY.COMPLIMENT]: { label: 'Maqtov', dotClass: 'bg-feedback-maqtov', textClass: 'text-feedback-maqtov', cssVar: 'var(--feedback-maqtov)' },
}
