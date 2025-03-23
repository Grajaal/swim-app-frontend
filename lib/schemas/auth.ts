import { z } from 'zod'

export const registerSchema = z
  .object({
    email: z.string().email({ message: 'El correo no es válido' }),
    password: z.string().min(8, {
      message: 'La contraseña tiene que tener al menos 8 carácteres'
    }),
    confirmPassword: z.string(),
    firstName: z.string().min(1, { message: 'El nombre es requerido' }),
    lastName: z.string().optional(),
    role: z.enum(['COACH', 'SWIMMER'], {
      message: 'Selecciona un rol'
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })

export const loginSchema = z.object({
  email: z.string().email({ message: 'Introduce un correo que sea válido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' })
})

export type RegisterFormValues = z.infer<typeof registerSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
