import { Label } from '@/components/ui/label'
import { RoleCard } from '@/components/forms/role-card'

import { UserPen, Droplet } from 'lucide-react'

type Role = 'COACH' | 'SWIMMER'

interface RoleSelectorProps {
  value: Role
  onChange: (role: Role) => void
  error?: string
}

export function RoleSelector({ value, onChange, error }: RoleSelectorProps) {
  return (
    <div className='grid gap-2'>
      <Label>Selecciona tu rol</Label>
      <div className='grid grid-cols-2 gap-4'>
        <RoleCard
          onClick={() => onChange('COACH')}
          title='Entrenador'
          icon={<UserPen className='size-8' />}
          selected={value === 'COACH'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onChange('COACH')
            }
          }}
        />
        <RoleCard
          onClick={() => onChange('SWIMMER')}
          title='Nadador'
          icon={<Droplet className='size-8' />}
          selected={value === 'SWIMMER'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onChange('SWIMMER')
            }
          }}
        />
      </div>
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div >
  )
}