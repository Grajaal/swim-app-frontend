'use client'

import { useUser } from '@/hooks/use-user'
import CoachDashboard from '@/components/pages/coach-dashboard'
import SwimmerDashboard from '@/components/pages/swimmer-dashboard'

export default function DashboardPage() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }
  return user.role === 'COACH' ? (
    <CoachDashboard />
  ) : (
    <SwimmerDashboard />
  )
}