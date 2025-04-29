import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { DropdownMenuItemLogout } from '@/components/dropdown-logout'

export function UserButton({ name }: { name: string }) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className='w-full flex items-center justify-start gap-2 py-6'>
            <span className='font-semibold'>{name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItemLogout />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}