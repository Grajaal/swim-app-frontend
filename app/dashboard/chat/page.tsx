'use client'

import { ChatInput } from '@/components/chat/chat-input'
import { API_URL } from '@/lib/api'
import { useUserStore } from '@/lib/store/use-auth-store'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import { ScrollArea } from '@/components/ui/scroll-area'
import { messages as msgs } from '@/lib/mock/messages'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const { user } = useUserStore()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input
    }

    const history = [...messages, userMessage]

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: ''
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/ai`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ history })
      })

      if (!response.ok) {
        throw new Error('Error obtaining response from the assistant')
      }

      if (!response.body) {
        throw new Error('Response body is null or undefined')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let streamedContent = ''

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          streamedContent += chunk

          setMessages((prevMessages) => {
            return prevMessages.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: streamedContent }
                : msg
            )
          })
        }
      }
    } catch (error) {
      console.error('Error sending message', error)
      toast.error('Error al enviar el mensaje')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user && user.role !== 'COACH') {
      router.push('/dashboard')
    }
  }, [user, router])

  if (!user || user.role !== 'COACH') {
    return <Loader2 className='size-10' />
  }

  return (
    <div className='flex flex-col justify-between items-center h-full -mx-2'>
      {messages.length === 0 && (
        <div className='flex flex-1 items-center'>
          <div className='text-3xl font-semibold mb-50'>
            <p>Hola!</p>
            <p className='text-muted-foreground'>¿En que puedo ayudarte?</p>
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <ScrollArea className='w-full overflow-y-auto'>
          <div className='flex flex-col gap-4 w-full xl:max-w-5xl mx-auto'>
            {messages.map((msg) => (
              <div key={msg.id} className={cn(
                'flex w-full',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}>
                <div className={cn(
                  'p-3',
                  msg.role === 'user'
                    ? 'bg-primary rounded-lg text-primary-foreground'
                    : 'prose dark:prose-invert'
                )}>

                  {msg.role === 'assistant' ? (
                    msg.content === '' ? (
                      <Loader2 className='size-5 animate-spin text-muted-foreground' />
                    ) : (
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    )
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )
      }

      <ChatInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={handleSendMessage}
        isLoading={isLoading}
      />
    </div >
  )
}