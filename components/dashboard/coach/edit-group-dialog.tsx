'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multiple-selector'
import { API_URL, fetcher } from '@/lib/api'
import { Check } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useSWR, { mutate } from 'swr'

interface EditGroupDialogProps {
  group: Group
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Inputs {
  name: string
  swimmerIds: string[]
}

export function EditGroupDialog({ group, open, onOpenChange }: EditGroupDialogProps) {
  const { data: swimmers } = useSWR('/teams/my-swimmers', fetcher)
  const { register, handleSubmit, setValue, formState: { errors }, setError } = useForm<Inputs>()

  const selectedSwimmers: Option[] =
    group.swimmers.map((swimmer: Swimmer) => ({
      value: swimmer.id,
      label: `${swimmer.firstName} ${swimmer.lastName}`,
    }))

  const swimmerOptions: Option[] =
    swimmers?.map((swimmer: Swimmer) => ({
      value: swimmer.id,
      label: `${swimmer.firstName} ${swimmer.lastName}`,
    }))

  const onSubmit = async (data: Inputs) => {
    const response = await fetch(`${API_URL}/groups/${group.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      if (response.status === 409) {
        setError('root', { message: 'Ya existe un grupo con ese nombre.' })
      } else {
        setError('root', { message: 'Error al editar el grupo. Inténtalo de nuevo.' })
      }
    } else {
      onOpenChange(false)
      mutate('/teams/groups')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{group.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
          <Label>Nombre</Label>
          <Input {...register('name')} defaultValue={group.name} />

          <Label>Nadadores</Label>
          <MultipleSelector
            options={swimmerOptions}
            value={selectedSwimmers}
            defaultOptions={selectedSwimmers}
            onChange={selectedOptions => setValue('swimmerIds', selectedOptions.map(option => option.value))}
          />

          {errors.root && <span className='text-red-500 text-sm'>{errors.root.message}</span>}

          <div className='flex justify-end'>
            <Button type='submit'>
              <Check className='size-4' />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}