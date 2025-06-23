import { z } from 'zod'

const baseUserSchema = {
  email: z.string().email({ message: 'El correo no es válido' }),
  password: z.string().min(8, {
    message: 'La contraseña tiene que tener al menos 8 caracteres'
  }),
  confirmPassword: z.string()
}

const adminUserSchema = z.object({
  ...baseUserSchema,
  role: z.literal('ADMIN'),
  // Defaulting firstName and lastName to empty strings for ADMIN role to satisfy backend RegisterDto
  firstName: z.string().optional().default(''),
  lastName: z.string().optional().default('')
})

const namedUserSchema = z.object({
  ...baseUserSchema,
  role: z.enum(['COACH', 'SWIMMER']),
  firstName: z.string().min(1, { message: 'El nombre es requerido' }),
  lastName: z.string().optional().default('') // Making lastName optional but defaulted for simplicity, can be refined
})

export const createUserSchema = z
  .discriminatedUnion('role', [adminUserSchema, namedUserSchema])
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })

export type CreateUserFormValues = z.infer<typeof createUserSchema>
