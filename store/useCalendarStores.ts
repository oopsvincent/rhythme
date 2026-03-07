import { create } from 'zustand'

interface CalendarState {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
}

export const useDashboardCalendarStore = create<CalendarState>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}))

export const useTaskCalendarStore = create<CalendarState>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}))

export const useHabitCalendarStore = create<CalendarState>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}))
