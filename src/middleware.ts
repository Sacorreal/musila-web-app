import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) return null
    return JSON.parse(atob(payloadBase64))
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value

  // ── /admin protection ────────────────────────────────────────────────
  // Note: role check here is for UX redirection only; real authorization
  // happens in the backend via JWTAuthGuard + RolesGuard on every API call.
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const payload = decodeJwtPayload(token)
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('access_token')
      return response
    }

    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('access_token')
      return response
    }

    if (payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/music', request.url))
    }

    return NextResponse.next()
  }

  // ── /music protection ────────────────────────────────────────────────
  const isPublicMusicRoute =
    pathname.startsWith('/music/tracks') ||
    pathname.startsWith('/music/artista')

  if (pathname.startsWith('/music') && !isPublicMusicRoute) {
    if (!token) {
      return NextResponse.rewrite(new URL('/auth-required', request.url))
    }

    const payload = decodeJwtPayload(token)
    if (!payload) {
      const response = NextResponse.rewrite(new URL('/auth-required', request.url))
      response.cookies.delete('access_token')
      return response
    }

    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      const response = NextResponse.rewrite(new URL('/auth-required', request.url))
      response.cookies.delete('access_token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/music/:path*', '/admin/:path*'],
}
