'use server'
import type { CreateUserDTO } from '@domains/users/types/user.type';
import { cookies } from 'next/headers';

import { LoginDTO, loginResponse } from '../types/auth.types';
import { apiURLs } from '@/src/shared/constants/urls';
import { getServerApiClient} from '@shared/libs/axios/axios-server'

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
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
    path: '/',
  })

  return data.token

}

export async function registerUserRequest(createUserDto: CreateUserDTO): Promise<string> {
  try {    
    const serverClient = await getServerApiClient();

    // 2. Ejecutamos la petición. 
    // Axios serializa automáticamente el JSON y maneja los estados HTTP.
    const { data } = await serverClient.post<loginResponse>(
      apiURLs.auth.register, 
      createUserDto
    );

    // 3. Auto-Login: Guardamos el token recibido exactamente igual que en el loginRequest
    const cookieStore = await cookies();
    cookieStore.set('access_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', 
      path: '/',
    });

    return data.token;

  } catch (error: any) {
    // 4. Manejo de errores limpio
    // Si el status es 4xx o 5xx, Axios arroja un error que capturamos aquí.
    const errorMessage = error.response?.data?.message || "Error al crear el usuario";
    
    // Lanzamos el error para que el componente (ej. React Hook Form) pueda atraparlo y mostrar el toast
    throw new Error(errorMessage);
  }
}