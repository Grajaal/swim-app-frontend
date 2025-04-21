import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { API_URL } from '@/lib/api'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { mutate } from 'swr'

interface CreateTrainingDialogProps {
  group: Group
  date: Date
}

interface Inputs {
  meters: number
  minutes: number
  description: string
}

export function CreateTrainingDialog({ group, date }: CreateTrainingDialogProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()
  const [isOpen, setIsOpen] = useState(false)

  const formattedDate = date.toISOString().split('T')[0]

  const onSubmit = async (data: Inputs) => {
    const payload = {
      ...data,
      date: date.toISOString()
    }

    const response = await fetch(`${API_URL}/groups/${group.id}/trainings`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      toast.error('Error al crear el entrenamiento', {
        description: 'Por favor, intenta de nuevo más tarde',
      })
    } else {
      setIsOpen(false)
      mutate(`/groups/${group.id}/trainings?date=${date.toISOString()}`)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className='hover:bg-primary hover:text-primary-foreground transition-colors duration-200'>
          <Plus className='size-4' />
          <span>Añadir</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir entrenamiento</DialogTitle>
          <DialogDescription>{`Crea un nuevo entrenamiento para el grupo de ${group.name}`}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-2'>
          <div className='space-y-2'>
            <Label htmlFor='meters'>Metros</Label>
            <Input
              type='number'
              id='meters'
              {...register('meters', {
                valueAsNumber: true,
                required: 'La distancia es requerida',
                min: {
                  value: 1,
                  message: 'La distancia debe ser mayor a 0',
                }
              })}
            />
            {errors.meters && <p className='text-red-500 text-sm'>{errors.meters.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='time'>Tiempo (minutos)</Label>
            <Input
              id='time'
              type='number'
              {...register('minutes', {
                valueAsNumber: true,
                required: 'El tiempo es requerido',
                min: {
                  value: 1,
                  message: 'El tiempo debe ser mayor a 0',
                }
              })}
            />
            {errors.minutes && <p className='text-red-500 text-sm'>{errors.minutes.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='date'>Fecha</Label>
            <Input id='date' type='date' defaultValue={formattedDate} disabled />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Descripción</Label>
            <Input
              id='description'
              type='text'
              placeholder='Ej. Series de 50m a máxima velocidad'
              {...register('description')}
            />
          </div>

          <div className='flex justify-end mt-6'>
            <Button type='submit'>
              Crear entrenamiento
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog >
  )
}