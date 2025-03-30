import { Button } from '@/components/ui/button'
import { useUserStore } from '@/lib/store/use-auth-store'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/lib/api'

export default function CoachDashboard() {
  const router = useRouter()
  const user = useUserStore((state) => state.user)

  return (
    <div>
      <h1>Coach Dashboard</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Button className='cursor-pointer' onClick={async () => {
        await fetch(`${API_URL}/auth/logout`, {
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