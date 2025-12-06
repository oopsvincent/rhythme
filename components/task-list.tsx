"use client"

import { Task, Status } from "@/types/database"
import TaskItem from "./task-item"
import { ListTodo, ChevronDown, Clock, CheckCircle2, AlertCircle, Calendar, Loader2, ListChecks } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react"
import { Button } from "./ui/button"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export type TaskListProps = {
    tasks?: Task[]
}

type GroupingMode = 'time' | 'status'

interface TaskSection {
    id: string
    title: string
    icon: React.ReactNode
    tasks: Task[]
    defaultOpen: boolean
}

// Time-based categorization (Today, Upcoming, Overdue, Completed)
function categorizeByTime(tasks: Task[]): TaskSection[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const overdue: Task[] = []
    const todayTasks: Task[] = []
    const upcoming: Task[] = []
    const completed: Task[] = []
    const noDueDate: Task[] = []
    
    tasks.forEach(task => {
        if (task.status === 'completed') {
            completed.push(task)
            return
        }
        
        if (!task.due_date) {
            noDueDate.push(task)
            return
        }
        
        const dueDate = new Date(task.due_date)
        dueDate.setHours(0, 0, 0, 0)
        
        if (dueDate < today) {
            overdue.push(task)
        } else if (dueDate.getTime() === today.getTime()) {
            todayTasks.push(task)
        } else {
            upcoming.push(task)
        }
    })
    
    const sections: TaskSection[] = []
    
    if (overdue.length > 0) {
        sections.push({
            id: 'overdue',
            title: 'Overdue',
            icon: <AlertCircle className="w-4 h-4 text-red-500" />,
            tasks: overdue,
            defaultOpen: true
        })
    }
    
    if (todayTasks.length > 0) {
        sections.push({
            id: 'today',
            title: 'Today',
            icon: <Clock className="w-4 h-4 text-yellow-500" />,
            tasks: todayTasks,
            defaultOpen: true
        })
    }
    
    if (upcoming.length > 0 || noDueDate.length > 0) {
        sections.push({
            id: 'upcoming',
            title: 'Upcoming',
            icon: <Calendar className="w-4 h-4 text-blue-500" />,
            tasks: [...upcoming, ...noDueDate].sort((a, b) => {
                if (!a.due_date) return 1
                if (!b.due_date) return -1
                return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
            }),
            defaultOpen: true
        })
    }
    
    if (completed.length > 0) {
        sections.push({
            id: 'completed',
            title: 'Completed',
            icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
            tasks: completed,
            defaultOpen: false
        })
    }
    
    return sections
}

// Status-based categorization (Pending, In Progress, Completed)
function categorizeByStatus(tasks: Task[]): TaskSection[] {
    const pending: Task[] = []
    const inProgress: Task[] = []
    const completed: Task[] = []
    
    tasks.forEach(task => {
        switch (task.status) {
            case 'completed':
                completed.push(task)
                break
            case 'in_progress':
                inProgress.push(task)
                break
            default:
                pending.push(task)
        }
    })
    
    const sections: TaskSection[] = []
    
    if (pending.length > 0) {
        sections.push({
            id: 'pending',
            title: 'Pending',
            icon: <Clock className="w-4 h-4 text-yellow-500" />,
            tasks: pending,
            defaultOpen: true
        })
    }
    
    if (inProgress.length > 0) {
        sections.push({
            id: 'in-progress',
            title: 'In Progress',
            icon: <Loader2 className="w-4 h-4 text-purple-500" />,
            tasks: inProgress,
            defaultOpen: true
        })
    }
    
    if (completed.length > 0) {
        sections.push({
            id: 'completed',
            title: 'Completed',
            icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
            tasks: completed,
            defaultOpen: false
        })
    }
    
    return sections
}

function TaskSectionComponent({ section }: { section: TaskSection }) {
    const [isOpen, setIsOpen] = useState(section.defaultOpen)
    
    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2">
                    {section.icon}
                    <span className="font-medium">{section.title}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {section.tasks.length}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2 pl-1">
                {section.tasks.map((task) => (
                    <TaskItem key={task.task_id} task={task} />
                ))}
            </CollapsibleContent>
        </Collapsible>
    )
}

const TaskList = ({ tasks = [] }: TaskListProps) => {
    const [groupingMode, setGroupingMode] = useState<GroupingMode>('time')
    
    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/50 flex items-center justify-center mb-4">
                    <ListTodo className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-1">No tasks yet</h3>
                <p className="text-muted-foreground text-sm">Create your first task to get started</p>
            </div>
        )
    }
    
    const sections = groupingMode === 'time' 
        ? categorizeByTime(tasks) 
        : categorizeByStatus(tasks)

    return (
        <div className="space-y-4">
            {/* Grouping Toggle */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Group by:</span>
                <ToggleGroup 
                    type="single" 
                    value={groupingMode} 
                    onValueChange={(value) => value && setGroupingMode(value as GroupingMode)}
                    className="bg-muted/50 border rounded-lg p-1"
                >
                    <ToggleGroupItem 
                        value="time" 
                        aria-label="Group by time"
                        className="data-[state=on]:bg-blue-500 data-[state=on]:text-white px-3 py-1.5 text-xs rounded-md transition-colors"
                    >
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        Time
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                        value="status" 
                        aria-label="Group by status"
                        className="data-[state=on]:bg-purple-500 data-[state=on]:text-white px-3 py-1.5 text-xs rounded-md transition-colors"
                    >
                        <ListChecks className="w-3.5 h-3.5 mr-1.5" />
                        Status
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
            
            {/* Task Sections */}
            {sections.map((section) => (
                <TaskSectionComponent key={section.id} section={section} />
            ))}
        </div>
    )
}

export default TaskList