// components/habit-form.tsx
'use client'

import { useState, useTransition } from 'react'
import { createHabit } from '@/app/actions/habits'
import { canCreateHabit } from '@/app/actions/usage-limits'
import type { CreateHabitInput, HabitFrequency } from '@/types/database'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from './ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Plus, Minus, Loader2 } from 'lucide-react'
import { Kbd } from './ui/kbd'
import { PremiumGateModal } from './premium-gate-modal'
import { useRouter } from 'next/navigation'

const frequencyOptions: { value: string; label: string }[] = [
  { value: '0', label: 'Daily' },
  { value: '1', label: 'Weekly' },
  { value: '2', label: 'Monthly' },
  { value: '3', label: 'Multiple times per week' },
]

export default function HabitForm({ children }: { children?: React.ReactNode }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showPremiumGate, setShowPremiumGate] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState<CreateHabitInput>({
    name: '',
    description: '',
    frequency: 0,
    target_count: 1,
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      frequency: 0,
      target_count: 1,
    })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError('Habit name is required')
      return
    }

    startTransition(async () => {
      // Check usage limit
      const { allowed } = await canCreateHabit()
      if (!allowed) {
        setShowPremiumGate(true)
        return
      }

      const result = await createHabit(formData)
      
      if (result?.error) {
        setError(result.error)
      } else {
        resetForm()
        setShowForm(false)
        router.refresh()
      }
    })
  }

  const handleOpenChange = (open: boolean) => {
    setShowForm(open)
    if (!open) {
      resetForm()
      setShowAdvanced(false)
    }
  }

  return (
    <>
    <PremiumGateModal
      open={showPremiumGate}
      onOpenChange={setShowPremiumGate}
      reason="habit"
    />
    <Dialog open={showForm} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" />
            Add Habit
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Habit</DialogTitle>
            <DialogDescription className="sr-only">
              Add a new habit to track
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mt-4 space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="habit-name" className="sr-only">
                Habit Name <span className="text-red-500">*</span>
              </Label>
                <Input
                  id="habit-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-lg shadow-none font-medium h-12"
                  placeholder="What habit do you want to build?"
                  disabled={isPending}
                  autoFocus
                />
              </div>

            {showAdvanced ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="habit-description" className="text-sm font-medium text-muted-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="habit-description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full min-h-[80px] resize-none"
                    placeholder="Why is this habit important to you?"
                    disabled={isPending}
                  />
                </div>

                {/* Frequency & Target */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="habit-frequency" className="text-sm font-medium text-muted-foreground">
                      Frequency
                    </Label>
                    <Select
                      value={String(formData.frequency ?? 0)}
                      onValueChange={(value) => setFormData({ ...formData, frequency: parseInt(value) as HabitFrequency })}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="habit-target" className="text-sm font-medium text-muted-foreground">
                      Target Count
                    </Label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, target_count: Math.max(1, (formData.target_count ?? 1) - 1) })}
                        disabled={isPending || (formData.target_count ?? 1) <= 1}
                        className="shrink-0 h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <Input
                        id="habit-target"
                        type="number"
                        min={1}
                        max={20}
                        value={formData.target_count ?? 1}
                        onChange={(e) => setFormData({ ...formData, target_count: parseInt(e.target.value) || 1 })}
                        disabled={isPending}
                        className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, target_count: Math.min(20, (formData.target_count ?? 1) + 1) })}
                        disabled={isPending || (formData.target_count ?? 1) >= 20}
                        className="shrink-0 h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAdvanced(true)}
                className="text-xs text-muted-foreground hover:text-foreground h-8 px-2 -ml-2"
              >
                + Advanced Options
              </Button>
            )}
          </div>

          <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
            <div className="hidden sm:flex items-center text-xs text-muted-foreground">
              <Kbd>Enter</Kbd>
              <span className="ml-1.5">to save</span>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Habit'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
