import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RoleSelectProps {
  role: string
  setRole: (role: string) => void
}

export function RoleSelect({ role, setRole }: RoleSelectProps) {
  return (
    <Select value={role} onValueChange={setRole}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Rol" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="SWIMMER">SWIMMER</SelectItem>
        <SelectItem value="COACH">COACH</SelectItem>
      </SelectContent>
    </Select>

  )
}