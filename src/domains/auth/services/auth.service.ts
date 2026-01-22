'use server'
import { cookies } from 'next/headers';
import { LOGIN_API_URL } from '../constants/urls';

import { LoginDTO, loginResponse } from '../types/auth.types';

export async function loginRequest(loginDto: LoginDTO): Promise<string> {

  const cookieStore = await cookies()

  const response = await fetch(LOGIN_API_URL, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginDto),
  });

  if (!response.ok) {
    throw new Error("Credenciales incorrectas");
  }


  const data: loginResponse = await response.json()

  cookieStore.set('access_token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax',
    path: '/',
  })

  return data.token

}


