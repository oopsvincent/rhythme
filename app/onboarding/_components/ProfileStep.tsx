// app/onboarding/_components/ProfileStep.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import {
  AVATAR_CATEGORIES,
  getAvatarDataUri,
  getAvatarsByCategory,
  resolveAvatarUrl,
  SOCIAL_AVATAR_ID,
  INITIALS_AVATAR_ID,
  generateInitialsDataUri,
} from '@/lib/avatars'
import { PersonalAvatarSection } from '@/components/avatar-picker'

interface ProfileStepProps {
  displayName: string
  dailyTaskTarget: number
  dailyHabitTarget: number
  avatarId: string
  socialAvatarUrl?: string | null
  onDisplayNameChange: (v: string) => void
  onAvatarIdChange: (id: string) => void
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
  displayName,
  dailyTaskTarget,
  dailyHabitTarget,
  avatarId,
  socialAvatarUrl,
  onDisplayNameChange,
  onAvatarIdChange,
  onDailyTaskTargetChange,
  onDailyHabitTargetChange,
  onContinue,
  onBack,
}: ProfileStepProps) {
  const isValid = displayName.trim().length > 0

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
        {/* Avatar section */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Selected avatar preview */}
          <div className="flex justify-center">
            <div className="relative h-20 w-20 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background overflow-hidden">
              <img
                src={resolveAvatarUrl(avatarId, { socialAvatarUrl, userName: displayName })}
                alt="Selected avatar"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Avatar picker */}
          <div className="space-y-3">
            <Label className="text-xs font-medium tracking-wide text-muted-foreground">
              Choose your avatar
            </Label>

            {/* Personal options */}
            <div className="space-y-2">
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
                Personal
              </span>
              <PersonalAvatarSection
                selectedId={avatarId}
                onSelect={onAvatarIdChange}
                socialAvatarUrl={socialAvatarUrl}
                userName={displayName}
              />
            </div>

            {AVATAR_CATEGORIES.map((category) => {
              const avatars = getAvatarsByCategory(category.id)
              return (
                <div key={category.id} className="space-y-2">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
                    {category.label}
                  </span>
                  <div className="grid grid-cols-4 gap-3">
                    {avatars.map((avatar) => {
                      const isSelected = avatar.id === avatarId
                      return (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => onAvatarIdChange(avatar.id)}
                          className={`relative h-12 w-12 rounded-full transition-all duration-200 ${
                            isSelected
                              ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                              : 'ring-2 ring-transparent hover:ring-muted-foreground/30'
                          }`}
                          title={avatar.label}
                        >
                          <img
                            src={getAvatarDataUri(avatar.id)}
                            alt={avatar.label}
                            className="h-full w-full rounded-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/25">
                              <Check className="h-4 w-4 text-white drop-shadow-md" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Display name */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="displayName" className="text-xs font-medium tracking-wide text-muted-foreground">
            What should we call you?
          </Label>
          <Input
            id="displayName"
            type="text"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
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
