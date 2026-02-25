'use server'
import type { CreateUserDTO } from '@domains/users/types/user.type';
import { cookies } from 'next/headers';

import { LoginDTO, loginResponse } from '../types/auth.types';
import { apiURLs } from '@/src/shared/constants/urls';

export async function loginRequest(loginDto: LoginDTO): Promise<string> {

  const cookieStore = await cookies()

  const response: Response = await fetch(apiURLs.auth.login, {
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

export async function registerUserRequest(createUserDto: CreateUserDTO) {
  const response = await fetch(apiURLs.auth.register, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createUserDto),
  });

  if (!response.ok) {    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al crear el usuario");
  }

  const data: loginResponse = await response.json();
  return data.token;
}
