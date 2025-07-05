'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { ModeToggle } from '../../mode-toggle'
import useSWR from 'swr'
import { TeamCodeButton } from './team-code-button'

import { fetcher } from '@/lib/api'

export function CoachHeader() {

  const { data: team, isLoading, error } = useSWR(
    '/teams/my-team',
    fetcher
  )

  return (
    <header className='flex justify-between h-16 shrink-0 items-center border-b mx-4'>
      <SidebarTrigger className='-ml-1 cursor-pointer' />
      <div className='flex gap-4'>
        <TeamCodeButton
          teamCode={team?.teamCode}
          isLoading={isLoading}
          error={error}
        />
        <ModeToggle />
      </div>
    </header>
  )
}