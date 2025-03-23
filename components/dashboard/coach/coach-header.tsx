import { SidebarTrigger } from '@/components/ui/sidebar'
import { ModeToggle } from '../../mode-toggle'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function CoachHeader() {
  return (
    <header className='flex justify-between h-16 shrink-0 items-center border-b mx-4'>
      <SidebarTrigger className='-ml-1 cursor-pointer' />
      <Button
        onClick={() => {
          toast('This feature is not avaible yet')
        }}
      >
        Not implemented
      </Button>
      <ModeToggle />
    </header>
  )
}