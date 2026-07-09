import { TRANSACTION_TYPES } from '@/shared/config/constants'

/** Total coins = sum of coin_given amounts minus sum of gift_redeemed amounts, from the archive log. */
export function getStudentBalance(studentId, transactions) {
  return transactions
    .filter((t) => t.studentId === studentId)
    .reduce((sum, t) => (t.type === TRANSACTION_TYPES.COIN_GIVEN ? sum + t.amount : sum - t.amount), 0)
}

export function getTotalCoinsDistributed(transactions) {
  return transactions
    .filter((t) => t.type === TRANSACTION_TYPES.COIN_GIVEN)
    .reduce((sum, t) => sum + t.amount, 0)
}
