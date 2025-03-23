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

      const response = await fetch('http://localhost:4000/api/auth/register', {
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
        <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
          <span className='relative z-10 bg-background px-2 text-muted-foreground'>
            O continúa con
          </span>
        </div>
        <Button variant='outline' className='w-full'>
          <svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='100' height='100' viewBox='0 0 30 30'>
            <path d='M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z'></path>
          </svg>
          Iniciar sesión con Google
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
