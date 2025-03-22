import { cn } from '@/lib/utils'

import { Check } from 'lucide-react'

interface RoleCardProps {
  title: string
  icon: React.ReactNode
  selected: boolean
  onClick: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
}

export function RoleCard({ title, icon, selected, onClick, onKeyDown }: RoleCardProps) {
  return (
    <div
      tabIndex={0}
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center border-2 rounded-lg transition-all cursor-pointer',
        'aspect-square',
        'hover:border-primary',
        selected ? 'border-primary bg-primary/5' : 'border-border'
      )}
      onKeyDown={onKeyDown}
    >
      <div className='mb-3 text-primary'>{icon}</div>
      <span className='font-medium text-md'>{title}</span>

      {
        selected && (
          <div className='absolute top-2 right-2 text-primary'>
            <Check className='w-5 h-5' />
          </div>
        )
      }
    </div >
  )
}