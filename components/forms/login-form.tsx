'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { LoginFormValues, loginSchema } from "@/lib/schemas/auth"
import { useUserStore } from '@/lib/store/use-auth-store'

import { API_URL } from "@/lib/api"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
    resolver: zodResolver(loginSchema)
  })
  const router = useRouter()

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw { status: response.status }
      }

      const responseData = await response.json()

      if (responseData.user) {
        useUserStore.getState().setUser(responseData.user)
      }

      // Solución híbrida: usar localStorage si no hay cookies
      const hasCookie = document.cookie.includes('jwt=')
      if (!hasCookie && responseData.token) {
        localStorage.setItem('jwt_token', responseData.token)
      }

      router.push('/dashboard')

    } catch (error: unknown) {
      console.error('Login error:', error)
      if (typeof error === 'object' && error && 'status' in error && error.status === 401) {
        setError('root', { message: 'El correo o la contraseña son incorrectos' })
      } else {
        setError('root', { message: 'Hubo un error al intentar iniciar sesión' })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input {...register('email')} type="email" placeholder="m@example.com" tabIndex={1} />
          {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
              tabIndex={4}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <Input {...register('password')} type="password" tabIndex={2} />
          {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
        </div>
        {errors.root && <p className='text-red-500 text-sm'>{errors.root.message}</p>}
        <Button disabled={isSubmitting} type="submit" className='w-full cursor-pointer' tabIndex={3}>
          Iniciar sesión
        </Button>
      </div>
      <div className="text-center text-sm">
        ¿No tienes cuenta?{" "}
        <a href="/register" className="underline underline-offset-4" tabIndex={5}>
          Regístrate
        </a>
      </div>
    </form >
  )
}
