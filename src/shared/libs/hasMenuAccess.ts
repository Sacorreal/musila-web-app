import { UserPlanType } from "@/src/domains/users/types/user.types"

const USER_PLAN_TYPE_VALUES = Object.values(UserPlanType) as string[]

/** Mapeo de planes de API (JWT/legacy) a UserPlanType para control de acceso. */
const API_ROLE_TO_MENU: Record<string, UserPlanType[]> = {
    COMPOSER: [UserPlanType.PLAN_AUTOR, UserPlanType.PLAN_360],
    INTERPRETER: [UserPlanType.PLAN_DESCUBRIDOR],
    PLAN_DESCUBRIDOR: [UserPlanType.PLAN_DESCUBRIDOR],
    ADMIN: [UserPlanType.ADMIN],
    SUPERADMIN: [UserPlanType.SUPERADMIN],
    INVITADO: [UserPlanType.INVITADO],
    PLAN_AUTOR: [UserPlanType.PLAN_AUTOR],
    PLAN_360: [UserPlanType.PLAN_360],
    EDITOR: [UserPlanType.EDITOR],
}

/**
 * Indica si un plan (JWT/API o UserPlanType) tiene acceso a una ruta según rolAccess.
 * - undefined: se trata como INVITADO.
 * - Plan en formato API (COMPOSER, INTERPRETER, etc.): se mapea a UserPlanType.
 * - Plan ya en formato UserPlanType (plan_descubridor, plan_autor, etc.): se usa tal cual.
 */
export function hasMenuAccess(
    planType: UserPlanType | string | undefined,
    rolAccess: UserPlanType[]
): boolean {
    if (planType == null || planType === "") {
        return rolAccess.includes(UserPlanType.INVITADO)
    }
    const normalized = String(planType).toLowerCase()
    const mapped = API_ROLE_TO_MENU[normalized.toUpperCase()] ?? API_ROLE_TO_MENU[planType as string]
    if (mapped) return mapped.some((r) => rolAccess.includes(r))
    if (USER_PLAN_TYPE_VALUES.includes(normalized)) {
        return rolAccess.includes(normalized as UserPlanType)
    }
    return rolAccess.includes(planType as UserPlanType)
}
