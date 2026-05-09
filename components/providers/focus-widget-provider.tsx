'use client'

import { FocusFloatingWidget } from '@/components/focus/focus-floating-widget'
import { FocusSessionProvider } from '@/components/focus/focus-session-provider'

export function FocusWidgetProvider({ children }: { children: React.ReactNode }) {
  return (
    <FocusSessionProvider>
      {children}
      <FocusFloatingWidget />
    </FocusSessionProvider>
  )
}
