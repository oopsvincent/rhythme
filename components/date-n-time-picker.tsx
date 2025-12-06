"use client"

import * as React from "react"
import { CalendarIcon, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type DateNTimePickerProps = {
  value: Date | undefined
  onChange: (value: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
}

export function DateNTimePicker({ 
  value, 
  onChange, 
  disabled,
  placeholder = "Pick a date & time"
}: DateNTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value)
  const [hours, setHours] = React.useState<string>(value ? String(value.getHours()).padStart(2, '0') : '12')
  const [minutes, setMinutes] = React.useState<string>(value ? String(value.getMinutes()).padStart(2, '0') : '00')

  // Sync with external value
  React.useEffect(() => {
    if (value) {
      setSelectedDate(value)
      setHours(String(value.getHours()).padStart(2, '0'))
      setMinutes(String(value.getMinutes()).padStart(2, '0'))
    } else {
      setSelectedDate(undefined)
      setHours('12')
      setMinutes('00')
    }
  }, [value])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(parseInt(hours) || 0)
      newDate.setMinutes(parseInt(minutes) || 0)
      newDate.setSeconds(0)
      setSelectedDate(newDate)
      onChange(newDate)
    } else {
      setSelectedDate(undefined)
      onChange(undefined)
    }
  }

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    setHours(newHours)
    setMinutes(newMinutes)
    
    if (selectedDate) {
      const newDate = new Date(selectedDate)
      newDate.setHours(parseInt(newHours) || 0)
      newDate.setMinutes(parseInt(newMinutes) || 0)
      newDate.setSeconds(0)
      setSelectedDate(newDate)
      onChange(newDate)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedDate(undefined)
    setHours('12')
    setMinutes('00')
    onChange(undefined)
  }

  const formatDisplay = () => {
    if (!selectedDate) return placeholder
    
    const dateStr = selectedDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
    const timeStr = selectedDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
    return `${dateStr} at ${timeStr}`
  }

  // Generate hour options
  const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  // Generate minute options (every 5 minutes)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-[80%] sm:w-auto justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="flex-1 truncate">{formatDisplay()}</span>
          {selectedDate && (
            <X 
              className="ml-2 h-4 w-4 opacity-50 hover:opacity-100" 
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-0 overflow-auto" align="start" sideOffset={4}>
        <div className="flex flex-col sm:flex-row max-h-[70vh] overflow-auto">
          {/* Calendar */}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
          
          {/* Time Picker */}
          <div className="border-t sm:border-t-0 sm:border-l p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Time
            </div>
            
            <div className="flex items-center gap-2">
              {/* Hours */}
              <div className="flex flex-col">
                <label className="text-xs text-muted-foreground mb-1">Hour</label>
                <select
                  value={hours}
                  onChange={(e) => handleTimeChange(e.target.value, minutes)}
                  className="h-10 w-16 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {hourOptions.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              
              <span className="text-xl font-medium mt-5">:</span>
              
              {/* Minutes */}
              <div className="flex flex-col">
                <label className="text-xs text-muted-foreground mb-1">Min</label>
                <select
                  value={minutes}
                  onChange={(e) => handleTimeChange(hours, e.target.value)}
                  className="h-10 w-16 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {minuteOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Quick Time Presets */}
            <div className="flex flex-wrap gap-1.5">
              {['09:00', '12:00', '15:00', '18:00'].map((preset) => {
                const [h, m] = preset.split(':')
                return (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => handleTimeChange(h, m)}
                  >
                    {parseInt(h) > 12 ? `${parseInt(h) - 12}PM` : parseInt(h) === 12 ? '12PM' : `${parseInt(h)}AM`}
                  </Button>
                )
              })}
            </div>
            
            {/* Done button for mobile */}
            <Button 
              size="sm" 
              className="sm:hidden mt-2"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
