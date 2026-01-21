import type { NavItems } from "@domains/app/types"
import { UserRole } from "@domains/users/types"
import {
    ChatIcon,
    DashboardIcon,
    GuestUserIcon,
    HomeIcon,
    PlaylistIcon,
    RequestIcon,
    SearchIcon,
    UploadIcon
} from "@shared/components/icons"

export const ALL_ROLES = Object.values(UserRole)

export const navItems: NavItems = [
    {
        href: "/music",
        icon: HomeIcon,
        label: "Inicio",
        rolAccess: ALL_ROLES
    },

    {
        href: "/music/explore",
        icon: SearchIcon,
        label: "Buscar",
        rolAccess: [UserRole.CANTAUTOR, UserRole.INTERPRETE, UserRole.INVITADO]
    },

    {
        href: "/music/my-music",
        icon: PlaylistIcon,
        label: "Mi Música",
        rolAccess: [UserRole.CANTAUTOR, UserRole.INTERPRETE, UserRole.INVITADO]

    },

    {
        href: "/app/upload",
        icon: UploadIcon,
        label: "Publicar",
        rolAccess: [UserRole.AUTOR, UserRole.CANTAUTOR],
    },

    {
        href: "/music/requests",
        icon: RequestIcon,
        label: "Solicitudes",
        rolAccess: [UserRole.AUTOR, UserRole.EDITOR],
    },

    {
        href: '/music/chat',
        icon: ChatIcon,
        label: "Chat",
        rolAccess: ALL_ROLES

    },
    {
        href: "/music/dashboard",
        icon: DashboardIcon,
        label: "Dashboard",
        rolAccess: ALL_ROLES
    },
    {
        href: "/music/guest-user",
        icon: GuestUserIcon,
        label: "Invitar Usuario",
        rolAccess: [UserRole.CANTAUTOR, UserRole.INTERPRETE],
    },
]

const USER_ROLE_VALUES = Object.values(UserRole) as string[]

/** Mapeo de roles de API (JWT/legacy) a UserRole para control de acceso. */
const API_ROLE_TO_MENU: Record<string, UserRole[]> = {
    COMPOSER: [UserRole.AUTOR, UserRole.CANTAUTOR],
    INTERPRETER: [UserRole.INTERPRETE],
    INTERPRETE: [UserRole.INTERPRETE],
    ADMIN: [UserRole.ADMIN],
    INVITADO: [UserRole.INVITADO],
    AUTOR: [UserRole.AUTOR],
    CANTAUTOR: [UserRole.CANTAUTOR],
    EDITOR: [UserRole.EDITOR],
}

/**
 * Indica si un rol (JWT/API o UserRole) tiene acceso a una ruta según rolAccess.
 * - undefined: se trata como INVITADO.
 * - Rol en formato API (COMPOSER, INTERPRETER, etc.): se mapea a UserRole.
 * - Rol ya en formato UserRole (interprete, autor, etc.): se usa tal cual.
 */
export function hasMenuAccess(
    role: UserRole | string | undefined,
    rolAccess: UserRole[]
): boolean {
    if (role == null || role === "") {
        return rolAccess.includes(UserRole.INVITADO)
    }
    const normalized = String(role).toLowerCase()
    const mapped = API_ROLE_TO_MENU[normalized.toUpperCase()] ?? API_ROLE_TO_MENU[role as string]
    if (mapped) return mapped.some((r) => rolAccess.includes(r))
    if (USER_ROLE_VALUES.includes(normalized)) {
        return rolAccess.includes(normalized as UserRole)
    }
    return rolAccess.includes(role as UserRole)
}

