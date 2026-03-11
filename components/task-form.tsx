// app/components/task-form.tsx
'use client'

import { useState, useTransition } from 'react'
import { createTask } from '@/app/actions/getTasks'
import { canCreateTask } from '@/app/actions/usage-limits'
import type { CreateTaskInput, Priority, Status } from '@/types/database'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Plus, Loader2 } from 'lucide-react'
import { DateNTimePicker } from './date-n-time-picker'
import { Kbd } from './ui/kbd'
import { PremiumGateModal } from './premium-gate-modal'

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-blue-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'high', label: 'High', color: 'text-red-600' },
]

const statusOptions: { value: Status; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

export default function TaskForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showPremiumGate, setShowPremiumGate] = useState(false)

  const [formData, setFormData] = useState<CreateTaskInput>({
    title: '',
    description: '',
    due_date: undefined,
    priority: 'medium',
    status: 'pending'
  })

  const handleDateNTime = (date: Date | undefined) => {
    setFormData({...formData , due_date: date})
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      due_date: undefined,
      priority: 'medium',
      status: 'pending'
    })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    startTransition(async () => {
      // Check usage limit
      const { allowed } = await canCreateTask()
      if (!allowed) {
        setShowPremiumGate(true)
        return
      }

      const result = await createTask(formData)
      
      if (result?.error) {
        setError(result.error)
      } else {
        resetForm()
        setShowForm(false)
      }
    })
  }

  const handleOpenChange = (open: boolean) => {
    setShowForm(open)
    if (!open) {
      resetForm()
    }
  }

  return (
    <>
    <PremiumGateModal
      open={showPremiumGate}
      onOpenChange={setShowPremiumGate}
      reason="task"
    />
    <Dialog open={showForm} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Task</DialogTitle>
          </DialogHeader>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full"
                placeholder="What needs to be done?"
                disabled={isPending}
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full min-h-[100px] resize-none"
                placeholder="Add more details about this task..."
                disabled={isPending}
              />
            </div>

            {/* Priority & Status Row - Stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className={option.color}>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Status) => setFormData({ ...formData, status: value })}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date - Full width */}
            <div className="space-y-2">
              <Label htmlFor="due_date" className="text-sm font-medium">
                Due Date
              </Label>
              <DateNTimePicker value={formData.due_date} onChange={handleDateNTime} />
            </div>
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
                  'Create Task'
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
