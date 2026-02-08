'use client'

import { FocusFloatingWidget } from '@/components/focus/focus-floating-widget'

export function FocusWidgetProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FocusFloatingWidget />
    </>
  )
}
