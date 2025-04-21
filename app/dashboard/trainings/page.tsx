'use client'

import { GroupsTab } from '@/components/dashboard/coach/groups-tab'
import { TrainingsTab } from '@/components/dashboard/coach/trainings-tab'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUserStore } from '@/lib/store/use-auth-store'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TrainingsPage() {
  const user = useUserStore((state) => state.user)
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== 'COACH') {
      router.push('/dashboard')
    }
  }, [user, router])

  if (!user || user.role !== 'COACH') {
    return <Loader2 className='size-10' />
  }

  return (
    <Tabs defaultValue='trainings' className='h-full'>
      <TabsList className='w-full'>
        <TabsTrigger value='groups'>Grupos</TabsTrigger>
        <TabsTrigger value='trainings'>Entrenamientos</TabsTrigger>
      </TabsList>
      <GroupsTab />
      <TrainingsTab />
    </Tabs>
  )
}