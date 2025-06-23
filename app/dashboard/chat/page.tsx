/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ChatInput } from '@/components/chat/chat-input'
import { API_URL } from '@/lib/api'
import { useUserStore } from '@/lib/store/use-auth-store'
import { cn } from '@/lib/utils'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessageChart } from '@/components/chat/chat-message-chart'
import { Button } from '@/components/ui/button'

export interface ChartData {
  chart_type: string
  title: string
  data: any[]
  x_axis_key: string
  y_axis_keys: string[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  chart?: ChartData
  isLoading?: boolean
}

// Interfaces locales simplificadas para la respuesta de IA
interface SimplifiedFunctionCall {
  name?: string
  arguments?: string
}

interface SimplifiedToolCall {
  id: string
  type: 'function'
  function: SimplifiedFunctionCall
}

interface SimplifiedAssistantResponse {
  content: string | null // content puede ser null
  tool_calls?: SimplifiedToolCall[]
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

  const handleNewChat = () => {
    setMessages([])
    setInput('')
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input
    }

    const assistantMessageId = crypto.randomUUID()
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      isLoading: true
    }

    setMessages((prev) => [...prev, userMessage, initialAssistantMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/ai`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ history: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) })
      })

      if (!response.ok) {
        throw new Error(`Error from assistant: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')

      if (contentType && contentType.includes('application/json')) {
        const assistantResponseJson: SimplifiedAssistantResponse = await response.json()

        let finalContent = assistantResponseJson.content || ''
        let chartPayload: ChartData | undefined = undefined

        if (assistantResponseJson.tool_calls) {
          const displayChartCall = assistantResponseJson.tool_calls.find(
            (tc: SimplifiedToolCall) => tc.type === 'function' && tc.function.name === 'display_chart'
          )

          if (displayChartCall && displayChartCall.function.arguments) {
            try {
              const args = JSON.parse(displayChartCall.function.arguments)
              chartPayload = {
                chart_type: args.chart_type,
                title: args.title,
                data: args.data,
                x_axis_key: args.x_axis_key,
                y_axis_keys: args.y_axis_keys,
              }
              if (!finalContent && chartPayload) finalContent = ''
            } catch (e) {
              console.error("Error parsing chart arguments", e)
              finalContent = "Hubo un problema al procesar los datos del gráfico."
              chartPayload = undefined
            }
          } else {
            if (!finalContent && assistantResponseJson.tool_calls) {
              finalContent = "Recibí una instrucción de herramienta que no pude mostrar."
            }
          }
        } else if (!assistantResponseJson.content) {
          finalContent = "Recibí una respuesta vacía."
        }

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: finalContent, chart: chartPayload, isLoading: false }
              : msg
          )
        )

      } else if (contentType && contentType.includes('text/event-stream')) {
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let done = false
        let streamedContent = ''

        while (!done) {
          const { value, done: readerDone } = await reader.read()
          done = readerDone
          if (value) {
            const chunk = decoder.decode(value, { stream: true })
            streamedContent += chunk

            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: streamedContent, isLoading: streamedContent.length === 0 }
                  : msg
              )
            )
          }
        }
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, isLoading: false } : msg
          )
        )
      } else if (contentType && contentType.includes('text/plain')) {
        const plainText = await response.text()
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: plainText, isLoading: false }
              : msg
          )
        )
      } else {
        const errorText = await response.text()
        throw new Error(`Unexpected content type: ${contentType}. Response: ${errorText}`)
      }

    } catch (error) {
      console.error('Error sending message', error)
      toast.error((error instanceof Error) ? error.message : 'Error al enviar el mensaje')
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: 'Error al obtener respuesta del asistente.', chart: undefined, isLoading: false }
            : msg
        )
      )
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
    <div className='flex flex-col justify-between items-center h-full -mx-2 relative'>
      <div className="absolute top-0 right-0 p-2 z-10">
        <Button onClick={handleNewChat} variant="outline" aria-label="Nuevo Chat" className="h-10 px-3">
          Nuevo Chat
          <RefreshCcw className="size-5 ml-2" />
        </Button>
      </div>
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
                    : 'prose dark:prose-invert max-w-none'
                )}>
                  {msg.role === 'assistant' ? (
                    msg.isLoading ? (
                      <Loader2 className='size-5 animate-spin text-muted-foreground' />
                    ) : msg.chart ? (
                      <ChatMessageChart chartData={msg.chart} />
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
      )}

      <ChatInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}