import { SidebarTrigger } from '@/components/ui/sidebar'
import { ModeToggle } from '../../mode-toggle'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'

export function CoachHeader() {
  return (
    <header className='flex justify-between h-16 shrink-0 items-center border-b mx-4'>
      <SidebarTrigger className='-ml-1 cursor-pointer' />
      <div className='flex gap-4'>
        <Button
          className='bg-primary'
          onClick={() => {
            toast('This feature is not avaible yet')
          }}
        >
          <Copy className='size-4' />
          Not implemented
        </Button>
        <ModeToggle />
      </div>
    </header>
  )
}