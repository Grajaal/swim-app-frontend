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

export function UsersTable({ users }: { users: User[] }) {
  const handleDelete = async (userId: string) => {
    // TODO: Implement delete user functionality
    console.log(userId)
  }

  return (
    <Table>
      <TableCaption>Usuarios registrados en la aplicación</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Nombre</TableHead>
          <TableHead>Apellidos</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          user.role === 'COACH' ? (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.coach?.firstName}</TableCell>
              <TableCell>{user.coach?.lastName}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ) : user.role === 'SWIMMER' ? (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.swimmer?.firstName}</TableCell>
              <TableCell>{user.swimmer?.lastName}</TableCell>
              <TableCell>{user.role}</TableCell>
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