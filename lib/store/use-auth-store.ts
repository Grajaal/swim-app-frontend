import { create } from 'zustand'
import { persist } from 'zustand/middleware'

enum Role {
  COACH = 'COACH',
  SWIMMER = 'SWIMMER',
  ADMIN = 'ADMIN'
}

interface User {
  id: string
  email: string
  name?: string | null
  role: Role
  createdAt: string
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: user !== null
        })
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
