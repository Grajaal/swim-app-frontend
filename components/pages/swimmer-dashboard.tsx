import { useUserStore } from '@/lib/store/use-auth-store'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function SwimmerDashboard() {
  const router = useRouter()
  const user = useUserStore((state) => state.user)

  return (
    <div>
      <h1>Swimmer Dashboard</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Button className='cursor-pointer' onClick={async () => {
        await fetch('http://localhost:4000/api/auth/logout', {
          method: 'POST',
          credentials: 'include'
        })

        router.push('/login')
      }}>
        Logout
      </Button >
    </div >
  )
}