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