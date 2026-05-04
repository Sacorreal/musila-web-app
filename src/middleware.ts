import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value

  // Definimos las rutas que deben ser públicas bajo /music
  const isPublicMusicRoute = 
    pathname.startsWith('/music/tracks') || 
    pathname.startsWith('/music/artista')

  // Verificamos si la ruta actual es bajo /music y no es pública
  if (pathname.startsWith('/music') && !isPublicMusicRoute) {
    if (!token) {
      return NextResponse.rewrite(new URL('/auth-required', request.url))
    }

    try {
      // Validación básica de vigencia (expiración)
      // Decodificamos el payload del JWT (segunda parte del string)
      const payloadBase64 = token.split('.')[1]
      if (!payloadBase64) throw new Error('Token inválido')
      
      const payload = JSON.parse(atob(payloadBase64))
      const now = Math.floor(Date.now() / 1000)

      if (payload.exp && payload.exp < now) {
        // Token expirado, mostramos pantalla de auth required
        const response = NextResponse.rewrite(new URL('/auth-required', request.url))
        response.cookies.delete('access_token')
        return response
      }
    } catch (error) {
      // Si el token es corrupto o no se puede parsear, mostramos pantalla de auth required
      const response = NextResponse.rewrite(new URL('/auth-required', request.url))
      response.cookies.delete('access_token')
      return response
    }
  }

  return NextResponse.next()
}

// Configuración del matcher para optimizar el rendimiento del middleware
export const config = {
  matcher: ['/music/:path*'],
}
