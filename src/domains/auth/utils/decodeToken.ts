import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "../types";

export const decodeToken = (token: string): TokenPayload => {
    return jwtDecode<TokenPayload>(token);
};