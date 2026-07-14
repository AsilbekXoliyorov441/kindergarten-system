import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { BOGCHA_ROLES, BOGCHA_ROUTES } from '@/shared/config/bogcha'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'

export function RequireSuperAdmin({ children }) {
  const role = useBogchaAuthStore((s) => s.role)
  const isSuperAdmin = role === BOGCHA_ROLES.SUPERADMIN

  useEffect(() => {
    if (!isSuperAdmin) {
      toast.error('Bu sahifa faqat superadmin uchun mavjud')
    }
  }, [isSuperAdmin])

  if (!isSuperAdmin) return <Navigate to={BOGCHA_ROUTES.DASHBOARD} replace />
  return children
}
