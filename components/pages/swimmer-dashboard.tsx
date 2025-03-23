import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'
import { useRouter } from 'next/navigation'

export default function SwimmerDashboard() {
  const router = useRouter()
  const { user, isLoading } = useUser()

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div>Swimmers</div>
  )
}