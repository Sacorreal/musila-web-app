'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, Users, Wallet, UserCircle, LogOut } from 'lucide-react'
import { MusilaLogo } from '@/src/shared/components/Icons/icons'
import { SidebarToggle } from '@/src/shared/components/Layout/sidebar/SidebarToggle'
import { cn } from '@/src/shared/libs/cn'
import { useAffiliateAuth } from '../../hooks/use-affiliate-auth'

const NAV_ITEMS = [
  { href: '/programa-afiliados/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/programa-afiliados/dashboard/referidos', label: 'Referidos', icon: Users },
  { href: '/programa-afiliados/dashboard/comisiones', label: 'Comisiones', icon: Wallet },
  { href: '/programa-afiliados/dashboard/perfil', label: 'Perfil', icon: UserCircle },
]

export function AffiliateSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { logoutAffiliate } = useAffiliateAuth()

  return (
    <>
      <SidebarToggle isOpen={isOpen} onToggle={() => setIsOpen((p) => !p)} />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/programa-afiliados/dashboard" className="flex items-center">
            <MusilaLogo className="h-10 w-auto" />
          </Link>
          <p className="text-xs text-muted-foreground mt-2 font-semibold uppercase tracking-widest">
            Programa de Afiliados
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <button
            onClick={async () => {
              await logoutAffiliate()
              router.push('/programa-afiliados/login')
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 group font-bold uppercase tracking-widest text-xs cursor-pointer"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
