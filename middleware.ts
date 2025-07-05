import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = ['/login', '/register'].includes(path)
  const token = request.cookies.get('jwt')?.value

  // Simple protection: redirect to login if no token on protected routes
  if (!isPublicPath && !token) {
    console.log('No token found, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // For public paths, let the client-side handle redirects to avoid cross-domain issues
  console.log('Middleware allowing request to proceed')
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
}
