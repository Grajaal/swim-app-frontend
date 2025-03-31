'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { ModeToggle } from '../../mode-toggle'
import useSWR from 'swr'
import { TeamCodeButton } from './team-code-button'

import { API_URL } from '@/lib/api'

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(res => {
    if (!res.ok) throw new Error('Failed to fetch team')
    return res.json()
  })

export function CoachHeader() {

  const { data: team, isLoading, error } = useSWR(
    `${API_URL}/teams/my-team`,
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