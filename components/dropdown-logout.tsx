import { useRouter } from 'next/navigation'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useUserStore } from '@/lib/store/use-auth-store'

export function DropdownMenuItemLogout() {
  const router = useRouter()

  const handleLogout = async () => {
    const res = await fetch('http://localhost:4000/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })

    if (res.ok) {
      useUserStore.setState({ user: null })
      router.push('/login')
    }
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