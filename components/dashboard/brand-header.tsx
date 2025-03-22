import {
  SidebarMenu,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Waves } from 'lucide-react'

export function BrandHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className='flex gap-3 p-2 items-center'>
          <div className='rounded-md p-1.5 bg-sidebar-primary text-sidebar-primary-foreground'>
            <Waves className='size-5' />
          </div>
          <span className='font-bold'>SwimApp</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}