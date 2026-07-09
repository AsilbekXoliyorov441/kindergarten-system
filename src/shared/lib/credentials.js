function translit(str) {
  return str
    .toLowerCase()
    .replace(/o'|oʻ|o‘/g, 'o')
    .replace(/g'|gʻ|g‘/g, 'g')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '')
}

export function generateStudentLogin(fullName, existingLogins = []) {
  const [firstName = 'oquvchi'] = fullName.trim().split(/\s+/)
  const base = translit(firstName) || 'oquvchi'
  let login = base
  let suffix = 1
  while (existingLogins.includes(login)) {
    login = `${base}${suffix}`
    suffix += 1
  }
  return login
}

export function generateStudentPassword() {
  return Math.random().toString(36).slice(-6)
}
