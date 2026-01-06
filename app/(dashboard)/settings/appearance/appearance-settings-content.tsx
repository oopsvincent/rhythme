// app/(dashboard)/settings/appearance/appearance-settings-content.tsx
"use client"

import { Separator } from "@/components/ui/separator"
import { Paintbrush, Monitor, Moon, Sun, Palette, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import { useColorTheme, colorThemes, type ColorTheme } from "@/contexts/theme-context"
import { motion, AnimatePresence } from "framer-motion"

export default function AppearanceSettingsContent() {
  const { theme, setTheme } = useTheme()
  const { colorTheme, setColorTheme } = useColorTheme()

  return (
    <div className="space-y-8">
      {/* Theme Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-primary" />
            Theme
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose how Rhythmé looks to you. Select a single theme, or sync with your system.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 max-w-md">
          <Card 
            className={`cursor-pointer transition-all hover:border-primary/50 ${
              theme === "light" ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            onClick={() => setTheme("light")}
          >
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg bg-[#FAFAFA] border border-border flex items-center justify-center">
                <Sun className="h-6 w-6 text-[#0A0A0B]" />
              </div>
              <span className="text-sm font-medium">Light</span>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:border-primary/50 ${
              theme === "dark" ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            onClick={() => setTheme("dark")}
          >
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg bg-[#050506] border border-border flex items-center justify-center">
                <Moon className="h-6 w-6 text-[#FAFAFA]" />
              </div>
              <span className="text-sm font-medium">Dark</span>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:border-primary/50 ${
              theme === "system" ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            onClick={() => setTheme("system")}
          >
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#FAFAFA] to-[#050506] border border-border flex items-center justify-center">
                <Monitor className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">System</span>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Color Theme Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Color Theme
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose a color palette that matches your vibe. Colors apply across the entire app.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {colorThemes.map((t) => {
            const isSelected = colorTheme === t.id
            
            return (
              <motion.div
                key={t.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Card 
                  className={`cursor-pointer overflow-hidden transition-all duration-300 ${
                    isSelected 
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg" 
                      : "hover:shadow-md hover:border-muted-foreground/30"
                  }`}
                  onClick={() => setColorTheme(t.id as ColorTheme)}
                >
                  <CardContent className="p-0">
                    {/* Gradient Preview */}
                    <div 
                      className="h-20 relative overflow-hidden"
                      style={{ background: t.gradient }}
                    >
                      {/* Animated glow effect on selection */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.1 }}
                              className="bg-white/90 dark:bg-black/80 rounded-full p-1.5 shadow-lg backdrop-blur-sm"
                            >
                              <Check className="h-4 w-4 text-primary" />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Subtle shine animation */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={isSelected ? { x: "100%" } : { x: "-100%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    </div>
                    
                    {/* Theme Info */}
                    <div className="p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{t.name}</span>
                        <div className="flex gap-1">
                          <div 
                            className="w-3 h-3 rounded-full border border-border/50 shadow-sm"
                            style={{ backgroundColor: t.primary }}
                          />
                          <div 
                            className="w-3 h-3 rounded-full border border-border/50 shadow-sm"
                            style={{ backgroundColor: t.accent }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
