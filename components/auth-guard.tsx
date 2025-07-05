'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/store/use-auth-store'
import { apiRequest } from '@/lib/api'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { user, setUser } = useUserStore()

  useEffect(() => {
    const verifyAuth = async () => {
      console.log('🔐 AuthGuard: Starting verification...')
      try {
        // Si ya tenemos usuario en el store, verificar si aún es válido
        const hasCookie = document.cookie.includes('jwt=')
        const hasToken = localStorage.getItem('jwt_token')

        console.log('🔐 AuthGuard: hasCookie:', hasCookie)
        console.log('🔐 AuthGuard: hasToken:', !!hasToken)

        if (!hasCookie && !hasToken) {
          // No hay autenticación disponible
          console.log('🔐 AuthGuard: No authentication found')
          throw new Error('No authentication found')
        }

        // Verificar autenticación con el servidor
        console.log('🔐 AuthGuard: Calling /auth/validate...')
        const data = await apiRequest('/auth/validate')
        console.log('🔐 AuthGuard: Validate response:', data)

        if (data.isAuthenticated && data.user) {
          console.log('🔐 AuthGuard: ✅ Authentication successful')
          setUser(data.user)
          setIsAuthenticated(true)
        } else {
          console.log('🔐 AuthGuard: ❌ Invalid authentication response')
          throw new Error('Invalid authentication')
        }
      } catch (error) {
        console.error('🔐 AuthGuard: ❌ Auth verification failed:', error)

        // Limpiar autenticación inválida
        setUser(null)
        localStorage.removeItem('jwt_token')
        setIsAuthenticated(false)

        // Redireccionar a login
        console.log('🔐 AuthGuard: Redirecting to login...')
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    // Solo verificar si no tenemos usuario o si la página se recarga
    console.log('🔐 AuthGuard: Current user:', user)
    if (!user || !user.id) {
      console.log('🔐 AuthGuard: No user found, verifying auth...')
      verifyAuth()
    } else {
      console.log('🔐 AuthGuard: User already exists, skipping verification')
      setIsAuthenticated(true)
      setIsLoading(false)
    }
  }, [user, setUser, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // El usuario será redirigido
  }

  return <>{children}</>
} 