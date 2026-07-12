import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { useAuthStore } from '@/entities/session/model/store'
import { NAV_ITEMS } from '@/widgets/Sidebar/navItems'

export function MobileNav() {
  const role = useAuthStore((s) => s.role)
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role))

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
          <item.icon className="size-6 shrink-0" />
          {/* <span className="w-full truncate text-center leading-tight">{item.label}</span> */}
        </NavLink>
      ))}
    </nav>
  )
}
