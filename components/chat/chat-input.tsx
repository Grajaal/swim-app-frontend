import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'
import { useState } from 'react'
import { API_URL } from '@/lib/api'
import { toast } from 'sonner'

export function ChatInput() {
  const [message, setMessage] = useState<string>('')

  const handleSubmit = async () => {

    if (!message.trim()) return

    const response = await fetch(`${API_URL}/ai`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: message })
    })

    if (!response.ok) {
      toast.error('Error al enviar el mensaje')
    }

    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className='w-full max-w-lg relative'>
      <Textarea
        onKeyDown={handleKeyDown}
        className='bg-secondary resize-none'
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        placeholder='Escribe un mensaje...'
      />
      <Button
        size={'icon'}
        className='absolute rounded-full right-2 bottom-2 h-7 w-7 '
        aria-label='Enviar mensaje'
      >
        <ArrowUp className='size-5' />
      </Button>
    </div>
  )
}