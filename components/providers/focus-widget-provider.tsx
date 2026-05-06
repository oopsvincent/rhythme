'use client'

import { FocusFloatingWidget } from '@/components/focus/focus-floating-widget'
import { FocusSync } from '@/components/focus/focus-sync'

export function FocusWidgetProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FocusFloatingWidget />
      <FocusSync />
    </>
  )
}

