import { UserRole } from "@/src/domains/users/types/user.types";

export interface LoginInput {
    citizenID: string;
    password: string;
}

export interface TokenPayloadDto {
    id: string;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
    name: string
}

export type UserJWTResponse = {
    id: string
    email: string
    role: UserRole
    name: string
    lastName?: string
    avatarUrl?: string
    biography?: string
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

