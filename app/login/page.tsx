import Image from "next/image"

import { Waves } from "lucide-react"

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
