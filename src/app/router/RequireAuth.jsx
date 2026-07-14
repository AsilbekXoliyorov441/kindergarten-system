import { Navigate, useLocation } from 'react-router-dom'
import { BOGCHA_ROUTES } from '@/shared/config/bogcha'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'

export function RequireAuth({ children }) {
  const role = useBogchaAuthStore((s) => s.role)
  const location = useLocation()

  if (!role) return <Navigate to={BOGCHA_ROUTES.LOGIN} replace state={{ from: location }} />
  return children
}
