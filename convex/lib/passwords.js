'use node'

import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'
import { Buffer } from 'node:buffer'

/** Only importable from "use node" action files — needs real Node crypto (random salt, scrypt). */

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':')
  const hashBuffer = Buffer.from(hash, 'hex')
  const suppliedBuffer = scryptSync(password, salt, 64)
  return hashBuffer.length === suppliedBuffer.length && timingSafeEqual(hashBuffer, suppliedBuffer)
}

export function generateToken() {
  return randomBytes(32).toString('hex')
}
