'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { fetcher } from '@/lib/api'
import useSWR from 'swr'
import { CreateGroupDialog } from '@/components/dashboard/coach/create-group-dialog'
import { GroupCard } from '@/components/dashboard/coach/group-card'

export function GroupsTab() {
  const { data: groups, isLoading } = useSWR('/teams/groups', fetcher)

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <TabsContent value='groups'>
      <Card className='h-full'>
        <CardHeader>
          <div className='flex items-center justify-between gap-4 mb-4'>
            <CardTitle>Grupos</CardTitle>
            <CreateGroupDialog />
          </div>
          <CardDescription>
            Aquí puedes gestionar los grupos de tus nadadores. Puedes crear, editar y eliminar grupos según tus necesidades.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col flex-grow'>
          {groups && groups.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {groups.map((group: Group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          ) : (
            <div className='flex flex-1 items-center justify-center'>
              <span className='text-muted-foreground text-2xl text-center'>No tienes grupos de nadadores</span>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}