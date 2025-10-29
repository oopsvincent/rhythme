"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Badge } from "../components/ui/badge"
import { Checkbox } from "../components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Plus, Calendar, Flag, MoreVertical, Trash2, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Progress } from "../components/ui/progress"
import { motion } from "framer-motion"
import type { VariantProps } from "class-variance-authority"
import { badgeVariants } from "@/components/ui/badge" // adjust path if needed

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  category: string
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Write and submit the Q4 project proposal',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-10-15',
    category: 'Work'
  },
  {
    id: '2',
    title: 'Review design mockups',
    description: 'Review and provide feedback on the new dashboard designs',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-10-12',
    category: 'Design'
  },
  {
    id: '3',
    title: 'Team meeting preparation',
    description: 'Prepare slides for the weekly team sync',
    status: 'done',
    priority: 'medium',
    dueDate: '2025-10-10',
    category: 'Work'
  },
  {
    id: '4',
    title: 'Update documentation',
    description: 'Update API documentation with new endpoints',
    status: 'todo',
    priority: 'low',
    dueDate: '2025-10-18',
    category: 'Development'
  },
  {
    id: '5',
    title: 'Client presentation',
    description: 'Present product demo to potential client',
    status: 'todo',
    priority: 'high',
    dueDate: '2025-10-14',
    category: 'Sales'
  },
]

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    category: ''
  })

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (task.status === 'todo') return { ...task, status: 'in-progress' as const }
        if (task.status === 'in-progress') return { ...task, status: 'done' as const }
        return { ...task, status: 'todo' as const }
      }
      return task
    }))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const addTask = () => {
    if (!newTask.title) return
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || '',
      status: newTask.status as 'todo' | 'in-progress' | 'done' || 'todo',
      priority: newTask.priority as 'low' | 'medium' | 'high' || 'medium',
      dueDate: newTask.dueDate || '',
      category: newTask.category || 'General'
    }
    
    setTasks([...tasks, task])
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      category: ''
    })
    setIsAddDialogOpen(false)
  }

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

const getPriorityColor = (priority: string): BadgeVariant => {
  switch (priority) {
    case "high":
      return "destructive"
    case "medium":
      return "default"
    case "low":
      return "secondary"
    default:
      return "default"
  }
}

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'todo': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const todoTasks = tasks.filter(t => t.status === 'todo')
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress')
  const doneTasks = tasks.filter(t => t.status === 'done')

  const totalTasks = tasks.length
  const completedTasks = doneTasks.length
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl">Tasks</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage and organize your tasks efficiently</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task to your list</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value as Task['priority'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    placeholder="e.g., Work, Personal"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <button 
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors"
                onClick={addTask}
              >
                Add Task
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">Total Tasks</CardDescription>
            <CardTitle className="text-2xl md:text-3xl">{totalTasks}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">To Do</CardDescription>
            <CardTitle className="text-2xl md:text-3xl">{todoTasks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">In Progress</CardDescription>
            <CardTitle className="text-2xl md:text-3xl">{inProgressTasks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">Completed</CardDescription>
            <CardTitle className="text-2xl md:text-3xl">{completedTasks}</CardTitle>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>{completionPercentage.toFixed(0)}% of tasks completed</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Tasks Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="all" className="text-xs md:text-sm">
            <span className="hidden sm:inline">All Tasks</span>
            <span className="sm:hidden">All</span> ({totalTasks})
          </TabsTrigger>
          <TabsTrigger value="todo" className="text-xs md:text-sm">
            <span className="hidden sm:inline">To Do</span>
            <span className="sm:hidden">Todo</span> ({todoTasks.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="text-xs md:text-sm">
            <span className="hidden sm:inline">In Progress</span>
            <span className="sm:hidden">Active</span> ({inProgressTasks.length})
          </TabsTrigger>
          <TabsTrigger value="done" className="text-xs md:text-sm">
            Done ({doneTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTaskStatus}
              onDelete={deleteTask}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
            />
          ))}
        </TabsContent>

        <TabsContent value="todo" className="space-y-4">
          {todoTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTaskStatus}
              onDelete={deleteTask}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
            />
          ))}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTaskStatus}
              onDelete={deleteTask}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
            />
          ))}
        </TabsContent>

        <TabsContent value="done" className="space-y-4">
          {doneTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTaskStatus}
              onDelete={deleteTask}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TaskCard({
  task,
  onToggle,
  onDelete,
  getPriorityColor,
  getStatusColor
}: {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={task.status === 'done'}
            onCheckedChange={() => onToggle(task.id)}
            className="mt-1"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className={task.status === 'done' ? 'line-through text-muted-foreground' : ''}>
                  {task.title}
                </h3>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getPriorityColor(task.priority)}>
                <Flag className="mr-1 h-3 w-3" />
                {task.priority}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
              {task.category && (
                <Badge variant="outline">{task.category}</Badge>
              )}
              {task.dueDate && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
