import { create } from 'zustand'

interface RightSidebarState {
  isCollapsed: boolean
  isMobileExpanded: boolean
  toggleCollapsed: () => void
  setCollapsed: (collapsed: boolean) => void
  toggleMobileExpanded: () => void
  setMobileExpanded: (expanded: boolean) => void
}

export const useRightSidebarStore = create<RightSidebarState>((set) => ({
  isCollapsed: false,
  isMobileExpanded: false,
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  toggleMobileExpanded: () => set((state) => ({ isMobileExpanded: !state.isMobileExpanded })),
  setMobileExpanded: (expanded) => set({ isMobileExpanded: expanded }),
}))
