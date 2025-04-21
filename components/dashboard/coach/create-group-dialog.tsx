'use client'

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import MultipleSelector, { Option } from '@/components/ui/multiple-selector'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useSWR, { mutate } from 'swr'
import { API_URL, fetcher } from '@/lib/api'
import { useEffect, useState } from 'react'

interface Inputs {
  name: string
  swimmerIds: string[]
}

export function CreateGroupDialog() {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors }, setError, clearErrors, watch } = useForm<Inputs>()
  const { data: swimmers } = useSWR('/teams/my-swimmers', fetcher)

  const watchedName = watch('name')
  const watchedSwimmerIds = watch('swimmerIds')

  useEffect(() => {
    if (errors.root) clearErrors('root')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedName, watchedSwimmerIds])

  register('swimmerIds', {
    validate: value => value && value.length > 0 || 'Debes seleccionar al menos un nadador'
  })

  const onSubmit = async (data: Inputs) => {
    const response = await fetch(`${API_URL}/teams/create-group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      if (response.status === 409) {
        setError('root', { message: 'Ya existe un grupo con ese nombre.' })
      } else {
        setError('root', { message: 'Error al crear el grupo. Inténtalo de nuevo.' })
      }
    } else {
      setOpen(false)
      mutate('/teams/groups')
    }
  }

  const OPTIONS: Option[] =
    swimmers?.map((swimmer: Swimmer) => ({
      label: `${swimmer.firstName} ${swimmer.lastName}`,
      value: swimmer.id
    })) || []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Crear grupo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nuevo grupo</DialogTitle>
          <DialogDescription>
            Añade un nuevo grupo de nadadores. Puedes añadir nadadores a este grupo y gestionar sus entrenamientos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-2'>
          <Label>Nombre</Label>
          <Input {...register('name', { required: 'El grupo debe tener un nombre' })} placeholder='Velocistas' />
          {errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>}

          <Label className='mt-2'>Nadadores</Label>
          <MultipleSelector
            defaultOptions={OPTIONS}
            onChange={selectedOptions => setValue('swimmerIds', selectedOptions.map(opt => opt.value), { shouldValidate: true })}
            placeholder='Selecciona los nadadores'
            hidePlaceholderWhenSelected
            emptyIndicator={
              <span className='text-muted-foreground'>No se encontró un nadador con ese nombre</span>
            }
          />
          {errors.swimmerIds && <span className='text-red-500 text-sm'>{errors.swimmerIds.message}</span>}

          {errors.root && <span className='mt-2 text-red-500 text-sm'>{errors.root.message}</span>}

          <div className='flex justify-end mt-4'>
            <Button type='submit' className='w-25'>Crear</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog >
  )
}