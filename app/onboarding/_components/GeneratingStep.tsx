// app/onboarding/_components/GeneratingStep.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface GeneratingStepProps {
  isGenerating: boolean
  error: string | null
  onGenerate: () => void
}

export function GeneratingStep({
  isGenerating,
  error,
  onGenerate,
}: GeneratingStepProps) {
  const hasFired = useRef(false)

  // Fire generation request on mount - once only
  useEffect(() => {
    if (!hasFired.current) {
      hasFired.current = true
      onGenerate()
    }
  }, [onGenerate])

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
        {isGenerating && (
          <div className="relative flex h-36 w-36 items-center justify-center mb-4 select-none">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-primary pulse-ring-2" />
            {/* Inner ring */}
            <div className="absolute inset-4 rounded-full border-2 border-primary pulse-ring-1" />
            {/* Center anchor dot */}
            <div className="h-2.5 w-2.5 rounded-full bg-primary opacity-80" />
          </div>
        )}

        {/* Copy */}
        {isGenerating && (
          <div className="space-y-4">
            <h1 className="text-2xl font-normal tracking-tight text-foreground font-serif-display sm:text-3xl leading-tight">
              Building your execution plan
            </h1>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Analyzing your goal and structuring your first tasks and habits.
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !isGenerating && (
          <div className="space-y-8 w-full">
            <div className="space-y-4">
              <h1 className="text-2xl font-normal tracking-tight text-foreground font-serif-display sm:text-3xl leading-tight">
                Something went wrong
              </h1>
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-[#ef4444] max-w-sm mx-auto">
                {error}
              </div>
            </div>
            <Button
              onClick={() => {
                hasFired.current = false
                onGenerate()
              }}
              className="h-12 rounded-lg px-8 text-sm font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
