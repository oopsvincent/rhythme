export type FocusPresetId = 'classic' | 'extended'

export interface FocusPreset {
  id: FocusPresetId
  label: string
  focusMinutes: number
  breakMinutes: number
}

export interface FocusPreferences {
  presetId: FocusPresetId
  soundEnabled: boolean
}

export const FOCUS_PRESETS: Record<FocusPresetId, FocusPreset> = {
  classic: {
    id: 'classic',
    label: 'Classic',
    focusMinutes: 25,
    breakMinutes: 5,
  },
  extended: {
    id: 'extended',
    label: 'Extended',
    focusMinutes: 50,
    breakMinutes: 10,
  },
}

const STORAGE_KEY = 'rhythme-focus-preferences'

export const DEFAULT_FOCUS_PREFERENCES: FocusPreferences = {
  presetId: 'classic',
  soundEnabled: true,
}

export function getFocusPreferences(): FocusPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_FOCUS_PREFERENCES
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_FOCUS_PREFERENCES

    const parsed = JSON.parse(stored) as Partial<FocusPreferences>

    return {
      presetId:
        parsed.presetId && parsed.presetId in FOCUS_PRESETS
          ? parsed.presetId
          : DEFAULT_FOCUS_PREFERENCES.presetId,
      soundEnabled:
        typeof parsed.soundEnabled === 'boolean'
          ? parsed.soundEnabled
          : DEFAULT_FOCUS_PREFERENCES.soundEnabled,
    }
  } catch {
    return DEFAULT_FOCUS_PREFERENCES
  }
}

export function saveFocusPreferences(preferences: FocusPreferences) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
}

export function getFocusDurationSeconds(presetId: FocusPresetId) {
  return FOCUS_PRESETS[presetId].focusMinutes * 60
}

export function getBreakDurationSeconds(presetId: FocusPresetId) {
  return FOCUS_PRESETS[presetId].breakMinutes * 60
}

export function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(safeSeconds / 60)
  const remainingSeconds = safeSeconds % 60

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`
}

export function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, Math.round(seconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${minutes}m`
}
