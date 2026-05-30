// app/onboarding/_components/GoalInputStep.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
} from '../_types/onboarding'

interface GoalInputStepProps {
  goalTitle: string
  goalDescription: string
  onGoalTitleChange: (v: string) => void
  onGoalDescriptionChange: (v: string) => void
  onContinue: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function GoalInputStep({
  goalTitle,
  goalDescription,
  onGoalTitleChange,
  onGoalDescriptionChange,
  onContinue,
}: GoalInputStepProps) {
  const trimmedTitle = goalTitle.trim()
  const isValid = trimmedTitle.length >= TITLE_MIN_LENGTH
  const showCharCount = trimmedTitle.length >= TITLE_MAX_LENGTH - 20

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 py-4"
    >
      {/* Label and Headings */}
      <div className="space-y-4">
        <motion.span
          variants={itemVariants}
          className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary block"
        >
          Step 1 of 2
        </motion.span>
        <motion.h1
          variants={itemVariants}
          className="text-3xl font-normal tracking-tight text-foreground font-serif-display sm:text-4xl leading-tight"
        >
          What are you building toward?
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-base text-muted-foreground"
        >
          One goal. Everything in Rhythmé follows from it.
        </motion.p>
      </div>

      {/* Goal title input */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="relative space-y-2">
          <Input
            type="text"
            placeholder="e.g. Launch my first product in 90 days"
            value={goalTitle}
            onChange={(e) => {
              if (e.target.value.length <= TITLE_MAX_LENGTH) {
                onGoalTitleChange(e.target.value)
              }
            }}
            className="h-14 rounded-lg border-border bg-card text-lg text-foreground shadow-sm transition-all focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary placeholder-muted-foreground/50"
            autoFocus
          />
          {showCharCount && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs tabular-nums text-muted-foreground">
              {trimmedTitle.length}/{TITLE_MAX_LENGTH}
            </span>
          )}
        </div>

        {/* Optional description textarea */}
        <div className="space-y-2">
          <label className="text-xs font-medium tracking-wide text-muted-foreground block">
            Add context (optional)
          </label>
          <Textarea
            placeholder="What details, metrics, or bounds help define this?"
            value={goalDescription}
            onChange={(e) => {
              if (e.target.value.length <= DESCRIPTION_MAX_LENGTH) {
                onGoalDescriptionChange(e.target.value)
              }
            }}
            rows={2}
            className="resize-none rounded-lg border-border bg-card text-foreground shadow-sm transition-all focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary placeholder-muted-foreground/50"
          />
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div variants={itemVariants}>
        <Button
          onClick={onContinue}
          disabled={!isValid}
          className="h-14 w-full rounded-lg text-base font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary/95 focus-visible:ring-offset-0 focus-visible:ring-primary disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50"
          size="lg"
        >
          Let's Build This
        </Button>
      </motion.div>
    </motion.div>
  )
}
