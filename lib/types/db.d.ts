interface Group {
  id: string
  name: string
  swimmers: Swimmer[]
}

interface Swimmer {
  id: string
  firstName: string
  lastName: string
  team?: Team
}

interface Coach {
  id: string
  firstName: string
  lastName: string
  teamCode: string
  team?: Team
}

interface Training {
  id: string
  date: Date
  meters: number
  minutes: number
  description?: string
  groupId?: string
}

interface User {
  id: string
  email: string
  role: 'COACH' | 'SWIMMER' | 'ADMIN'
  swimmer?: Swimmer
  coach?: Coach
}

interface TeamCoach {
  id: string
  firstName: string
  lastName?: string
}

interface TeamSwimmer {
  id: string
  firstName: string
  lastName?: string
}

interface Team {
  id: string
  teamCode: string
  coach?: TeamCoach
  swimmers?: TeamSwimmer[]
}

interface UsersApiResponse {
  users: User[]
  totalUsers: number
  totalPages: number
  currentPage: number
}
