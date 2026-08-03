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
  // Note: plan check here is for UX redirection only; real authorization
  // happens in the backend via JWTAuthGuard + PlansGuard on every API call.
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

    if (payload.planType !== 'admin' && payload.planType !== 'superadmin') {
      return NextResponse.redirect(new URL('/music', request.url))
    }

    return NextResponse.next()
  }

  // ── /programa-afiliados/dashboard protection ─────────────────────────
  // Cookie y secreto de JWT aislados del core (affiliate_access_token),
  // para que un token de afiliado nunca coincida con /admin ni /music.
  if (pathname.startsWith('/programa-afiliados/dashboard')) {
    const affiliateToken = request.cookies.get('affiliate_access_token')?.value

    if (!affiliateToken) {
      return NextResponse.redirect(new URL('/programa-afiliados/login', request.url))
    }

    const payload = decodeJwtPayload(affiliateToken)
    const now = Math.floor(Date.now() / 1000)
    if (!payload || (payload.exp && payload.exp < now)) {
      const response = NextResponse.redirect(new URL('/programa-afiliados/login', request.url))
      response.cookies.delete('affiliate_access_token')
      return response
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
  matcher: ['/music/:path*', '/admin/:path*', '/programa-afiliados/dashboard/:path*'],
}
