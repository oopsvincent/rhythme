// store/useDialogStore.ts
import { create } from "zustand"

type DialogState = {
  settingsOpen: boolean
  setSettingsOpen: (v: boolean) => void
}

export const useDialogStore = create<DialogState>((set) => ({
  settingsOpen: false,
  setSettingsOpen: (v) => set({ settingsOpen: v }),
}))
