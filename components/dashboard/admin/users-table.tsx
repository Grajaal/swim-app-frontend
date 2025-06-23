import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteUserAlertDialog } from './delete-user-alert-dialog'
import { API_URL } from '@/lib/api'
import { toast } from 'sonner'
import { mutate } from 'swr'
import { UserDetailsModal } from '@/components/dashboard/admin/user-details-modal'

interface UsersTableProps {
  users: User[]
  swrKey: string
}

export function UsersTable({ users, swrKey }: UsersTableProps) {
  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        let errorMessage = 'Error al eliminar el usuario.'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          // Ignore if response is not JSON or other parsing error
        }
        throw new Error(errorMessage)
      }

      toast.success('Usuario eliminado correctamente')
      mutate(swrKey)
    } catch (error) {
      console.error('Failed to delete user:', error)
      const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
      toast.error(message)
    }
  }

  return (
    <Table>
      <TableCaption>Usuarios registrados en la aplicación</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Nombre</TableHead>
          <TableHead>Apellidos</TableHead>
          <TableHead>Correo Electrónico</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Team Code</TableHead>
          <TableHead>Related Info</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          user.role === 'COACH' ? (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.coach?.firstName}</TableCell>
              <TableCell>{user.coach?.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.coach?.team?.teamCode || 'N/A'}</TableCell>
              <TableCell>
                {user.coach?.team ? (
                  <UserDetailsModal user={user} triggerText="View Team" />
                ) : (
                  'N/A'
                )}
              </TableCell>
              <TableCell>
                <DeleteUserAlertDialog
                  userId={user.id}
                  handleDelete={handleDelete}
                />
              </TableCell>
            </TableRow>
          ) : user.role === 'SWIMMER' ? (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.swimmer?.firstName}</TableCell>
              <TableCell>{user.swimmer?.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.swimmer?.team?.teamCode || 'N/A'}</TableCell>
              <TableCell>
                {user.swimmer?.team ? (
                  <UserDetailsModal user={user} triggerText="View Details" />
                ) : (
                  'N/A'
                )}
              </TableCell>
              <TableCell>
                <DeleteUserAlertDialog
                  userId={user.id}
                  handleDelete={handleDelete}
                />
              </TableCell>
            </TableRow>
          ) : user.role === 'ADMIN' ? (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{"N/A"}</TableCell>
              <TableCell>{"N/A"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{"N/A"}</TableCell>
              <TableCell>{"N/A"}</TableCell>
              <TableCell>
                <DeleteUserAlertDialog
                  userId={user.id}
                  handleDelete={handleDelete}
                />
              </TableCell>
            </TableRow>
          ) : null
        ))}
      </TableBody>
    </Table>
  )
}