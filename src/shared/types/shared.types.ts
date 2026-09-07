import type { UserPlanType } from '@/src/domains/users/types/user.types'
import type { ComponentType } from "react"


export interface MenuRoute {
  href: string
  icon: ComponentType<{ className?: string }>
  label: string
  rolAccess: UserPlanType[]
}

export type NavItems = MenuRoute[]

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface PaginationInput { 
  limit?: number;
  offset?: number
}