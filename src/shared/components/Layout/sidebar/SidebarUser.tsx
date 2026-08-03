'use client'

import { UserPlanType } from '@/src/domains/users/types/user.types'
import { Button } from '@/src/shared/components/UI/button'
import { LogOut } from 'lucide-react'

const PLAN_TYPE_LABELS: Record<UserPlanType, string> = {
  [UserPlanType.SUPERADMIN]: 'Superadmin',
  [UserPlanType.ADMIN]: 'Admin',
  [UserPlanType.PLAN_AUTOR]: 'Plan Autor',
  [UserPlanType.PLAN_360]: 'Plan 360',
  [UserPlanType.PLAN_DESCUBRIDOR]: 'Plan Descubridor',
  [UserPlanType.INVITADO]: 'Invitado',
  [UserPlanType.EDITOR]: 'Editor',
}

type Props = {
  user?: {
    name?: string
    artisticName?: string
    planType?: UserPlanType
  } | null
  onLogout: () => void
}

export function SidebarUser({ user, onLogout }: Props) {
  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center gap-3 px-2 mb-4">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-sm font-medium text-primary">
            {user?.name?.charAt(0) ?? 'U'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {user?.artisticName || user?.name || 'Usuario'}
          </p>
          <p className="text-xs text-sidebar-foreground/60 truncate">
            {user?.planType ? PLAN_TYPE_LABELS[user.planType] : 'Invitado'}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        onClick={onLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar sesión
      </Button>
    </div>
  )
}