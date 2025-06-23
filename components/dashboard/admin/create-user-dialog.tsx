'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mutate } from 'swr'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createUserSchema, CreateUserFormValues } from '@/lib/schemas/user-creation' // Updated import
import { API_URL } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

interface CreateUserDialogProps {
  swrKey: string
}

export function CreateUserDialog({ swrKey }: CreateUserDialogProps) { // Renamed component
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    watch,
    setValue,
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'ADMIN', // Default role
      firstName: '',
      lastName: '',
    },
  })

  const watchedRole = watch('role')

  // Effect to set default values for firstName and lastName when role is ADMIN
  // This ensures that if the user switches to ADMIN, these fields are cleared conceptually
  // and the schema defaults for ADMIN (empty strings) will be used upon submission if fields are hidden.
  useEffect(() => {
    if (watchedRole === 'ADMIN') {
      setValue('firstName', '', { shouldValidate: true })
      setValue('lastName', '', { shouldValidate: true })
    }
  }, [watchedRole, setValue])

  const onSubmit = async (data: CreateUserFormValues) => {
    try {
      const { confirmPassword, ...dataToSend } = data
      // Ensure firstName and lastName are set for ADMIN as per schema defaults if not provided by form (they should be hidden)
      if (dataToSend.role === 'ADMIN') {
        dataToSend.firstName = dataToSend.firstName || ''
        dataToSend.lastName = dataToSend.lastName || ''
      }

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 409) {
          setError('email', { message: errorData.message || 'Este correo ya está en uso' })
        } else {
          setError('root', { message: errorData.message || 'Error al crear el usuario' })
        }
        throw new Error(errorData.message || 'Failed to create user')
      }

      toast.success('Usuario creado correctamente')
      mutate(swrKey)
      reset()
      setOpen(false)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Hubo un error inesperado'
      if (!(error instanceof Error && (error.message.includes('Este correo ya está en uso')))) {
        setError('root', { message })
      }
      console.error('Error creating user:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) {
        reset()
      }
    }}>
      <DialogTrigger asChild>
        <Button>Crear Usuario</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle> {/* Updated title */}
          <DialogDescription>
            Completa los detalles para crear un nuevo usuario.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="usuario@example.com" {...register('email')} />
            {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Rol</Label>
            <Select onValueChange={(value) => setValue('role', value as 'ADMIN' | 'COACH' | 'SWIMMER', { shouldValidate: true })} defaultValue={watchedRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="COACH">COACH</SelectItem>
                <SelectItem value="SWIMMER">SWIMMER</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className='text-red-500 text-sm'>{errors.role.message}</p>}
          </div>

          {(watchedRole === 'COACH' || watchedRole === 'SWIMMER') && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && <p className='text-red-500 text-sm'>{errors.firstName.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Apellidos (Opcional)</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && <p className='text-red-500 text-sm'>{errors.lastName.message}</p>}
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>}
          </div>

          {errors.root && <p className='text-red-500 text-sm text-center'>{errors.root.message}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 