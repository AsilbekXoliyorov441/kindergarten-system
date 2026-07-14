import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { useMyThreads, useUnreadThreadCount } from '@/entities/bogcha-thread/model/store'
import { NAV_ITEMS } from '@/widgets/Sidebar/navItems'

export function MobileNav() {
  const role = useBogchaAuthStore((s) => s.role)
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role))
  const unreadCount = useUnreadThreadCount(useMyThreads())

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-border/60 bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      aria-label="Asosiy navigatsiya"
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-0.5 px-1 py-5 text-[10px] font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )
          }
        >
          <span className="relative">
            <item.icon className="size-6 shrink-0" />
            {item.showUnreadBadge && unreadCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-semibold text-destructive-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </span>
          {/* <span className="w-full truncate text-center leading-tight">{item.label}</span> */}
        </NavLink>
      ))}
    </nav>
  )
}
