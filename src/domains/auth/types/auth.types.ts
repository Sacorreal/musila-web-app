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
}

export type UserJWTResponse = {
    id: string
    email: string
    planType: UserPlanType
    name: string
    plan?: 'free' | 'pro'
    /** Estado de verificación al momento de emitir el token — solo para UI (banner), no confiar para autorización. */
    isVerified?: boolean
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

