'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerSchema, RegisterFormValues } from '@/lib/schemas/auth'
import { RoleSelector } from '@/components/forms/role-selector'
import { API_URL } from '@/lib/api'

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError, setValue, watch } = useForm({
    resolver: zodResolver(registerSchema),
  })
  const [success, setSuccess] = useState<string | null>(null)
  const roleValue = watch('role')
  const router = useRouter()

  const handleRoleChange = (role: 'COACH' | 'SWIMMER') => {
    setValue('role', role)
  }

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const { confirmPassword: _, ...dataToSend } = data

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        throw { status: response.status }
      }

      setSuccess('Cuenta creada correctamente')

      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'status' in error && error.status === 409) {
        setError('email', { message: 'Ese correo ya está en uso' })
      } else {
        setError('root', { message: 'Hubo un error al hacer el registro' })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('flex flex-col gap-6', className)} {...props}>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>Haz una cuenta</h1>
      </div>
      <div className='grid gap-6'>
        <div className='grid gap-2'>
          <Label htmlFor='firstName'>Nombre</Label>
          <Input {...register('firstName')} type='text' />
          {errors.firstName && <p className='text-red-500 text-sm'>{errors.firstName.message}</p>}
          <Label htmlFor='lastName'>Apellidos</Label>
          <Input {...register('lastName')} type='text' placeholder='Opcional' />
          <Label htmlFor='email'>Correo electrónico</Label>
          <Input {...register('email')} type='email' placeholder='m@example.com' />
          {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
        </div>

        <RoleSelector value={roleValue} onChange={handleRoleChange} error={errors.role?.message} />

        <div className='grid gap-2'>
          <div className='flex items-center'>
            <Label htmlFor='password'>Contraseña</Label>
          </div>
          <Input {...register('password')} type='password' />
          {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
          <div className='flex items-center justify-between'>
            <Label htmlFor='password'>Confirma tu contraseña</Label>
          </div>
          <Input {...register('confirmPassword')} type='password' />
          {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>}
        </div>
        {errors.root && <p className='text-red-500 text-sm'>{errors.root.message}</p>}
        {success && <p className='text-emerald-500 text-sm'>{success}</p>}
        <Button disabled={isSubmitting} type='submit' className='w-full cursor-pointer'>
          Crear cuenta
        </Button>
      </div>
      <div className='text-center text-sm'>
        ¿Ya tienes cuenta?{' '}
        <a href='/login' className='underline underline-offset-4'>
          Inicia sesión
        </a>
      </div>
    </form >
  )
}
