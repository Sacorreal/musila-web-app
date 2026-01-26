'use server'
import type { CreateUserDTO } from '@domains/users/types/user.type';
import { cookies } from 'next/headers';
import { LOGIN_API_URL, REGISTER_API_URL } from '../constants/urls';

import { LoginDTO, loginResponse } from '../types/auth.types';

export async function loginRequest(loginDto: LoginDTO): Promise<string> {

  const cookieStore = await cookies()

  const response: Response = await fetch(LOGIN_API_URL, {
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
  const cookieStore = await cookies()
  const response: Response = await fetch(REGISTER_API_URL, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createUserDto),
  });
  if (!response.ok) {
    throw new Error("Error al crear el usuario");
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
