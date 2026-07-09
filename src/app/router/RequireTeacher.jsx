import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ROLES, ROUTES } from '@/shared/config/constants'
import { useAuthStore } from '@/entities/session/model/store'

export function RequireTeacher({ children }) {
  const role = useAuthStore((s) => s.role)

  useEffect(() => {
    if (role === ROLES.STUDENT) {
      toast.error("Bu sahifa faqat o'qituvchi uchun mavjud")
    }
  }, [role])

  if (role !== ROLES.TEACHER) return <Navigate to={ROUTES.LEADERBOARD} replace />
  return children
}
