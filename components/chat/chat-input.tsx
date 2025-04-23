import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'

interface ChatInputProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: () => void
  isLoading: boolean
}

export function ChatInput({ value, onChange, onSubmit, isLoading }: ChatInputProps) {


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className='w-full xl:max-w-5xl relative'>
      <Textarea
        onKeyDown={handleKeyDown}
        onChange={onChange}
        value={value}
        placeholder='Escribe un mensaje...'
        disabled={isLoading}
        className='bg-secondary resize-none h-30 !text-lg'
      />
      <Button
        size={'icon'}
        onClick={onSubmit}
        className='absolute rounded-full right-2 bottom-2 h-7 w-7 '
        aria-label='Enviar mensaje'
        disabled={isLoading || !value.trim()}
      >
        <ArrowUp className='size-5' />
      </Button>
    </div>
  )
}