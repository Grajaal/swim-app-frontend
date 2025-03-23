import { Button } from '@/components/ui/button'
import { useUserStore } from '@/lib/store/use-auth-store'
import { useRouter } from 'next/navigation'

export function Logout() {
  const router = useRouter()

  return (
    <Button
      className='cursor-pointer'
      onClick={async () => {
        await fetch('http://localhost:4000/api/auth/logout', {
          method: 'POST',
          credentials: 'include'
        })

        useUserStore.getState().setUser(null)

        router.push('/login')
      }}
    >
      Cerrar sesión
    </Button>
  )
}