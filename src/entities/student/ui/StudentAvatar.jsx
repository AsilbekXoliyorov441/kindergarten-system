import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { cn } from '@/shared/lib/utils'
import { getInitials } from '@/entities/student/lib/getInitials'

const PALETTE = [
  'from-blue-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-fuchsia-500 to-pink-500',
  'from-sky-500 to-cyan-500',
  'from-violet-500 to-purple-500',
]

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const SIZE_CLASSES = {
  sm: 'size-8 text-xs',
  default: 'size-10 text-sm',
  lg: 'size-16 text-lg',
}

function StudentAvatar({ student, className, size = 'default' }) {
  const initials = getInitials(student.fullName) || '?'
  const palette = PALETTE[hashString(student.fullName || student.id) % PALETTE.length]

  return (
    <Avatar className={cn(SIZE_CLASSES[size], className)}>
      {student.avatar && <AvatarImage src={student.avatar} alt={student.fullName} />}
      <AvatarFallback className={cn('bg-linear-to-br text-white', palette)}>{initials}</AvatarFallback>
    </Avatar>
  )
}

export { StudentAvatar }
