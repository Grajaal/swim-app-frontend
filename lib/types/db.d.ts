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

interface Training {
  id: string
  date: Date
  meters: number
  minutes: number
  description?: string
  groupId?: string
}
