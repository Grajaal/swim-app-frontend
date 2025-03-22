'use client'

import { CoachSidebar } from "@/components/coach-sidebar"
import { SwimmerSidebar } from '@/components/swimmer-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
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
  console.log(user)
  const SidebarComponent = user.role === 'COACH' ? CoachSidebar : SwimmerSidebar

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
