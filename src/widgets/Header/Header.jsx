import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun, LogOut, User } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { useThemeStore } from '@/shared/lib/store/themeStore'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { BOGCHA_ROLES, BOGCHA_ROUTES } from '@/shared/config/bogcha'

const PAGE_TITLES = {
  [BOGCHA_ROUTES.DASHBOARD]: 'Bosh sahifa',
  [BOGCHA_ROUTES.GROUPS]: 'Guruhlar',
  [BOGCHA_ROUTES.STAFF]: 'Bogcha opalar',
  [BOGCHA_ROUTES.SETTINGS]: 'Sozlamalar',
  [BOGCHA_ROUTES.THREADS]: 'Murojaatlar',
  [BOGCHA_ROUTES.CORRESPONDENCE]: 'Yozishmalar',
  [BOGCHA_ROUTES.STATISTICS]: 'Statistika',
}

const ROLE_LABELS = {
  [BOGCHA_ROLES.SUPERADMIN]: 'Superadmin',
  [BOGCHA_ROLES.OPA]: 'Bogcha opa',
  [BOGCHA_ROLES.PARENT]: 'Ota-ona',
}

function resolveTitle(pathname) {
  if (pathname.startsWith('/guruhlar/')) return 'Guruh'
  if (pathname.startsWith('/bola/')) return 'Bola profili'
  return PAGE_TITLES[pathname] ?? 'Bogcha'
}

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const role = useBogchaAuthStore((s) => s.role)
  const fullName = useBogchaAuthStore((s) => s.fullName)
  const logout = useBogchaAuthStore((s) => s.logout)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/60 bg-background/70 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        <motion.h1
          key={resolveTitle(location.pathname)}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className="text-lg font-semibold text-foreground sm:text-xl"
        >
          {resolveTitle(location.pathname)}
        </motion.h1>
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Mavzuni almashtirish">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </motion.span>
          </AnimatePresence>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <User className="size-4" />
              <span className="hidden sm:inline">{fullName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex flex-col gap-1.5">
              <span className="text-foreground">{fullName}</span>
              <Badge variant={role === BOGCHA_ROLES.SUPERADMIN ? 'default' : 'secondary'} className="w-fit">
                {ROLE_LABELS[role]}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout()
                navigate(BOGCHA_ROUTES.LOGIN, { replace: true })
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              Chiqish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
