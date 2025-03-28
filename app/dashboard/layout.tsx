'use client'

import { CoachSidebar } from "@/components/dashboard/coach/coach-sidebar"
import { SwimmerSidebar } from '@/components/dashboard/swimmer/swimmer-sidebar'
import { CoachHeader } from '@/components/dashboard/coach/coach-header'
import { SwimmerHeader } from '@/components/dashboard/swimmer/swimmer-header'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import React from 'react'
import { useUserStore } from '@/lib/store/use-auth-store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user)

  const SidebarComponent = user?.role === 'COACH' ? CoachSidebar : SwimmerSidebar
  const DashboardHeader = user?.role === 'COACH' ? CoachHeader : SwimmerHeader

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
