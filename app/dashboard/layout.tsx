'use client'

import { CoachSidebar } from "@/components/dashboard/coach/coach-sidebar"
import { SwimmerSidebar } from '@/components/dashboard/swimmer/swimmer-sidebar'
import { CoachHeader } from '@/components/dashboard/coach/coach-header'
import { SwimmerHeader } from '@/components/dashboard/swimmer/swimmer-header'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useUser } from '@/hooks/use-user'
import React from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  const SidebarComponent = user.role === 'COACH' ? CoachSidebar : SwimmerSidebar
  const DashboardHeader = user.role === 'COACH' ? CoachHeader : SwimmerHeader

  return (
    <SidebarProvider>
      <SidebarComponent />
      <SidebarInset>
        <DashboardHeader />
        <main className='p-6'>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
