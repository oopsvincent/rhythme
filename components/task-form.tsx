// app/components/task-form.tsx
'use client'

import { useState, useTransition } from 'react'
import { createTask } from '@/app/actions/getTasks'
import type { CreateTaskInput, Priority } from '@/types/database'

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
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-6"
      >
        + New Task
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

      {error && (
        <div className="text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title *
          </label>
          <input
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
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
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isPending}
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isPending}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPending ? 'Creating...' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          disabled={isPending}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}