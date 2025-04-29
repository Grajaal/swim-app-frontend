import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { BrandHeader } from '../brand-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { DropdownMenuItemLogout } from '@/components/dropdown-logout'
import { useUserStore } from '@/lib/store/use-auth-store'
import useSWR from 'swr'
import { fetcher } from '@/lib/api'
import { Bot, Dumbbell, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserButton } from '@/components/user-button'

const data = {
  navMain: [
    {
      title: 'Nadadores',
      url: '/dashboard',
      icon: <Users className='size-4' />
    },
    {
      title: 'Entrenamientos',
      url: '/dashboard/trainings',
      icon: <Dumbbell className='size-4' />
    },
    {
      title: 'Asistente',
      url: '/dashboard/chat',
      icon: <Bot className='size-4' />
    }
  ],
}

export function CoachSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserStore((state) => state.user)
  const { data: coach } = useSWR(`/coaches/${user?.id}`, fetcher)
  const pathname = usePathname()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <BrandHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const isActive = pathname === item.url

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.url}>
                      {item.icon}
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />

      <SidebarFooter>
        <UserButton name={coach?.firstName} />
      </SidebarFooter>
    </Sidebar >
  )
}
