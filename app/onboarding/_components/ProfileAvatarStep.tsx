// app/onboarding/_components/ProfileAvatarStep.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import {
  AVATAR_CATEGORIES,
  getAvatarDataUri,
  getAvatarsByCategory,
  resolveAvatarUrl,
} from '@/lib/avatars'
import { PersonalAvatarSection } from '@/components/avatar-picker'

interface ProfileAvatarStepProps {
  displayName: string
  avatarId: string
  socialAvatarUrl?: string | null
  onAvatarIdChange: (id: string) => void
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

export function ProfileAvatarStep({
  displayName,
  avatarId,
  socialAvatarUrl,
  onAvatarIdChange,
  onContinue,
  onBack,
}: ProfileAvatarStepProps) {
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
          className="text-3xl font-normal tracking-tight text-foreground font-serif-display leading-tight text-center sm:text-left"
        >
          Choose your look
        </motion.h1>
      </div>

      <div className="space-y-6">
        {/* Selected avatar preview */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="relative h-24 w-24 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background overflow-hidden shadow-md">
            <img
              src={resolveAvatarUrl(avatarId, { socialAvatarUrl, userName: displayName })}
              alt="Selected avatar"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Avatar picker */}
        <motion.div variants={itemVariants} className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          {/* Personal options */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
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
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
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
                            ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-95'
                            : 'ring-2 ring-transparent hover:ring-muted-foreground/30 hover:scale-105'
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
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div variants={itemVariants} className="space-y-4 pt-2 max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:bg-background/85 max-sm:backdrop-blur-md max-sm:p-4 max-sm:border-t max-sm:border-border/50 max-sm:z-50">
        <Button
          onClick={onContinue}
          className="h-14 w-full rounded-lg text-base font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary/95 focus-visible:ring-offset-0 focus-visible:ring-primary flex items-center justify-center gap-2"
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
