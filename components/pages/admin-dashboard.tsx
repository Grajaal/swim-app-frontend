'use client'

import { fetcher, fetcherTest } from '@/lib/api'
import useSWR from 'swr'
import { Loader2 } from 'lucide-react'
import { UsersTable } from '@/components/dashboard/admin/users-table'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { RoleSelect } from '@/components/dashboard/admin/role-select'
import { useDebounce } from 'use-debounce'
import { TablePagination } from '@/components/dashboard/admin/table-pagination'

export default function AdminDashboard() {
  const [search, setSearch] = useState<string>('')
  const [role, setRole] = useState<string>('all')
  const [page, setPage] = useState<number>(1)

  const [debouncedSearch] = useDebounce(search, 500)

  const swrKey = `/users?page=${page}&limit=10${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}${role !== 'all' ? `&role=${role}` : ''}`

  const { data, isLoading: usersLoading, error } = useSWR<UsersApiResponse>(swrKey, fetcher)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, role])

  if (usersLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        < Loader2 className='size-10 animate-spin' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-red-500'>Error al cargar los usuarios</p>
      </div>
    )
  }

  const canPreviousPage = page > 1
  const canNextPage = page < (data?.totalPages || 1)

  const handlePreviousPage = () => {
    if (canPreviousPage)
      setPage((prev) => prev - 1)
  }

  const handleNextPage = () => {
    if (canNextPage)
      setPage((prev) => prev + 1)
  }

  return (
    <main className='flex justify-center p-4'>
      <div className='flex flex-col w-full max-w-5xl gap-4'>
        <div className='flex justify-between space-x-2'>
          <Input
            value={search ?? ''}
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
          users={data?.users || []}
        />
        {data && (
          <TablePagination
            page={data.currentPage}
            totalPages={data.totalPages}
            onPreviousPage={handlePreviousPage}
            onFirstPage={() => setPage(1)}
            onLastPage={() => setPage(data.totalPages)}
            onNextPage={handleNextPage}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
          />
        )}
      </div>
    </main>
  )
}