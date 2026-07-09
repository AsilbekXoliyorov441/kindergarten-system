import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/shared/config/constants'
import { useAuthStore } from '@/entities/session/model/store'

export function RequireAuth({ children }) {
  const role = useAuthStore((s) => s.role)
  const location = useLocation()

  if (!role) return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  return children
}
