// app/onboarding/_components/CommitmentStep.tsx
'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight } from 'lucide-react'

interface CommitmentStepProps {
  goalTitle: string
  isSaving: boolean
  saveError: string | null
  onCommit: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25, // Stagger elements elegantly for a premium feel
    },
  },
}

const titleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const lineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 0.5,
    transition: { duration: 0.4, ease: 'easeInOut' as const },
  },
}

const textVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const buttonVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function CommitmentStep({
  goalTitle,
  isSaving,
  saveError,
  onCommit,
}: CommitmentStepProps) {
  const hasAutoAdvanced = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-advance after 4 seconds
  useEffect(() => {
    if (hasAutoAdvanced.current || isSaving || saveError) return

    timerRef.current = setTimeout(() => {
      if (!hasAutoAdvanced.current) {
        hasAutoAdvanced.current = true
        onCommit()
      }
    }, 4000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [onCommit, isSaving, saveError])

  const handleClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!hasAutoAdvanced.current) {
      hasAutoAdvanced.current = true
      onCommit()
    }
  }
  if (isSaving) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulse-ring-1 {
            0%, 100% { transform: scale(1); opacity: 0.2; }
            50% { transform: scale(1.12); opacity: 0.55; }
          }
          @keyframes pulse-ring-2 {
            0%, 100% { transform: scale(0.9); opacity: 0.1; }
            50% { transform: scale(1.24); opacity: 0.35; }
          }
          .pulse-ring-1 {
            animation: pulse-ring-1 3.5s ease-in-out infinite;
          }
          .pulse-ring-2 {
            animation: pulse-ring-2 3.5s ease-in-out infinite;
            animation-delay: 0.6s;
          }
        ` }} />
        <div className="w-full max-w-md space-y-12 text-center flex flex-col items-center">
          {/* Breathing concentric rings */}
          <div className="relative flex h-36 w-36 items-center justify-center mb-4 select-none">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-primary pulse-ring-2" />
            {/* Inner ring */}
            <div className="absolute inset-4 rounded-full border-2 border-primary pulse-ring-1" />
            {/* Center anchor dot */}
            <div className="h-2.5 w-2.5 rounded-full bg-primary opacity-80" />
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-normal tracking-tight text-foreground font-serif-display sm:text-3xl leading-tight">
              Creating your workspace...
            </h1>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Setting up your primary goal, tasks, habits, and profile preferences.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 text-center py-6 pb-20 sm:pb-0"
    >
      {/* Monumental Goal Title display */}
      <motion.h1
        variants={titleVariants}
        className="text-4xl font-normal leading-tight tracking-tight text-foreground font-serif-display sm:text-5xl max-w-lg mx-auto"
      >
        {goalTitle}
      </motion.h1>

      {/* Typographic accent line ornament */}
      <motion.div
        variants={lineVariants}
        className="w-[60px] h-[1px] bg-primary mx-auto origin-center"
      />

      {/* Supporting Copy */}
      <motion.div variants={textVariants} className="space-y-3">
        <p className="text-lg font-medium text-foreground">
          Your workspace is ready.
        </p>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          The longer you log, the better Rhythmé understands how you work.
        </p>
      </motion.div>

      {/* Error state */}
      {saveError && (
        <motion.div variants={textVariants} className="space-y-4 max-w-sm mx-auto">
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-[#ef4444]">
            {saveError}
          </div>
          <Button
            onClick={() => {
              hasAutoAdvanced.current = false
              onCommit()
            }}
            className="h-12 rounded-lg px-8 text-sm font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            Try Again
          </Button>
        </motion.div>
      )}

      {/* CTA Button */}
      {!saveError && (
        <motion.div variants={buttonVariants} className="pt-4 max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:bg-background/85 max-sm:backdrop-blur-md max-sm:p-4 max-sm:border-t max-sm:border-border/50 max-sm:z-50">
          <Button
            onClick={handleClick}
            disabled={isSaving}
            className="relative overflow-hidden h-14 rounded-lg px-12 text-base font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary/95 focus-visible:ring-offset-0 focus-visible:ring-primary flex items-center justify-center gap-2 mx-auto w-full sm:w-auto"
            size="lg"
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, ease: 'linear' }}
              className="absolute inset-y-0 left-0 bg-white/20 pointer-events-none"
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Building
              <ArrowRight className="h-5 w-5" />
            </span>
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
