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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 text-center py-6"
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
        <motion.div variants={buttonVariants} className="pt-4">
          <Button
            onClick={handleClick}
            disabled={isSaving}
            className="h-14 rounded-lg px-12 text-base font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary/95 focus-visible:ring-offset-0 focus-visible:ring-primary flex items-center justify-center gap-2 mx-auto"
            size="lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary-foreground" />
                Saving...
              </>
            ) : (
              <>
                Start Building
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
