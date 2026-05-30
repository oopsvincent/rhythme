// app/onboarding/_components/ProfileStep.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, ArrowLeft } from 'lucide-react'

interface ProfileStepProps {
  firstName: string
  dailyTaskTarget: number
  dailyHabitTarget: number
  onFirstNameChange: (v: string) => void
  onDailyTaskTargetChange: (v: number) => void
  onDailyHabitTargetChange: (v: number) => void
  onContinue: () => void
  onBack: () => void
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
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function ProfileStep({
  firstName,
  dailyTaskTarget,
  dailyHabitTarget,
  onFirstNameChange,
  onDailyTaskTargetChange,
  onDailyHabitTargetChange,
  onContinue,
  onBack,
}: ProfileStepProps) {
  const isValid = firstName.trim().length > 0

  const handleDecrementTasks = () => {
    onDailyTaskTargetChange(Math.max(1, dailyTaskTarget - 1))
  }
  const handleIncrementTasks = () => {
    onDailyTaskTargetChange(Math.min(10, dailyTaskTarget + 1))
  }

  const handleDecrementHabits = () => {
    onDailyHabitTargetChange(Math.max(1, dailyHabitTarget - 1))
  }
  const handleIncrementHabits = () => {
    onDailyHabitTargetChange(Math.min(6, dailyHabitTarget + 1))
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 py-4"
    >
      {/* Heading */}
      <div className="space-y-2">
        <motion.span
          variants={itemVariants}
          className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary block"
        >
          Step 2 of 2
        </motion.span>
        <motion.h1
          variants={itemVariants}
          className="text-2xl font-normal tracking-tight text-foreground font-serif-display leading-tight"
        >
          A few quick things
        </motion.h1>
      </div>

      {/* Fields */}
      <div className="space-y-6">
        {/* First name */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="firstName" className="text-xs font-medium tracking-wide text-muted-foreground">
            First name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Your first name"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            className="h-12 rounded-lg border-border bg-card text-base text-foreground placeholder-muted-foreground/50 transition-all focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
            autoFocus
          />
        </motion.div>

        {/* Daily task target */}
        <motion.div variants={itemVariants} className="space-y-3">
          <Label htmlFor="taskTarget" className="text-xs font-medium tracking-wide text-muted-foreground">
            Daily task target (tasks to aim for each day)
          </Label>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-border bg-card rounded-lg h-12 overflow-hidden w-36 justify-between select-none">
              <button
                type="button"
                onClick={handleDecrementTasks}
                className="h-full w-12 text-muted-foreground hover:text-foreground hover:bg-muted/80 active:bg-muted transition-colors font-light text-xl"
              >
                &minus;
              </button>
              <span className="text-foreground font-semibold text-base tabular-nums">
                {dailyTaskTarget}
              </span>
              <button
                type="button"
                onClick={handleIncrementTasks}
                className="h-full w-12 text-muted-foreground hover:text-foreground hover:bg-muted/80 active:bg-muted transition-colors font-light text-xl"
              >
                +
              </button>
            </div>
            <span className="text-sm text-muted-foreground">tasks per day</span>
          </div>
        </motion.div>

        {/* Daily habit target */}
        <motion.div variants={itemVariants} className="space-y-3">
          <Label htmlFor="habitTarget" className="text-xs font-medium tracking-wide text-muted-foreground">
            Daily habit target (habits to track daily)
          </Label>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-border bg-card rounded-lg h-12 overflow-hidden w-36 justify-between select-none">
              <button
                type="button"
                onClick={handleDecrementHabits}
                className="h-full w-12 text-muted-foreground hover:text-foreground hover:bg-muted/80 active:bg-muted transition-colors font-light text-xl"
              >
                &minus;
              </button>
              <span className="text-foreground font-semibold text-base tabular-nums">
                {dailyHabitTarget}
              </span>
              <button
                type="button"
                onClick={handleIncrementHabits}
                className="h-full w-12 text-muted-foreground hover:text-foreground hover:bg-muted/80 active:bg-muted transition-colors font-light text-xl"
              >
                +
              </button>
            </div>
            <span className="text-sm text-muted-foreground">habits per day</span>
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div variants={itemVariants} className="space-y-4 pt-2">
        <Button
          onClick={onContinue}
          disabled={!isValid}
          className="h-12 w-full rounded-lg text-base font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary/95 focus-visible:ring-offset-0 focus-visible:ring-primary disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50 flex items-center justify-center gap-2"
          size="lg"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
        
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 w-full text-center text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-primary uppercase py-2"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </button>
      </motion.div>
    </motion.div>
  )
}
