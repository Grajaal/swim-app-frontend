'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { DatePicker } from '@/components/dashboard/date-picker'
import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/lib/api'
import { GroupTrainingsCard } from './group-trainings-card'

export function TrainingsTab() {
  const [date, setDate] = useState<Date>(new Date())
  const { data: groups } = useSWR('/teams/groups', fetcher)

  return (
    <TabsContent value='trainings'>
      <Card className='h-full'>
        <CardHeader>
          <div className='flex items-center justify-between gap-4 mb-4'>
            <CardTitle>Entrenamientos</CardTitle>
            <DatePicker
              selectedDate={date}
              onDateChange={setDate}
              side='bottom'
              align='end'
            />
          </div>
          <CardDescription>
            Aquí puedes asignar entrenamientos específicos a cada grupo para personalizar el progreso de tus nadadores.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col flex-grow'>
          {groups && groups.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {groups.map((group: Group) => (
                <GroupTrainingsCard
                  key={group.id}
                  group={group}
                  date={date}
                />
              ))}
            </div>
          ) : (
            <div className='flex text-2xl items-center justify-center h-full'>
              <p className='text-muted-foreground'>No hay grupos disponibles.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}