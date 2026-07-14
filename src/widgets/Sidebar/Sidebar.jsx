import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Baby } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useBogchaAuthStore } from '@/entities/bogcha-session/model/store'
import { useMyThreads, useUnreadThreadCount } from '@/entities/bogcha-thread/model/store'
import { NAV_ITEMS } from '@/widgets/Sidebar/navItems'

export function Sidebar() {
  const role = useBogchaAuthStore((s) => s.role)
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role))
  const unreadCount = useUnreadThreadCount(useMyThreads())

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-card/40 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary-hover text-primary-foreground shadow-sm">
          <Baby className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-foreground">Bogcha</p>
          <p className="text-xs text-muted-foreground">Yoqlama va hisobot tizimi</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-secondary"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className="relative z-10 size-4" />
                <span className="relative z-10">{item.label}</span>
                {item.showUnreadBadge && unreadCount > 0 && (
                  <span className="relative z-10 ml-auto flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-5 text-xs text-muted-foreground/70">© {new Date().getFullYear()} Bogcha</div>
    </aside>
  )
}
