'use client'

import { useAuthStore } from '@domains/auth/store/useAuthStore'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

import { cn } from '@/src/shared/libs/utils'
import { hasMenuAccess, navItems } from "../../constants/routes"
import { SidebarLogo } from './SidebarLogo'
import { SidebarNav } from './SidebarNav'
import { SidebarToggle } from './SidebarToggle'
import { SidebarUser } from './SidebarUser'

export function AppSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const { user, logout } = useAuthStore()

  const allowedNavItems = useMemo(
    () => navItems.filter((item) => hasMenuAccess(user?.role, item.rolAccess)),
    [user?.role]
  )

  return (
    <>
      <SidebarToggle isOpen={isOpen} onToggle={() => setIsOpen(p => !p)} />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-[#1a2332] border-r border-[#2a3444] flex flex-col transition-transform duration-200',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <SidebarLogo />

        <SidebarNav
          pathname={pathname}
          items={allowedNavItems}
          onNavigate={() => setIsOpen(false)}
        />

        <SidebarUser user={user} onLogout={logout} />
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
