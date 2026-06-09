// app/onboarding/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lora, Outfit } from 'next/font/google'
import { useOnboarding } from './_hooks/useOnboarding'
import { GoalInputStep } from './_components/GoalInputStep'
import { ProfileNameStep } from './_components/ProfileNameStep'
import { ProfileAvatarStep } from './_components/ProfileAvatarStep'
import { NotificationsStep } from './_components/NotificationsStep'
import { GeneratingStep } from './_components/GeneratingStep'
import { EditStep } from './_components/EditStep'
import { CommitmentStep } from './_components/CommitmentStep'
import { RhythmeLogo } from '@/components/rhythme-logo'

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
  const {
    currentStep,
    isGenerating,
    generatedPlan,
    generationError,
    generationStartTime,
    goToStep,
    generate,
    logout,
  } = onboarding

  const [generatingScreenEntryTime, setGeneratingScreenEntryTime] = useState<number | null>(null)

  // Track when we enter the 'generating' step
  useEffect(() => {
    if (currentStep === 'generating') {
      setGeneratingScreenEntryTime(Date.now())
    } else {
      setGeneratingScreenEntryTime(null)
    }
  }, [currentStep])

  // Handle generation to edit step transition with 2s minimum timer from generating screen entry
  useEffect(() => {
    if (currentStep !== 'generating' || !generatingScreenEntryTime) return

    if (!isGenerating && generatedPlan && !generationError) {
      const elapsed = Date.now() - generatingScreenEntryTime
      const remainingTime = Math.max(0, 2000 - elapsed)

      const timer = setTimeout(() => {
        goToStep('edit')
      }, remainingTime)

      return () => clearTimeout(timer)
    }
  }, [currentStep, isGenerating, generatedPlan, generationError, generatingScreenEntryTime, goToStep])

  // Loading auth check
  if (onboarding.isAuthLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  const stepsList: string[] = ['goal', 'profile-name', 'profile-avatar', 'notifications']
  const currentStepIndex = stepsList.indexOf(currentStep)
  const showProgress = currentStepIndex !== -1

  return (
    <div
      className={`${lora.variable} ${outfit.variable} min-h-[100dvh] bg-background text-foreground font-sans-display relative overflow-hidden flex flex-col justify-start py-6 max-sm:pb-28`}
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

      {/* Top Header Bar */}
      <header className={`w-full mx-auto px-6 flex items-center justify-between z-50 mb-6 transition-all duration-300 ${
        currentStep === 'edit' ? 'max-w-5xl' : 'max-w-[480px]'
      }`}>
        <RhythmeLogo size="sm" showText={true} />
        <button
          onClick={() => logout()}
          className="text-xs font-semibold tracking-wider text-muted-foreground hover:text-primary transition-colors uppercase py-1.5 px-3 hover:bg-muted/10 rounded-md border border-border/30 backdrop-blur-sm"
        >
          Log Out
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center w-full">
        {/* Step Indicator */}
        {showProgress && (
          <div className="w-full max-w-[480px] mx-auto px-6 mb-8 select-none">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                Step {currentStepIndex + 1} of 4
              </span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                {currentStep === 'goal' && 'Goal'}
                {currentStep === 'profile-name' && 'Name'}
                {currentStep === 'profile-avatar' && 'Avatar'}
                {currentStep === 'notifications' && 'Notifications'}
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex gap-1">
              {stepsList.map((step, idx) => {
                const isActive = idx === currentStepIndex
                const isCompleted = idx < currentStepIndex
                return (
                  <div
                    key={step}
                    className={`h-full flex-1 rounded-full transition-all duration-500 ${
                      isCompleted
                        ? 'bg-primary'
                        : isActive
                        ? 'bg-primary'
                        : 'bg-muted-foreground/20'
                    }`}
                  />
                )
              })}
            </div>
          </div>
        )}

        <div className={`w-full mx-auto px-6 relative z-10 flex-1 flex flex-col justify-center transition-all duration-300 ${
          currentStep === 'edit' ? 'max-w-5xl' : 'max-w-[480px]'
        }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            className="w-full"
          >
            {/* Step 1 — Goal Input */}
            {currentStep === 'goal' && (
              <GoalInputStep
                goalTitle={onboarding.goalTitle}
                goalDescription={onboarding.goalDescription}
                onGoalTitleChange={onboarding.setGoalTitle}
                onGoalDescriptionChange={onboarding.setGoalDescription}
                onContinue={() => {
                  goToStep('profile-name')
                  generate()
                }}
              />
            )}

            {/* Step 2 — Profile Name */}
            {currentStep === 'profile-name' && (
              <ProfileNameStep
                displayName={onboarding.displayName}
                onDisplayNameChange={onboarding.setDisplayName}
                onContinue={() => goToStep('profile-avatar')}
                onBack={() => goToStep('goal')}
              />
            )}

            {/* Step 3 — Profile Avatar */}
            {currentStep === 'profile-avatar' && (
              <ProfileAvatarStep
                displayName={onboarding.displayName}
                avatarId={onboarding.avatarId}
                socialAvatarUrl={onboarding.socialAvatarUrl}
                onAvatarIdChange={onboarding.setAvatarId}
                onContinue={() => goToStep('notifications')}
                onBack={() => goToStep('profile-name')}
              />
            )}

            {/* Step 4 — Notifications */}
            {currentStep === 'notifications' && (
              <NotificationsStep
                notificationsEnabled={onboarding.notificationsEnabled}
                onNotificationsEnabledChange={onboarding.setNotificationsEnabled}
                onContinue={() => goToStep('generating')}
                onBack={() => goToStep('profile-avatar')}
              />
            )}

            {/* Step 5 — Generation Loading */}
            {currentStep === 'generating' && (
              <GeneratingStep
                isGenerating={isGenerating}
                error={generationError}
                onGenerate={generate}
              />
            )}

            {/* Step 6 — Edit Screen */}
            {currentStep === 'edit' && (
              <EditStep
                tasks={onboarding.tasks}
                habits={onboarding.habits}
                fallbackUsed={onboarding.generatedPlan?.fallback_used ?? false}
                regenerateCount={onboarding.regenerateCount}
                isRegenerating={isGenerating}
                regenerationError={generationError}
                onUpdateTask={onboarding.updateTask}
                onDeleteTask={onboarding.deleteTask}
                onAddTask={onboarding.addTask}
                onUpdateHabit={onboarding.updateHabit}
                onDeleteHabit={onboarding.deleteHabit}
                onAddHabit={onboarding.addHabit}
                onRegenerate={onboarding.regenerate}
                onContinue={() => goToStep('commitment')}
              />
            )}

            {/* Step 7 — Commitment Screen */}
            {currentStep === 'commitment' && (
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
    </div>
  )
}
