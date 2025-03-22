import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/use-user'

export default function CoachDashboard() {
  const router = useRouter()
  const { user, isLoading } = useUser()

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div>
      <h1>Coach Dashboard</h1>
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