import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { BrandHeader } from '../brand-header'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Coach Dashboard",
      url: "#",
    },
    {
      title: "Building Your Application",
      url: "#",
    },
    {
      title: "API Reference",
      url: "#",
    },
    {
      title: "Architecture",
      url: "#",
    },
  ],
}

export function CoachSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <BrandHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton>
                <a href={item.url}>{item.title}</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='w-full flex items-center justify-start gap-2 px-2'>
              <Avatar className='w-8 h-8'>
                <AvatarImage alt='User avatar' />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <span className='font-medium'></span>
                <span></span>
              </div>
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
