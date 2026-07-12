import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ROUTES } from '@/shared/config/constants'
import { useAuthStore } from '@/entities/session/model/store'

export function RequireSuperAdmin({ children }) {
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin)

  useEffect(() => {
    if (!isSuperAdmin) {
      toast.error('Bu sahifa faqat superadmin uchun mavjud')
    }
  }, [isSuperAdmin])

  if (!isSuperAdmin) return <Navigate to={ROUTES.DASHBOARD} replace />
  return children
}
