'use client'

import { CoachSidebar } from "@/components/dashboard/coach/coach-sidebar"
import { SwimmerSidebar } from '@/components/dashboard/swimmer/swimmer-sidebar'
import { CoachHeader } from '@/components/dashboard/coach/coach-header'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useUserStore } from '@/lib/store/use-auth-store'
import { AdminHeader } from '@/components/dashboard/admin/admin-header'
import { SwimmerHeader } from '@/components/dashboard/swimmer/swimmer-header'
import { AuthGuard } from '@/components/auth-guard'
import { AuthDebug } from '@/components/auth-debug'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardContent>{children}</DashboardContent>
      <AuthDebug />
    </AuthGuard>
  )
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user)

  if (!user) {
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
