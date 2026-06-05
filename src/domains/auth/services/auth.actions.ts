'use server'
import type { CreateUserInput } from '@/src/domains/users/types/user.types';
import { cookies } from 'next/headers';

import { LoginInput, LoginResponse } from '../types/auth.types';
import { apiURLs } from '@/src/shared/constants/urls';
import { BASE_API_URL } from '@/src/shared/constants/env';

export async function loginRequest(loginDto: LoginInput): Promise<string> {

  const cookieStore = await cookies()

  const response: Response = await fetch(apiURLs.auth.login, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginDto),
  });

  if (!response.ok) {
    throw new Error("Credenciales incorrectas");
  }


  const data: LoginResponse = await response.json() 

  cookieStore.set('access_token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
    path: '/',
  })

  return data.token

}

export async function registerUserRequest(createUserDto: CreateUserInput): Promise<string> {
  const response = await fetch(`${BASE_API_URL}${apiURLs.auth.register}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createUserDto),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg = errorData.message ?? 'Error al crear el usuario';
    throw new Error(Array.isArray(msg) ? msg.join(', ') : String(msg));
  }

  const data: LoginResponse = await response.json();

  const cookieStore = await cookies();
  cookieStore.set('access_token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  return data.token;
}

export async function forgotPasswordRequest(email: string): Promise<{ message: string }> {
  const response = await fetch(`${BASE_API_URL}${apiURLs.auth.forgotPassword}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg = errorData.message ?? 'Error al solicitar el restablecimiento de contraseña';
    throw new Error(Array.isArray(msg) ? msg.join(', ') : String(msg));
  }

  return response.json();
}

export async function resetPasswordRequest(
  token: string,
  newPassword: string,
  confirmPassword: string,
): Promise<{ message: string }> {
  const response = await fetch(`${BASE_API_URL}${apiURLs.auth.resetPassword}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword, confirmPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg = errorData.message ?? 'Error al restablecer la contraseña';
    throw new Error(Array.isArray(msg) ? msg.join(', ') : String(msg));
  }

  return response.json();
}