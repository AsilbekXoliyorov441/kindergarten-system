import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, KeyRound, Users } from 'lucide-react'
import { StudentAvatar } from '@/entities/student/ui/StudentAvatar'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/empty-state'
import { RemoveStudentDialog } from '@/features/remove-student/ui/RemoveStudentDialog'
import { getStudentBalance } from '@/shared/lib/stats'
import { formatUzDate } from '@/shared/lib/date'
import { ROUTES } from '@/shared/config/constants'

export function StudentRosterTable({ students, transactions }) {
  if (students.length === 0) {
    return <EmptyState icon={Users} title="O'quvchilar yo'q" description="Guruhga birinchi o'quvchini qo'shing." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
            <th className="py-2.5 font-medium">O'quvchi</th>
            <th className="py-2.5 font-medium">Qo'shilgan sana</th>
            <th className="py-2.5 font-medium">Login</th>
            <th className="py-2.5 text-right font-medium">Coinlar</th>
            <th className="py-2.5" />
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <motion.tr
              key={student.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              className="border-b border-border/40 last:border-0"
            >
              <td className="py-3">
                <Link to={ROUTES.studentProfile(student.id)} className="flex items-center gap-2.5 hover:underline">
                  <StudentAvatar student={student} size="sm" />
                  <span className="font-medium text-foreground">{student.fullName}</span>
                </Link>
              </td>
              <td className="py-3 text-muted-foreground">{formatUzDate(student.joinedAt)}</td>
              <td className="py-3">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                  <KeyRound className="size-3" />
                  {student.login}
                </span>
              </td>
              <td className="py-3 text-right">
                <Badge variant="coin">{getStudentBalance(student.id, transactions)} coin</Badge>
              </td>
              <td className="py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button asChild variant="ghost" size="icon" className="size-8">
                    <Link to={ROUTES.studentProfile(student.id)} aria-label="Profilni ko'rish">
                      <Eye className="size-4" />
                    </Link>
                  </Button>
                  <RemoveStudentDialog student={student} />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
