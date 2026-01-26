import { UserRole } from "@/src/domains/users/types/user.type";

export interface LoginDTO {
    email: string;
    password: string;
}

export interface TokenPayload {
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
}

export type AuthState = {
    user: UserJWTResponse | null

    isAuthenticated: boolean

    setSession: (data: { user: UserJWTResponse }) => void
    clearSession: () => void
}

export interface loginResponse {
    token: string
}

