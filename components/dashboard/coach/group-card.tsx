'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { stringToHslColor } from '@/lib/utils'
import { EditGroupDialog } from '@/components/dashboard/coach/edit-group-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Ellipsis } from 'lucide-react'
import { useState } from 'react'
import { ConfirmationDialog } from '@/components/dashboard/coach/confirmation-alert-dialog'
import { API_URL } from '@/lib/api'
import { toast } from 'sonner'
import { mutate } from 'swr'

export function GroupCard({ group }: { group: Group }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  const handleDeleteGroup = async () => {
    const response = await fetch(`${API_URL}/groups/${group.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) {
      toast.error('Algo salió mal al eliminar el grupo', {
        description: 'Por favor, inténtalo de nuevo más tarde.'
      })
    } else {
      mutate('/teams/groups')
    }
  }

  return (
    <Card>
      <CardHeader className='flex flex-row justify-between items-center'>
        <CardTitle>{group.name}</CardTitle>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='link' size='icon' className='size-8'>
              <Ellipsis className='size-5 cursor-pointer' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className='cursor-pointer'
              onSelect={() => {
                setIsEditDialogOpen(true)
              }}
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setIsDeleteDialogOpen(true)
              }}
              className='text-red-500 cursor-pointer'
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className='grid gap-2'>
        {group.swimmers.map((swimmer: Swimmer) => {
          const avatarColor = stringToHslColor(swimmer.id)

          return (
            <div key={swimmer.id} className='flex items-center gap-2'>
              <Avatar className='size-9'>
                <AvatarFallback style={{ backgroundColor: avatarColor }} className='text-foreground'>
                  {`${swimmer.firstName[0]}${swimmer.lastName[0]}`}
                </AvatarFallback>
              </Avatar>
              <span>{`${swimmer.firstName} ${swimmer.lastName}`}</span>
            </div>
          )
        })}
      </CardContent>

      <EditGroupDialog
        group={group}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        description='¿Estás seguro de que deseas eliminar este grupo? Esta acción no se puede deshacer.'
        onConfirm={handleDeleteGroup}
        confirmButtonText='Eliminar'
        confirmButtonVariant='destructive'
      />

    </Card>
  )
}