import { UserRole } from "@/src/domains/users/types/user.types"

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

