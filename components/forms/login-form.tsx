'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { LoginFormValues, loginSchema } from "@/lib/schemas/auth"

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
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw { status: response.status }
      }

      router.push('/dashboard')

    } catch (error: unknown) {
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
        <Button disabled={isSubmitting} type="submit" className="w-full" tabIndex={3}>
          Iniciar sesión
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            O continúa con
          </span>
        </div>
        <Button variant="outline" className="w-full" tabIndex={5}>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
            <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"></path>
          </svg>
          Iniciar sesión con Google
        </Button>
      </div>
      <div className="text-center text-sm">
        ¿No tienes cuenta?{" "}
        <a href="/register" className="underline underline-offset-4" tabIndex={6}>
          Regístrate
        </a>
      </div>
    </form >
  )
}
