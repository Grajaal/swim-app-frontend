import { NextRequest, NextResponse } from 'next/server'
import { API_URL } from './lib/api'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = ['/login', '/register'].includes(path)

  const token = request.cookies.get('jwt')?.value
  console.log('Token:', token)
  console.log('Path:', path)
  console.log('Is Public Path:', isPublicPath)

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (!isPublicPath && token) {
    const res = await fetch(`${API_URL}/auth/validate`, {
      headers: {
        Cookie: `jwt=${token}`
      }
    })

    const data = await res.json()
    if (!data.isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (isPublicPath && token) {
    const res = await fetch(`${API_URL}/auth/validate`, {
      headers: {
        Cookie: `jwt=${token}`
      }
    })

    const data = await res.json()
    if (data.isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
}
