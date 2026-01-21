import type { UserRole } from "@domains/users/types"
import type { ComponentType } from "react"

export interface MenuRoute {
    href: string
    icon: ComponentType<{ className?: string }>
    label: string
    rolAccess: UserRole[]
}

export type NavItems = MenuRoute[]