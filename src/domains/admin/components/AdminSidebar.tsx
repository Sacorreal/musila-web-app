'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Music, Headphones, FileText, ArrowLeft, Shield } from 'lucide-react'
import { cn } from '@/src/shared/libs/cn'
import { MusilaLogo } from '@/src/shared/components/Icons/icons'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/users', icon: Users, label: 'Usuarios' },
  { href: '/admin/genres', icon: Music, label: 'Géneros' },
  { href: '/admin/tracks', icon: Headphones, label: 'Tracks' },
  { href: '/admin/requests', icon: FileText, label: 'Solicitudes' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl md:flex">
      {/* Logo + badge */}
      <div className="flex flex-col gap-2 px-6 py-6 border-b border-sidebar-border">
        <MusilaLogo className="h-8 w-auto" />
        <div className="flex items-center gap-1.5 mt-1">
          <Shield className="h-3.5 w-3.5 text-red-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
            Panel Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  active ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground',
                )}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer — back to app */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <Link
          href="/music"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Volver a la App
        </Link>
      </div>
    </aside>
  )
}
