// app/onboarding/page.tsx
'use client'

import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lora, Outfit } from 'next/font/google'
import { useOnboarding } from './_hooks/useOnboarding'
import { GoalInputStep } from './_components/GoalInputStep'
import { ProfileStep } from './_components/ProfileStep'
import { GeneratingStep } from './_components/GeneratingStep'
import { EditStep } from './_components/EditStep'
import { CommitmentStep } from './_components/CommitmentStep'

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
})

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

export default function OnboardingPage() {
  const onboarding = useOnboarding()

  // Loading auth check
  if (onboarding.isAuthLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div
      className={`${lora.variable} ${outfit.variable} min-h-[100dvh] bg-background text-foreground font-sans-display relative overflow-hidden flex flex-col justify-center py-10`}
      style={{
        fontFamily: 'var(--font-outfit), sans-serif',
      }}
    >
      {/* Scope specific font-serif-display and font-sans-display helper classes */}
      <style dangerouslySetInnerHTML={{ __html: `
        .font-serif-display {
          font-family: var(--font-lora), Georgia, serif;
        }
        .font-sans-display {
          font-family: var(--font-outfit), sans-serif;
        }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E");
        }
      ` }} />

      {/* Grain noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay noise-overlay z-50" />

      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[480px] mx-auto px-6 relative z-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={onboarding.currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            className="w-full"
          >
            {/* Step 2 — Goal Input */}
            {onboarding.currentStep === 'goal' && (
              <GoalInputStep
                goalTitle={onboarding.goalTitle}
                goalDescription={onboarding.goalDescription}
                onGoalTitleChange={onboarding.setGoalTitle}
                onGoalDescriptionChange={onboarding.setGoalDescription}
                onContinue={() => onboarding.goToStep('profile')}
              />
            )}

            {/* Step 3 — Quick Profile */}
            {onboarding.currentStep === 'profile' && (
              <ProfileStep
                displayName={onboarding.displayName}
                dailyTaskTarget={onboarding.dailyTaskTarget}
                dailyHabitTarget={onboarding.dailyHabitTarget}
                avatarId={onboarding.avatarId}
                socialAvatarUrl={onboarding.socialAvatarUrl}
                onDisplayNameChange={onboarding.setDisplayName}
                onAvatarIdChange={onboarding.setAvatarId}
                onDailyTaskTargetChange={onboarding.setDailyTaskTarget}
                onDailyHabitTargetChange={onboarding.setDailyHabitTarget}
                onContinue={() => onboarding.goToStep('generating')}
                onBack={() => onboarding.goToStep('goal')}
              />
            )}

            {/* Step 4 — Generation Loading */}
            {onboarding.currentStep === 'generating' && (
              <GeneratingStep
                isGenerating={onboarding.isGenerating}
                error={onboarding.generationError}
                onGenerate={onboarding.generate}
              />
            )}

            {/* Step 5 — Edit Screen */}
            {onboarding.currentStep === 'edit' && (
              <EditStep
                tasks={onboarding.tasks}
                habits={onboarding.habits}
                fallbackUsed={onboarding.generatedPlan?.fallback_used ?? false}
                regenerateCount={onboarding.regenerateCount}
                isRegenerating={onboarding.isGenerating}
                regenerationError={onboarding.generationError}
                onUpdateTask={onboarding.updateTask}
                onDeleteTask={onboarding.deleteTask}
                onAddTask={onboarding.addTask}
                onUpdateHabit={onboarding.updateHabit}
                onDeleteHabit={onboarding.deleteHabit}
                onAddHabit={onboarding.addHabit}
                onRegenerate={onboarding.regenerate}
                onContinue={() => onboarding.goToStep('commitment')}
              />
            )}

            {/* Step 6 — Commitment Screen */}
            {onboarding.currentStep === 'commitment' && (
              <CommitmentStep
                goalTitle={onboarding.goalTitle}
                isSaving={onboarding.isSaving}
                saveError={onboarding.saveError}
                onCommit={onboarding.save}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
