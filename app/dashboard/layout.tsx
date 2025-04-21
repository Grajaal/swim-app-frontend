'use client'

import { CoachSidebar } from "@/components/dashboard/coach/coach-sidebar"
import { SwimmerSidebar } from '@/components/dashboard/swimmer/swimmer-sidebar'
import { CoachHeader } from '@/components/dashboard/coach/coach-header'
import { SwimmerHeader } from '@/components/dashboard/swimmer/swimmer-header'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useUserStore } from '@/lib/store/use-auth-store'
import { useEffect, useState } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user)
  const [isClient, setIsClient] = useState<boolean>(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || !user) {
    return null
  }

  const SidebarComponent = user?.role === 'COACH' ? CoachSidebar : SwimmerSidebar
  const DashboardHeader = user?.role === 'COACH' ? CoachHeader : SwimmerHeader

  return (
    <SidebarProvider>
      <SidebarComponent />
      <SidebarInset>
        <DashboardHeader />
        <main className='p-6 h-full'>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
