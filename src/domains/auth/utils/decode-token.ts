import { jwtDecode } from "jwt-decode";
import { TokenPayloadDto } from "../types/auth.types";

export const decodeToken = (token: string): TokenPayloadDto => {
    return jwtDecode<TokenPayloadDto>(token);
};