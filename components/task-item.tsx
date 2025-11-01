// app/components/task-item.tsx
'use client'

import { useState, useTransition } from 'react'
import { updateTaskStatus, deleteTask } from '@/app/actions/getTasks'
import type { Task, Status } from '@/types/database'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
    const router = useRouter();

  const [isPending, startTransition] = useTransition()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleStatusChange = (newStatus: Status) => {
    startTransition(async () => {
      await updateTaskStatus(task.task_id, newStatus)
    })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      startTransition(async () => {
        await deleteTask(task.task_id)
      })
    }
  }

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800'
  }

  return (
    <div className="p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link className="text-lg font-semibold hover:underline cursor-pointer" href={`/dashboard/tasks/${task.task_id}`}>{task.title}</Link>
            {/* <h3 className="text-lg font-semibold hover:underline cursor-pointer" onClick={() => router.push(`/dashboard/tasks/${task.task_id}`)}>{task.title}</h3> */}
            <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>

          {task.due_date && (
            <p className="text-sm text-gray-600 mb-2">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </p>
          )}

          {isExpanded && task.description && (
            <p className="text-gray-700 mt-2">{task.description}</p>
          )}

          {task.description && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 hover:text-blue-800 mt-1"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Status change buttons */}
          {task.status !== 'todo' && (
            <button
              onClick={() => handleStatusChange('todo')}
              disabled={isPending}
              className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              To Do
            </button>
          )}
          {task.status !== 'in_progress' && (
            <button
              onClick={() => handleStatusChange('in_progress')}
              disabled={isPending}
              className="px-3 py-1 text-sm bg-purple-500 hover:bg-purple-300 rounded disabled:opacity-50"
            >
              In Progress
            </button>
          )}
          {task.status !== 'completed' && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={isPending}
              className="px-3 py-1 text-sm bg-green-500 hover:bg-green-300 rounded disabled:opacity-50"
            >
              Complete
            </button>
          )}
          
          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-300 rounded disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}