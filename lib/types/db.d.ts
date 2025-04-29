interface Group {
  id: string
  name: string
  swimmers: Swimmer[]
}

interface Swimmer {
  id: string
  firstName: string
  lastName: string
}

interface Coach {
  id: string
  firstName: string
  lastName: string
  teamCode: string
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
  role: 'COACH' | 'SWIMMER'
  swimmer?: Swimmer
  coach?: Coach
}
