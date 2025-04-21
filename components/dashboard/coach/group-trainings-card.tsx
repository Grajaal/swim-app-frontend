'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateTrainingDialog } from '@/components/dashboard/coach/create-training-dialog'
import useSWR, { mutate } from 'swr'
import { API_URL, fetcher } from '@/lib/api'
import { CircleAlert, Trash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface GroupTrainingsCardProps {
  group: Group
  date: Date
}

export function GroupTrainingsCard({ group, date }: GroupTrainingsCardProps) {
  const { data: trainings } = useSWR(`/groups/${group.id}/trainings?date=${date.toISOString()}`, fetcher)

  const handleDeleteTraining = async (trainingId: string) => {
    const response = await fetch(`${API_URL}/groups/${group.id}/trainings/${trainingId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    if (!response.ok) {
      toast.error('Error al eliminar el entrenamiento', {
        description: 'Por favor, inténtalo de nuevo más tarde.',
      })
    } else {
      toast.success('Entrenamiento eliminado correctamente')
      mutate(`/groups/${group.id}/trainings?date=${date.toISOString()}`)
    }
  }

  return (
    <Card>
      <CardHeader className='bg-primary text-primary-foreground rounded-t-lg'>
        <CardTitle>{group.name}</CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='flex justify-between items-center bg-secondary px-6 py-2'>
          <span>Entrenamientos</span>
          <CreateTrainingDialog
            group={group}
            date={date}
          />
        </div>
        <div className='divide-y'>
          {trainings && trainings.length > 0 ? (
            trainings.map((training: Training) =>
              <div key={training.id} className='p-4 hover:bg-secondary/45'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center gap-2'>
                    <Badge>
                      {training.meters}m
                    </Badge>
                    <Badge variant='outline'>
                      {training.minutes}min
                    </Badge>
                  </div>
                  <Button
                    variant='link'
                    size='icon'
                    onClick={() => handleDeleteTraining(training.id)}
                    className='text-destructive'
                  >
                    <Trash className='size-4' />
                  </Button>
                </div>
                <p className='text-sm text-slate-600'>{training.description}</p>
              </div>
            )
          ) : (
            <div className='flex items-center justify-center gap-2'>
              <CircleAlert className='size-4 text-muted-foreground' />
              <span className='text-muted-foreground'>No hay entrenamientos</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card >
  )
}