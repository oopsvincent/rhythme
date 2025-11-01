// app/components/task-form.tsx
'use client'

import { useState, useTransition } from 'react'
import { createTask } from '@/app/actions/getTasks'
import type { CreateTaskInput, Priority } from '@/types/database'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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

export default function TaskForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState<CreateTaskInput>({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    startTransition(async () => {
      const result = await createTask(formData)
      
      if (result.error) {
        setError(result.error)
      } else {
        // Success - reset form
        setFormData({
          title: '',
          description: '',
          due_date: '',
          priority: 'medium'
        })
        setShowForm(false)
      }
    })
  }

  if (!showForm) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-6"
      >
        + New Task
      </Button>
    )
  }

  return (
    <Dialog>
              <DialogTrigger asChild >
      <Button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-6"
      >
        + New Task
      </Button>
        </DialogTrigger>
        <DialogContent>

    <form onSubmit={handleSubmit} className="">
        <DialogHeader>
      <DialogTitle className="text-xl font-semibold mb-4">Create New Task</DialogTitle>
        </DialogHeader>

      {error && (
        <div className="text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="block text-sm font-medium mb-1">
            Title *
          </Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task title"
            disabled={isPending}
          />
        </div>

        <div>
          <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task description"
            rows={3}
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isPending}
            />
            <Label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
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
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary px-6 py-2 rounded-lg hover:bg-accent disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPending ? 'Creating...' : 'Create Task'}
        </Button>
        <Button
          type="button"
          onClick={() => setShowForm(false)}
          disabled={isPending}
          className="bg-transparent border-2 text-gray-700 px-6 py-2 rounded-lg hover:bg-transparent disabled:bg-gray-100"
        >
          Cancel
        </Button>
      </div>
    </form>
        </DialogContent>

            
    </Dialog>
  )
}