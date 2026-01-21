'use client'

import { Button } from '@/src/shared/ui/button'
import { UserRole } from '@domains/users/types'
import { LogOut } from 'lucide-react'

type Props = {
  user?: {
    name?: string
    artisticName?: string
    role?: UserRole
  } | null
  onLogout: () => void
}

export function SidebarUser({ user, onLogout }: Props) {
  return (
    <div className="p-4 border-t border-[#2a3444]">
      <div className="flex items-center gap-3 px-2 mb-4">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-sm font-medium text-primary">
            {user?.name?.charAt(0) ?? 'U'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user?.artisticName || user?.name || 'Usuario'}
          </p>
          <p className="text-xs text-white/60 truncate">
            {user?.role === UserRole.AUTOR ? 'Compositor' : 'Invitado'}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
        onClick={onLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar sesión
      </Button>
    </div>
  )
}