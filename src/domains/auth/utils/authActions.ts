'use server' 

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createSession(token: string) {
    const cookieStore = await cookies();
    cookieStore.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
      path: '/',
    });
  }

export async function deleteCookie() {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')   
    
    redirect('/login')
}
