// app/onboarding/_components/ProfileNameStep.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, ArrowLeft } from 'lucide-react'

interface ProfileNameStepProps {
  displayName: string
  onDisplayNameChange: (v: string) => void
  onContinue: () => void
  onBack: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

export function ProfileNameStep({
  displayName,
  onDisplayNameChange,
  onContinue,
  onBack,
}: ProfileNameStepProps) {
  const isValid = displayName.trim().length > 0

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 py-4"
    >
      <div className="space-y-2">
        <motion.h1
          variants={itemVariants}
          className="text-3xl font-normal tracking-tight text-foreground font-serif-display leading-tight"
        >
          What should we call you?
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-sm text-muted-foreground"
        >
          Your display name in Rhythmé.
        </motion.p>
      </div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="displayName" className="text-xs font-medium tracking-wide text-muted-foreground">
          Display Name
        </Label>
        <Input
          id="displayName"
          type="text"
          placeholder="e.g. Alex"
          value={displayName}
          onChange={(e) => onDisplayNameChange(e.target.value)}
          className="h-14 rounded-lg border-border bg-card text-lg text-foreground placeholder-muted-foreground/50 transition-all focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
          autoFocus
        />
      </motion.div>

      {/* CTA (Sticky on mobile, relative on PC) */}
      <motion.div variants={itemVariants} className="space-y-4 pt-2 max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:bg-background/85 max-sm:backdrop-blur-md max-sm:p-4 max-sm:border-t max-sm:border-border/50 max-sm:z-50">
        <Button
          onClick={onContinue}
          disabled={!isValid}
          className="h-14 w-full rounded-lg text-base font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary/95 focus-visible:ring-offset-0 focus-visible:ring-primary disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50 flex items-center justify-center gap-2"
          size="lg"
        >
          Continue
          <ArrowRight className="h-5 w-5" />
        </Button>
        
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 w-full text-center text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-primary uppercase py-2 max-sm:hidden"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      </motion.div>
      
      {/* Back button for mobile */}
      <motion.div variants={itemVariants} className="sm:hidden flex justify-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-primary uppercase py-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      </motion.div>
    </motion.div>
  )
}
