'use client'

import { GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/components/app/nav-items'
import { useAppUI } from '@/components/app/ui-context'
import { useOnline } from '@/hooks/use-online'

export function Sidebar() {
  const { view, setView } = useAppUI()
  const online = useOnline()

  return (
    <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-sidebar-border lg:bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <GraduationCap className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight">Studyflow</span>
          <span className="text-xs text-muted-foreground leading-tight">Student planner</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = view === item.id
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <item.icon className={cn('size-[18px]', active && 'text-primary')} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-2 rounded-xl bg-sidebar-accent/40 px-3 py-2 text-xs">
          <span className={cn('size-2 rounded-full', online ? 'bg-success' : 'bg-muted-foreground')} />
          <span className="text-muted-foreground">
            {online ? 'Online — data is local & safe' : 'Offline — everything still works'}
          </span>
        </div>
      </div>
    </aside>
  )
}
