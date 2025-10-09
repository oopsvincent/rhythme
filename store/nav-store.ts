// store/navigation-store.ts
import { create } from 'zustand'

type Section = 'overview' | 'analytics' | 'data-table' | 'settings'

interface NavigationState {
  activeSection: Section
  setActiveSection: (section: Section) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeSection: 'overview',
  setActiveSection: (section) => set({ activeSection: section }),
}))

export type { Section }