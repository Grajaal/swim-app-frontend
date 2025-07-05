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
      try {
        // Si ya tenemos usuario en el store, verificar si aún es válido
        const hasCookie = document.cookie.includes('jwt=')
        const hasToken = localStorage.getItem('jwt_token')

        if (!hasCookie && !hasToken) {
          // No hay autenticación disponible
          throw new Error('No authentication found')
        }

        // Verificar autenticación con el servidor
        const data = await apiRequest('/auth/validate')

        if (data.isAuthenticated && data.user) {
          setUser(data.user)
          setIsAuthenticated(true)
        } else {
          throw new Error('Invalid authentication')
        }
      } catch (error) {
        console.error('Authentication verification failed:', error)

        // Limpiar autenticación inválida
        setUser(null)
        localStorage.removeItem('jwt_token')
        setIsAuthenticated(false)

        // Redireccionar a login
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    // Solo verificar si no tenemos usuario o si la página se recarga
    if (!user || !user.id) {
      verifyAuth()
    } else {
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