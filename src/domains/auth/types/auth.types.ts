import { UserRole } from "@domains/users/types";

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
}

export type UserJWTResponse = {
    id: string
    email: string
    role: UserRole
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