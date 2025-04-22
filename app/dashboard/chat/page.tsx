'use client'

import { ChatInput } from '@/components/chat/chat-input'
import { useUserStore } from '@/lib/store/use-auth-store'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ChatPage() {
  const { user } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== 'COACH') {
      router.push('/dashboard')
    }
  }, [user, router])

  if (!user || user.role !== 'COACH') {
    return <Loader2 className='size-10' />
  }

  return (
    <main className='flex flex-col items-center justify-center h-full'>
      <div className='flex flex-col items-center justify-center flex-1 w-full max-w-3xl'>
        <div className='text-3xl font-semibold mb-50'>
          <p>Hola!</p>
          <p className='text-muted-foreground'>¿En que puedo ayudarte?</p>
        </div>
      </div>
      <ChatInput />
    </main>
  )
}