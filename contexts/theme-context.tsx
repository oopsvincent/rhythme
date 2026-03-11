"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Encrypted theme codes: RTX-(first letter)(last letter)-last3_of_primary-first3_of_accent
// Flame: #FF6B35 -> #00D9FF = RTX-FE-B35-00D
// Sunset: #E63946 -> #F7B32B = RTX-ST-946-F7B
// Ocean: #0077B6 -> #90E0EF = RTX-ON-7B6-90E
// Lavender: #9D4EDD -> #E0AAFF = RTX-LR-EDD-E0A
// Colorless: #6B7280 -> #9CA3AF = RTX-CS-280-9CA
// Colorful: #EC4899 -> #8B5CF6 = RTX-CL-899-8B5
// Forest: #059669 -> #34D399 = RTX-FT-669-34D
// Midnight: #3730A3 -> #6366F1 = RTX-MT-0A3-636

export type ColorTheme = 
  | "RTX-FE-B35-00D"  // Flame (default)
  | "RTX-ST-946-F7B"  // Sunset
  | "RTX-ON-7B6-90E"  // Ocean
  | "RTX-LR-EDD-E0A"  // Lavender
  | "RTX-CS-280-9CA"  // Colorless
  | "RTX-CL-899-8B5"  // Colorful
  | "RTX-FT-669-34D"  // Forest
  | "RTX-MT-0A3-636"  // Midnight

interface ColorThemeContextType {
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined)

// Encrypted storage key
const STORAGE_KEY = "rtx-plte-cfg-v1"

const validThemes: ColorTheme[] = [
  "RTX-FE-B35-00D",
  "RTX-ST-946-F7B",
  "RTX-ON-7B6-90E",
  "RTX-LR-EDD-E0A",
  "RTX-CS-280-9CA",
  "RTX-CL-899-8B5",
  "RTX-FT-669-34D",
  "RTX-MT-0A3-636",
]

const DEFAULT_THEME: ColorTheme = "RTX-FE-B35-00D"

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(DEFAULT_THEME)
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorTheme | null
    if (stored && validThemes.includes(stored)) {
      setColorThemeState(stored)
    }
    setMounted(true)
  }, [])

  // Apply theme to document and save to localStorage
  useEffect(() => {
    if (!mounted) return
    
    document.documentElement.setAttribute("data-color-theme", colorTheme)
    localStorage.setItem(STORAGE_KEY, colorTheme)
  }, [colorTheme, mounted])

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme)
  }

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <div style={{ visibility: "hidden" }}>
        {children}
      </div>
    )
  }

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  )
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext)
  if (context === undefined) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider")
  }
  return context
}

// Theme metadata for UI display
export const colorThemes: {
  id: ColorTheme
  name: string
  description: string
  primary: string
  accent: string
  gradient: string
  premium: boolean
}[] = [
  {
    id: "RTX-FE-B35-00D",
    name: "Flame",
    description: "Bold & energetic",
    primary: "#FF6B35",
    accent: "#00D9FF",
    gradient: "linear-gradient(135deg, #FF6B35 0%, #00D9FF 100%)",
    premium: false,
  },
  {
    id: "RTX-ST-946-F7B",
    name: "Sunset",
    description: "Warm & vibrant",
    primary: "#E63946",
    accent: "#F7B32B",
    gradient: "linear-gradient(135deg, #E63946 0%, #F7B32B 100%)",
    premium: true,
  },
  {
    id: "RTX-ON-7B6-90E",
    name: "Ocean",
    description: "Calm & focused",
    primary: "#0077B6",
    accent: "#90E0EF",
    gradient: "linear-gradient(135deg, #0077B6 0%, #90E0EF 100%)",
    premium: true,
  },
  {
    id: "RTX-LR-EDD-E0A",
    name: "Lavender",
    description: "Creative & relaxing",
    primary: "#9D4EDD",
    accent: "#E0AAFF",
    gradient: "linear-gradient(135deg, #9D4EDD 0%, #E0AAFF 100%)",
    premium: true,
  },
  {
    id: "RTX-CS-280-9CA",
    name: "Colorless",
    description: "Minimal & monochrome",
    primary: "#6B7280",
    accent: "#9CA3AF",
    gradient: "linear-gradient(135deg, #374151 0%, #9CA3AF 100%)",
    premium: false,
  },
  {
    id: "RTX-CL-899-8B5",
    name: "Colorful",
    description: "Joyful & creative",
    primary: "#EC4899",
    accent: "#8B5CF6",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #EC4899 50%, #8B5CF6 100%)",
    premium: true,
  },
  {
    id: "RTX-FT-669-34D",
    name: "Forest",
    description: "Natural & grounded",
    primary: "#059669",
    accent: "#34D399",
    gradient: "linear-gradient(135deg, #059669 0%, #34D399 100%)",
    premium: true,
  },
  {
    id: "RTX-MT-0A3-636",
    name: "Midnight",
    description: "Deep & mysterious",
    primary: "#3730A3",
    accent: "#6366F1",
    gradient: "linear-gradient(135deg, #1E1B4B 0%, #6366F1 100%)",
    premium: true,
  },
]
