import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetcher } from '@/lib/api'
import useSWR from 'swr'
import { Skeleton } from '@/components/ui/skeleton'
import { Bed, CheckCircle2, AlertCircle, Battery, Brain } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

interface SwimmerCardProps {
  swimmer: Swimmer
  date: Date
}

export function SwimmerCard({ swimmer, date }: SwimmerCardProps) {
  const { data: dailyForm, error, isLoading } = useSWR(
    `/swimmers/daily-form?swimmerId=${swimmer.id}&date=${date.toISOString()}`,
    fetcher,
    {
      keepPreviousData: true,
      refreshInterval: 30000
    }
  )

  const getMetricIndicatorClass = (value: number | undefined | null): string | undefined => {
    if (value === null || typeof value === 'undefined') {
      return undefined
    }
    if (value >= 8) {
      return 'bg-red-400 text-white'
    }
    if (value >= 5) {
      return 'bg-yellow-300 text-black'
    }
    return undefined
  }

  const getLowIsWorseMetricIndicatorClass = (
    value: number | undefined | null,
    dangerLowThreshold: number,
    warningLowThreshold: number
  ): string | undefined => {
    if (value === null || typeof value === 'undefined') {
      return undefined
    }
    if (value <= dangerLowThreshold) {
      return 'bg-red-400 text-white'
    }
    if (value <= warningLowThreshold) {
      return 'bg-yellow-300 text-black'
    }
    return undefined
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{swimmer.firstName} {swimmer.lastName}</CardTitle>
      </CardHeader>
      <CardContent>
        {(() => {
          if (error) {
            return <p className='text-sm text-muted-foreground'>No se ha enviado el formulario diario.</p>
          }
          if (isLoading && !dailyForm) {
            return (
              <div className='space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-[80%]' />
                <Skeleton className='h-4 w-[50%]' />
                <Skeleton className='h-4 w-[30%]' />
              </div>
            )
          }
          if (dailyForm) {
            return (
              <div className='space-y-3'>
                <div className="flex items-center text-sm">
                  <Bed className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium w-32 shrink-0">Horas de sueño:</span>
                  <Progress
                    value={dailyForm?.sleepHours}
                    max={10}
                    className="flex-1 mx-2"
                    indicatorClassName={getLowIsWorseMetricIndicatorClass(dailyForm?.sleepHours, 4, 6)}
                  />
                  <span className="w-10 text-left">({dailyForm?.sleepHours})</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium w-32 shrink-0">Calidad de sueño:</span>
                  <Progress
                    value={dailyForm?.sleepQuality}
                    max={10}
                    className="flex-1 mx-2"
                    indicatorClassName={getLowIsWorseMetricIndicatorClass(dailyForm?.sleepQuality, 3, 6)}
                  />
                  <span className="w-10 text-left">({dailyForm?.sleepQuality})</span>
                </div>
                <div className="flex items-center text-sm">
                  <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium w-32 shrink-0">Dolor muscular:</span>
                  <Progress value={dailyForm?.musclePain} max={10} className="flex-1 mx-2" indicatorClassName={getMetricIndicatorClass(dailyForm?.musclePain)} />
                  <span className="w-10 text-left">({dailyForm?.musclePain})</span>
                </div>
                <div className="flex items-center text-sm">
                  <Battery className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium w-32 shrink-0">Fatiga:</span>
                  <Progress value={dailyForm?.fatigue} max={10} className="flex-1 mx-2" indicatorClassName={getMetricIndicatorClass(dailyForm?.fatigue)} />
                  <span className="w-10 text-left">({dailyForm?.fatigue})</span>
                </div>
                <div className="flex items-center text-sm">
                  <Brain className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium w-32 shrink-0">Estrés:</span>
                  <Progress value={dailyForm?.stress} max={10} className="flex-1 mx-2" indicatorClassName={getMetricIndicatorClass(dailyForm?.stress)} />
                  <span className="w-10 text-left">({dailyForm?.stress})</span>
                </div>
              </div>
            )
          }
          return <p className='text-sm text-muted-foreground'>No se ha enviado el formulario diario.</p>
        })()}
      </CardContent>
    </Card >
  )
}