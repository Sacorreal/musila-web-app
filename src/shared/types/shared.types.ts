import type { UserRole } from '@/src/domains/users/types/user.type'
import type { ComponentType } from "react"


export interface MenuRoute {
  href: string
  icon: ComponentType<{ className?: string }>
  label: string
  rolAccess: UserRole[]
}

export type NavItems = MenuRoute[]