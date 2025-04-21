'use client'

import { fetcher } from '@/lib/api'
import useSWR from 'swr'
import { SwimmerCard } from '@/components/dashboard/swimmer-card'
import { DatePicker } from '../dashboard/date-picker'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function CoachDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const { data: swimmers, isLoading } = useSWR('/teams/my-swimmers', fetcher)

  return (
    <>
      <div className='mb-4'>
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className='h-[125px] w-full rounded-md' />
          ))
        ) : (

          swimmers.map((swimmer: Swimmer) => (
            <SwimmerCard
              key={swimmer.id}
              swimmer={swimmer}
              date={selectedDate}
            />
          ))
        )}
      </div>
    </>
  )
}