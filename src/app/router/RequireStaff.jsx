import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { BOGCHA_ROLES, BOGCHA_ROUTES } from '@/shared/config/bogcha'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'

export function RequireStaff({ children }) {
  const role = useBogchaAuthStore((s) => s.role)
  const isStaff = role === BOGCHA_ROLES.SUPERADMIN || role === BOGCHA_ROLES.OPA

  useEffect(() => {
    if (!isStaff) {
      toast.error("Bu sahifa faqat xodimlar uchun mavjud")
    }
  }, [isStaff])

  if (!isStaff) return <Navigate to={BOGCHA_ROUTES.DASHBOARD} replace />
  return children
}
