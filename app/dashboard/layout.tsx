'use client'

import { CoachSidebar } from "@/components/dashboard/coach/coach-sidebar"
import { SwimmerSidebar } from '@/components/dashboard/swimmer/swimmer-sidebar'
import { CoachHeader } from '@/components/dashboard/coach/coach-header'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useUserStore } from '@/lib/store/use-auth-store'
import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/dashboard/admin/admin-header'
import { SwimmerHeader } from '@/components/dashboard/swimmer/swimmer-header'

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
  const DashboardHeader =
    user.role === 'ADMIN' ? AdminHeader :
      user.role === 'COACH' ? CoachHeader :
        SwimmerHeader

  return (
    user.role === 'COACH' || user.role === 'SWIMMER' ? (
      <SidebarProvider className='flex h-screen'>
        <SidebarComponent />
        <SidebarInset className='overflow-hidden'>
          <DashboardHeader />
          <div className='p-6 overflow-hidden h-full'>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    ) : (
      <div className='min-h-screen'>
        <AdminHeader />
        <div className='p-6 overflow-hidden h-full'>
          {children}
        </div>
      </div>
    )
  )
}
