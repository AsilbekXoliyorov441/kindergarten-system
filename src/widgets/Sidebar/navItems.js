import { LayoutDashboard, Users, ShieldCheck, Settings2, MessageCircle, MessagesSquare, BarChart3 } from 'lucide-react'
import { BOGCHA_ROLES, BOGCHA_ROUTES } from '@/shared/config/bogcha'

export const NAV_ITEMS = [
  {
    to: BOGCHA_ROUTES.DASHBOARD,
    label: 'Bosh sahifa',
    icon: LayoutDashboard,
    roles: [BOGCHA_ROLES.SUPERADMIN, BOGCHA_ROLES.OPA],
  },
  { to: BOGCHA_ROUTES.GROUPS, label: 'Guruhlar', icon: Users, roles: [BOGCHA_ROLES.SUPERADMIN] },
  { to: BOGCHA_ROUTES.STAFF, label: 'Bogcha opalar', icon: ShieldCheck, roles: [BOGCHA_ROLES.SUPERADMIN] },
  {
    to: BOGCHA_ROUTES.THREADS,
    label: 'Murojaatlar',
    icon: MessageCircle,
    roles: [BOGCHA_ROLES.SUPERADMIN, BOGCHA_ROLES.OPA, BOGCHA_ROLES.PARENT],
    showUnreadBadge: true,
  },
  { to: BOGCHA_ROUTES.CORRESPONDENCE, label: 'Yozishmalar', icon: MessagesSquare, roles: [BOGCHA_ROLES.SUPERADMIN] },
  { to: BOGCHA_ROUTES.STATISTICS, label: 'Statistika', icon: BarChart3, roles: [BOGCHA_ROLES.SUPERADMIN] },
  { to: BOGCHA_ROUTES.SETTINGS, label: 'Sozlamalar', icon: Settings2, roles: [BOGCHA_ROLES.SUPERADMIN] },
]
