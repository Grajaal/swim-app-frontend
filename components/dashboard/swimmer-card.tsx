import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetcher } from '@/lib/api'
import useSWR from 'swr'
import { Skeleton } from '@/components/ui/skeleton'

interface SwimmerCardProps {
  swimmer: Swimmer
  date: Date
}

export function SwimmerCard({ swimmer, date }: SwimmerCardProps) {
  const { data: dailyForm, isLoading } = useSWR(
    `/swimmers/daily-form?swimmerId=${swimmer.id}&date=${date.toISOString()}`,
    fetcher,
    {
      keepPreviousData: false,
      refreshInterval: 30000
    }
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{swimmer.firstName} {swimmer.lastName}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-[80%]' />
            <Skeleton className='h-4 w-[50%]' />
            <Skeleton className='h-4 w-[30%]' />
          </div>
        ) : dailyForm ? (
          <div>
            <p>Horas de sueño: {dailyForm?.sleepHours}</p>
            <p>Calidad de sueño: {dailyForm?.sleepQuality}</p>
            <p>Dolor muscular: {dailyForm?.musclePain}</p>
            <p>Fatiga: {dailyForm?.fatigue}</p>
            <p>Estrés: {dailyForm?.stress}</p>
          </div>
        ) : (
          <p>No se ha enviado el formulario diario.</p>
        )}
      </CardContent>
    </Card >
  )
}