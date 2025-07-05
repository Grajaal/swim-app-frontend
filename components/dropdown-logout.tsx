import { useRouter } from 'next/navigation'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useUserStore } from '@/lib/store/use-auth-store'

import { apiRequest, clearAuth } from '@/lib/api'

export function DropdownMenuItemLogout() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Intentar hacer logout en el servidor
      await apiRequest('/auth/logout', { method: 'POST' })
    } catch (error) {
      // Si falla el logout en servidor, continuar con logout local
      console.warn('Server logout failed, continuing with local logout:', error)
    }

    // Limpiar autenticación local (cookies y localStorage)
    clearAuth()

    // Limpiar estado del usuario
    useUserStore.setState({ user: null })

    // Redireccionar al login
    router.push('/login')
  }

  return (
    <DropdownMenuItem
      className='cursor-pointer'
      onClick={handleLogout}
    >
      Cerrar sesión
    </DropdownMenuItem>
  )
}