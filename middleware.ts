import { NextRequest, NextResponse } from 'next/server'
import { API_URL } from './lib/api'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = ['/login', '/register'].includes(path)
  const token = request.cookies.get('jwt')?.value

  // Para rutas protegidas, permitir acceso inicial y dejar que el cliente maneje la autenticación
  // El middleware solo validará si hay cookies (autenticación del lado servidor)
  if (!isPublicPath && !token) {
    // No redirigir inmediatamente - dejar que el cliente verifique localStorage
    // El componente cliente se encargará de la autenticación
    return NextResponse.next()
  }

  // Validate token for protected routes (solo si hay cookies)
  if (!isPublicPath && token) {
    try {
      const res = await fetch(`${API_URL}/auth/validate`, {
        headers: {
          Cookie: `jwt=${token}`
        }
      })

      if (!res.ok) {
        console.error(`Auth validation failed: ${res.status} ${res.statusText}`)
        return NextResponse.redirect(new URL('/login', request.url))
      }

      const data = await res.json()
      if (!data.isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch (error) {
      console.error('Auth validation error:', error, 'API_URL:', API_URL)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect authenticated users away from public auth pages (solo si hay cookies)
  if (isPublicPath && token) {
    try {
      const res = await fetch(`${API_URL}/auth/validate`, {
        headers: {
          Cookie: `jwt=${token}`
        }
      })

      if (res.ok) {
        const data = await res.json()
        if (data.isAuthenticated) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
    } catch (error) {
      console.error(
        'Auth validation error on public path:',
        error,
        'API_URL:',
        API_URL
      )
      // Don't redirect on error for public paths, allow access
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
}
