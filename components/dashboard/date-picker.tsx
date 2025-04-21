'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'

import { format, isToday } from 'date-fns'
import { es } from 'date-fns/locale'

import { cn } from '@/lib/utils'

interface DatePickerProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

export function DatePicker({ selectedDate, onDateChange, side, align }: DatePickerProps) {
  const today = new Date()

  const disableFutureDates = {
    after: new Date(today.setHours(23, 59, 59, 999))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            "w-32 justify-start text-left font-normal", // Added fixed width w-52 (13rem / 208px)
            !selectedDate && "text-muted-foreground",
          )}
        >
          <CalendarIcon className='size-4' /> {/* Added mr-2 for spacing */}
          {selectedDate
            ? (isToday(selectedDate) ? 'Hoy' : format(selectedDate, "dd/MM/yyyy", { locale: es }))
            : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        side={side}
        align={align}
      >
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={(date) => date && onDateChange(date)}
          disabled={disableFutureDates}
          locale={es}
        >
        </Calendar>
      </PopoverContent>
    </Popover>
  )
}