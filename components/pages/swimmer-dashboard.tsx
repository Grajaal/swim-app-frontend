'use client'

import { useUserStore } from '@/lib/store/use-auth-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { useForm } from 'react-hook-form'
import { API_URL, fetcher } from '@/lib/api'
import useSWR, { mutate } from 'swr'
import { JoinTeamForm } from '../forms/join-team-form'

interface Inputs {
  sleepHours: number
  sleepQuality: number
  musclePain: number
  fatigue: number
  stress: number
}

export default function SwimmerDashboard() {
  const { data: formData, isLoading: formLoading } = useSWR('/swimmers/daily-form/status', fetcher)
  const { data: teamData, isLoading: teamLoading } = useSWR('/swimmers/team-status', fetcher)
  const user = useUserStore((state) => state.user)
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      sleepHours: 5,
      sleepQuality: 5,
      musclePain: 5,
      fatigue: 5,
      stress: 5
    }
  })

  const onSubmit = (data: Inputs) => {
    const formData = {
      sleepHours: parseInt(data.sleepHours.toString(), 10),
      sleepQuality: parseInt(data.sleepQuality.toString(), 10),
      musclePain: parseInt(data.musclePain.toString(), 10),
      fatigue: parseInt(data.fatigue.toString(), 10),
      stress: parseInt(data.stress.toString(), 10)
    }
    const userId = user?.id

    fetch(`${API_URL}/swimmers/daily-form`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...formData
      }),
    })
      .then((response) => response.json())
      .then(() => {
        mutate('/swimmers/daily-form/status', { hasSubmitted: true }, false)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  if (formLoading || teamLoading) return <div>Cargando...</div>

  if (!teamData?.hasTeam) {
    return (
      <div className='max-w-md mx-auto p-6'>
        <h1 className='text-2xl font-bold mb-6'>Bienvenido a SwimApp!</h1>
        <p className='mb-6'>Necesitas unirte a un equipo para continuar</p>
        <JoinTeamForm />
      </div>
    )
  }

  if (formData.hasSubmitted) {
    return (
      <div className='flex flex-col items-center justify-center gap-4'>
        <h1 className='text-2xl font-bold'>Formulario enviado</h1>
        <p>Ya has enviado tu formulario hoy.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 max-w-xl mx-auto'>
      <Label>Horas de sueño</Label>
      <Slider
        {...register('sleepHours')}
        defaultValue={[5]}
        max={10}
        min={1}
      />
      <Label>Calidad del sueño</Label>
      <Slider
        {...register('sleepQuality')}
        defaultValue={[5]}
        max={10}
        min={1}
      />
      <Label>Dolor muscular</Label>
      <Slider
        {...register('musclePain')}
        defaultValue={[5]}
        max={10}
        min={1}

      />
      <Label>Fatiga</Label>
      <Slider
        {...register('fatigue')}
        defaultValue={[5]}
        max={10}
        min={1}
      />
      <Label>Estrés</Label>
      <Slider
        {...register('stress')}
        defaultValue={[5]}
        max={10}
        min={1}
      />
      <Button type='submit'>Enviar</Button>
    </form >
  )
}