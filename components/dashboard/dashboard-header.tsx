import { SidebarTrigger } from '@/components/ui/sidebar'
import { ModeToggle } from '../mode-toggle'

export function DashboardHeader() {
  return (
    <header className='flex justify-between h-16 shrink-0 items-center border-b mx-4'>
      <SidebarTrigger className='-ml-1 cursor-pointer' />
      <ModeToggle />
    </header>
  )
}