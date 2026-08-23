import { UserPlanType, MusicRole } from "@/src/domains/users/types/user.types";

export interface LoginInput {
    citizenID: string;
    password: string;
}

export interface TokenPayloadDto {
    id: string;
    email: string;
    planType: UserPlanType;
    iat: number;
    exp: number;
    name: string;
    plan?: 'free' | 'pro';
    isVerified?: boolean;
    username?: string;
    usernameIsTemporary?: boolean;
}

export type UserJWTResponse = {
    id: string
    email: string
    planType: UserPlanType
    name: string
    plan?: 'free' | 'pro'
    /** Estado de verificación al momento de emitir el token — solo para UI (banner), no confiar para autorización. */
    isVerified?: boolean
    /** Identidad legal verificada (Ley 527) — solo informativo para decidir si mostrar el bloqueo de UI antes de reproducir/firmar; el backend siempre re-valida. */
    identidadLegalVerificada?: boolean
    /** Nombre de usuario único (sin @). */
    username?: string
    /** true si el username fue asignado automáticamente y aún no ha sido elegido por el usuario — solo informativo para mostrar el modal bloqueante; el backend siempre re-valida. */
    usernameIsTemporary?: boolean
    /** Rol descriptivo (disciplina musical). No viaja en el JWT firmado; se resuelve vía /users/me. */
    role?: MusicRole
    secondName?: string
    lastName?: string
    secondLastName?: string
    avatarUrl?: string
    biography?: string
    phone?: string
    countryCode?: string
    typeCitizenID?: string
    citizenID?: string
}

export type AuthState = {
    user: UserJWTResponse | null
    token: string | null

    isAuthenticated: boolean

    setSession: (data: { user: UserJWTResponse; token: string }) => void
    setUser: (user: UserJWTResponse) => void
    clearSession: () => void
}

export interface LoginResponse {
    token: string
}

