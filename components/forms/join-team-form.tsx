'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { apiRequest } from '@/lib/api'
import { mutate } from 'swr'

interface Inputs {
  teamCode: string
}

export function JoinTeamForm() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<Inputs>()

  const onSubmit = async (data: Inputs) => {
    try {
      await apiRequest('/swimmers/join-team', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      mutate('/swimmers/team-status', { hasTeam: true })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const status = errorMessage.includes('404') ? 404 :
        errorMessage.includes('409') ? 409 : 500

      if (status === 404) {
        setError('teamCode', { message: 'Ese equipo no existe' })
      } else if (status === 409) {
        setError('teamCode', { message: 'Ya perteneces a un equipo' })
      } else {
        setError('teamCode', { message: 'Ha ocurrido un error. Intentalo de nuevo' })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label>Código del equipo</Label>
      <Input {...register('teamCode', {
        required: 'El código del equipo es obligatorio',
        minLength: {
          value: 6,
          message: 'El código del equipo debe tener 6 caracteres'
        },
        maxLength: {
          value: 6,
          message: 'El código del equipo debe tener 6 caracteres'
        }
      })} />
      {errors.teamCode && <p className='text-red-500 text-sm'>{errors.teamCode.message}</p>}
      <Button>Unirse</Button>
    </form>
  )
}