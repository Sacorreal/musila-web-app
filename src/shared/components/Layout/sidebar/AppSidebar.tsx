'use client'

import { useAuthStore } from '@/src/domains/auth/store/use-auth-store'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { LogOut } from 'lucide-react'

import { useAuth } from '@/src/domains/auth/hooks/use-auth'
import { cn } from '@/src/shared/libs/cn'
import type { MenuRoute } from '@shared/types/shared.types'
import { navItems } from "../../../constants/routes"
import { hasMenuAccess } from '../../../libs/hasMenuAccess'
import { SidebarLogo } from './SidebarLogo'
import { SidebarNav } from './SidebarNav'
import { SidebarToggle } from './SidebarToggle'
import { SidebarUser } from './SidebarUser'
import { useTotalUnreadCount } from '@/src/domains/chat/hooks/use-unread-count.hook'

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const { user } = useAuthStore()
  const { logout } = useAuth()

  const allowedNavItems = useMemo(
    () => navItems.filter((item: MenuRoute) => hasMenuAccess(user?.role, item.rolAccess)),
    [user?.role]
  )

  const unreadChatCount = useTotalUnreadCount()

  return (
    <>
      <SidebarToggle isOpen={isOpen} onToggle={() => setIsOpen(p => !p)} />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-200',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <SidebarLogo />

        <SidebarNav
          pathname={pathname}
          items={allowedNavItems}
          onNavigate={() => setIsOpen(false)}
          unreadChatCount={unreadChatCount}
        />

        {/* Logout Button */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 group font-bold uppercase tracking-widest text-xs cursor-pointer"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Cerrar Sesión
          </button>
        </div>
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
