import Image from "next/image"

import { Waves, User, Key, Eye } from "lucide-react"

import { LoginForm } from "@/components/forms/login-form"

export default async function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Waves className="size-4" />
            </div>
            SwimApp
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* Demo User Banner */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    ¡Prueba la demo!
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-800 dark:text-blue-200">
                      <strong>Email:</strong> demo@demo.com
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-800 dark:text-blue-200">
                      <strong>Password:</strong> 12345678
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src='/waves-bkg.jpeg'
          fill
          alt='Image'
          className='object-cover dark:brightness-[0.3]'
          sizes='50vw'
        />
      </div>
    </div>
  )
}
