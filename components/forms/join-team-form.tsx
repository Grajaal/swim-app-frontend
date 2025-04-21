'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { API_URL } from '@/lib/api'
import { mutate } from 'swr'

interface Inputs {
  teamCode: string
}

export function JoinTeamForm() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<Inputs>()

  const onSubmit = async (data: Inputs) => {
    const response = await fetch(`${API_URL}/swimmers/join-team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })

    if (!response.ok) {
      if (response.status === 404) {
        setError('teamCode', { message: 'Ese equipo no existe' })
      } else if (response.status === 409) {
        setError('teamCode', { message: 'Ya perteneces a un equipo' })
      } else {
        setError('teamCode', { message: 'Ha ocurrido un error. Intentalo de nuevo' })
      }
      return
    }

    mutate('/swimmers/team-status', { hasTeam: true })
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