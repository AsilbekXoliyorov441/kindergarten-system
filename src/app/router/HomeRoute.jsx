import { Navigate } from 'react-router-dom'
import { BOGCHA_ROLES, BOGCHA_ROUTES } from '@/shared/config/bogcha'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { BogchaDashboardPage } from '@/pages/BogchaDashboardPage/BogchaDashboardPage'

export function HomeRoute() {
  const role = useBogchaAuthStore((s) => s.role)
  const childId = useBogchaAuthStore((s) => s.childId)

  if (role === BOGCHA_ROLES.PARENT) return <Navigate to={BOGCHA_ROUTES.childProfile(childId)} replace />
  return <BogchaDashboardPage />
}
