'use client'

import { fetcher, fetcherTest } from '@/lib/api'
import useSWR from 'swr'
import { Loader2 } from 'lucide-react'
import { UsersTable } from '@/components/dashboard/admin/users-table'
import { Input } from '@/components/ui/input'
import { useMemo, useState } from 'react'
import { Select } from '@/components/ui/select'
import { RoleSelect } from '@/components/dashboard/admin/role-select'

export default function AdminDashboard() {
  const { data: users, isLoading: usersLoading } = useSWR('/users?limit=15', fetcher)
  const [search, setSearch] = useState<string>('')
  const [role, setRole] = useState<string>('all')

  const filteredUsers = useMemo(() => {
    if (!users) return []
    return users.filter((user: User) => {
      const name = user.role === 'COACH'
        ? `${user.coach?.firstName} ${user.coach?.lastName}`
        : `${user.swimmer?.firstName} ${user.swimmer?.lastName}`

      const matchesSearch = search === '' || name.toLowerCase().includes(search.toLowerCase())
      const matchesRole = role === 'all' || user.role === role

      return matchesSearch && matchesRole
    })
  }, [users, search, role])

  if (usersLoading) {

    return (
      <div className='flex items-center justify-center h-full'>
        < Loader2 className='size-10 animate-spin' />
      </div>
    )

  }

  return (
    <main className='flex justify-center p-4'>
      <div className='flex flex-col w-full max-w-5xl gap-4'>
        <div className='flex justify-between space-x-2'>
          <Input
            placeholder="Buscar..."
            className='max-w-sm'
            onChange={(e) => setSearch(e.target.value)}
          />
          <RoleSelect
            role={role}
            setRole={setRole}
          />
        </div>
        <UsersTable
          users={filteredUsers}
        />
      </div>
    </main>
  )
}