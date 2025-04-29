import { ModeToggle } from '@/components/mode-toggle'
import { UserButton } from '@/components/user-button'

export function AdminHeader() {
  return (
    <header className='flex justify-between h-16 shrink-0 items-center border-b mx-4'>
      <UserButton
        name='Admin'
      />
      <ModeToggle />
    </header>
  )
}