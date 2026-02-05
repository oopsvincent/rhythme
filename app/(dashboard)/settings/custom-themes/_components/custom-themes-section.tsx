// app/(dashboard)/settings/custom-themes/_components/custom-themes-section.tsx
// Custom color themes with flat design

"use client"

import { Check, Crown, Lock } from "lucide-react"
import { useColorTheme, colorThemes, type ColorTheme } from "@/contexts/theme-context"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function CustomThemesSection() {
  const { colorTheme, setColorTheme } = useColorTheme()

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Choose a color palette that matches your vibe. Colors apply across the entire app.
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {colorThemes.map((t) => {
          const isSelected = colorTheme === t.id
          
          return (
            <motion.button
              key={t.id}
              onClick={() => setColorTheme(t.id as ColorTheme)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "relative flex flex-col rounded-xl overflow-hidden transition-all duration-300",
                "border",
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg border-primary"
                  : "border-border/50 hover:shadow-md hover:border-muted-foreground/30"
              )}
            >
              {/* Gradient Preview */}
              <div 
                className="h-20 relative overflow-hidden"
                style={{ background: t.gradient }}
              >
                {/* Selection indicator */}
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
                
                {/* Shine animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={isSelected ? { x: "100%" } : { x: "-100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </div>
              
              {/* Theme Info */}
              <div className="p-3 space-y-1 bg-card">
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
                <p className="text-xs text-muted-foreground text-left line-clamp-1">
                  {t.description}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
      
      {/* Premium notice */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <Crown className="h-4 w-4 text-primary mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Premium feature.</span> Custom themes are available to premium subscribers.
        </p>
      </div>
    </div>
  )
}
