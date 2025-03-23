'use client'

import CoachDashboard from '@/components/pages/coach-dashboard'
import SwimmerDashboard from '@/components/pages/swimmer-dashboard'
import { useUserStore } from '@/lib/store/use-auth-store'

export default function DashboardPage() {
  const user = useUserStore((state) => state.user)

  return user?.role === 'COACH' ? (
    <CoachDashboard />
  ) : (
    <SwimmerDashboard />
  )
}