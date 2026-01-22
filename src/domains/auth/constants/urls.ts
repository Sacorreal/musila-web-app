import { BASE_API_URL } from '@shared/constants/env';



export const LOGIN_API_URL = `${BASE_API_URL}/auth/login`;

export const REGISTER_API_URL = BASE_API_URL ? `${BASE_API_URL}/auth/register` : undefined;